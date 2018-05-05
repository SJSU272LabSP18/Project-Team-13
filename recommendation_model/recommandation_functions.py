from pyspark.sql.types import *
from pyspark.sql.functions import udf, lit, current_timestamp, unix_timestamp

def convert_vector(x):
    '''Convert a list or numpy array to delimited token filter format'''
    return " ".join(["%s|%s" % (i, v) for i, v in enumerate(x)])

def reverse_convert(s):
    '''Convert a delimited token filter format string back to list format'''
    return  [float(f.split("|")[1]) for f in s.split(" ")]

def vector_to_struct(x, version, ts):
    '''Convert a vector to a SparkSQL Struct with string-format vector and version fields'''
    return (convert_vector(x), version, ts)

vector_struct = udf(vector_to_struct, \
                    StructType([StructField("factor", StringType(), True), \
                                StructField("version", StringType(), True),\
                                StructField("timestamp", LongType(), True)]))
######

from IPython.display import Image, HTML, display
 
def fn_query(query_vec, q="*", cosine=False):
    """
    Construct an Elasticsearch function score query.
    
    The query takes as parameters:
        - the field in the candidate document that contains the factor vector
        - the query vector
        - a flag indicating whether to use dot product or cosine similarity (normalized dot product) for scores
        
    The query vector passed in will be the user factor vector (if generating recommended projects for a user)
    or project factor vector (if generating similar projects for a given project)
    """
    return {
    "query": {
        "function_score": {
            "query" : { 
                "query_string": {
                    "query": q
                }
            },
            "script_score": {
                "script": {
                        "inline": "payload_vector_score",
                        "lang": "native",
                        "params": {
                            "field": "@model.factor",
                            "vector": query_vec,
                            "cosine" : cosine
                        }
                    }
            },
            "boost_mode": "replace"
        }
    }
}


def get_similar(the_id, q="*", num=10, index="weserve", dt="projects"):
    """
    Given a project id, execute the recommendation function score query to find similar projects, ranked by cosine similarity
    """
    response = es.get(index=index, doc_type=dt, id=the_id)
    src = response['_source']
    if '@model' in src and 'factor' in src['@model']:
        raw_vec = src['@model']['factor']
        # our script actually uses the list form for the query vector and handles conversion internally
        query_vec = reverse_convert(raw_vec)
        q = fn_query(query_vec, q=q, cosine=True)
        results = es.search(index, dt, body=q)
        hits = results['hits']['hits']
        return src, hits[1:num+1]
    
    
def get_user_recs(the_id, q="*", num=10, index="weserve"):
    """
    Given a user id, execute the recommendation function score query to find top projects, ranked by predicted rating
    """
    response = es.get(index=index, doc_type="users", id=the_id)
    src = response['_source']
    if '@model' in src and 'factor' in src['@model']:
        raw_vec = src['@model']['factor']
        # our script actually uses the list form for the query vector and handles conversion internally
        query_vec = reverse_convert(raw_vec)
        q = fn_query(query_vec, q=q, cosine=False)
        results = es.search(index, "projects", body=q)
        hits = results['hits']['hits']
        return src, hits[:num]

def get_projects_for_user(the_id, num=10, index="weserve"):
    """
    Given a user id, get the projects rated by that user, from highest- to lowest-rated.
    """
    response = es.search(index=index, doc_type="score", q="userId:%s" % the_id, size=num, sort=["score:desc"])
    hits = response['hits']['hits']
    ids = [h['_source']['projectId'] for h in hits]
    projects = es.mget(body={"ids": ids}, index=index, doc_type="projects", _source_include=['name'])
    project_hits = projects['docs']
    proj_names = [h['_source'] for h in project_hits]
    return proj_names

            
def display_user_recs(the_id, q="*", num=10, num_last=10, index="weserve"):
    user, recs = get_user_recs(the_id, q, num, index)
    user_projects = get_projects_for_user(the_id, num_last, index)
        
    # display the projcts that this user has rated highly
    display(HTML("<h2>Get recommended projects for user id %s</h2>" % the_id))
    display(HTML("<h4>The user has rated the following projects highly:</h4>"))
    user_html = "<table border=0>"
    i = 0
    for proj in user_projects:
        project_name = proj['name']
        user_html += "<td><h5>%s</h5></td>" % (project_name)
        i += 1
        if i % 5 == 0:
            user_html += "</tr><tr>"
    user_html += "</tr></table>"
    display(HTML(user_html))
    # now display the recommended projects for the user
    display(HTML("<br>"))
    display(HTML("<h2>User may also like:</h2>"))
    rec_html = "<table border=0>"
    i = 0
    for rec in recs:
        r_score = rec['_score']
        r_title = rec['_source']['name']
        rec_html += "<td><h5>%s</h5></td><td><h5>%2.3f</h5></td>" % (r_title, r_score)
        i += 1
        if i % 5 == 0:
            rec_html += "</tr><tr>"
    rec_html += "</tr></table>"
    display(HTML(rec_html))

    
def display_similar(the_id, q="*", num=10, index="weserve", dt="projects"):
    """
    Display projects, together with similar projects and similarity scores, in a table
    """
    project, recs = get_similar(the_id, q, num, index, dt)
        
    display(HTML("<h2>Get similar projects for:</h2>"))
    display(HTML("<h4>%s</h4>" % project['name']))
    display(HTML("<br>"))
    display(HTML("<h2>People who joined this project also joined these:</h2>"))
    sim_html = "<table border=0>"
    i = 0
    for rec in recs:
        r_score = rec['_score']
        r_title = rec['_source']['name']
        sim_html += "<td><h5>%s</h5></td><td><h5>%2.3f</h5></td>" % (r_title, r_score)
        i += 1
        if i % 5 == 0:
            sim_html += "</tr><tr>"
    sim_html += "</tr></table>"
    display(HTML(sim_html))
