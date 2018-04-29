var express = require('express');
var router = express.Router();
var elasticsearch = require('elasticsearch');


// Instantiate client
var client = new elasticsearch.Client({
  host: 'ec2-34-211-106-82.us-west-2.compute.amazonaws.com:9200',
  log: 'trace',
  apiVersion: '5.4'
});

// ping client
client.ping({
    requestTimeout: 3000
}, function (error) {
    if (error) {
      console.trace('Elasticsearch is down');
    } else {
      console.log('All is well');
    }
});

// get request on dummy data ==> test/movies/3
client.get({
    index: 'test',
    type: 'movies',
    id: 3
}, function (error) {
    if (error) {
        console.trace('cannot get test/movies/3')
    }
})

// var indexName = 'weserve'

// check if index exists
router.get('/exists/:index', function(req,res) {  
    res = elasticClient.indices.exists({
        index: indexName
    }, function (error) {
        if (error) {
            console.trace('exists request failed')
        }
    });
});

// get specific
router.get('/:index/:type/:id', function(req,res) {
    console.log(req)
    res = client.get({
        index: req.params.index,
        type: req.params.type,
        id: req.params.id
    }, function (error) {
        if (error) {
            console.trace('cannot get %s/%s/%d', req.params.index, req.params.type, req.params.id)
        }
    });
});

module.exports = router;