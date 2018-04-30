import React, { Component } from 'react';
import Navbar from "./Navbar";
import { Card, CardImg, CardText, CardBody,
    CardTitle, CardSubtitle, Button } from 'reactstrap';
import axios from 'axios';
import url from '../serverurl';
import { Link } from 'react-router-dom';

import '../css/userhome.css';

class Userhome extends Component {

    constructor() {
        super();
        this.state = {
            projects: [],
            convertedProjectName: '',
            recommendedProjectIDs: [],
            recommendedProjects: [],
            username: '',
            userID: 0,
        };

        this.getAllPostedProjects = this.getAllPostedProjects.bind(this);
        this.getFirstThreeWords = this.getFirstThreeWords.bind(this);
        this.getRecommendations = this.getRecommendations.bind(this);
        this.checkSession = this.checkSession.bind(this);
    }

    componentWillMount() {
        this.checkSession();
        this.getAllPostedProjects();
        
    }

    checkSession() {
        axios.get(url + "/checksession", {withCredentials: true})
            .then((response) => {
                console.log("In checksession on Navbar",response.data);
                if(response.data.sessionUsername !== "ERROR") {
                    this.setState({
                        username: response.data.sessionUsername,
                        userID: response.data.sessionUserID
                    }, () => {
                        console.log("AFter checking session on userhome",this.state.userID);
                        this.getRecommendations();
                    })
                }
            })
    }

    getAllPostedProjects() {
        axios.get(url + '/get_all_posted_projects', { withCredentials: true })
            .then((response) => {
                console.log(response.data);
                this.setState({
                    projects: response.data.result
                })
            })
    }

    getFirstThreeWords(name) {
        var firstThreeWords = '';
        var stringToConvert = name;
        var wordArray = stringToConvert.split(' ');

        //form three word array
        if(wordArray.length > 3) {
            for(var i=0; i < 3;i++) {
                firstThreeWords += ' ' + wordArray[i] ;
            }
        } else {
            firstThreeWords = stringToConvert;
        }

        return firstThreeWords;

    }

    getRecommendations() {
        var p = '';
        var userId = this.state.userID;
        console.log("In getRecommendations", userId);
        var count = 4;

        function getRecs(callback) {
            axios.get(url + '/es/rec_projects_for_user/' + userId + '/' + count, { withCredentials: true })
                .then(function(response) {
                    callback(response);
                });
        }
        getRecs(function(response) {
            var data = {
                projectIDs: response.data.result
            }
            axios.post(url + '/getmultipleprojects', data ,{ withCredentials: true })
                .then((response) => {
                    console.log(response.data);
                    this.setState({
                        recommendedProjects: response.data.result
                    })
                })
        }.bind(this));

        
    }

    render() {

        let showAllProjects = [];

        if(this.state.projects === []) {
            showAllProjects = [];
        } else {
            showAllProjects = this.state.projects.map(p => {


                var firstWordsForProject = this.getFirstThreeWords(p.name);

                var firstWordsForNGO = this.getFirstThreeWords(p.ngoName);


                return (
                    <div key={p.id} className="projectCard">
                        <Card>
                            <CardImg top width="300px" height="300px" src= { p.imageUrl } alt="Card image cap" />
                            <CardBody id="cardBody">
                                <CardTitle id="cardTitle"><Link to={`/project/${ p.id }`}> { firstWordsForProject } </Link></CardTitle>
                                <CardSubtitle id="cardSubtitle"> <Link to={`/user/${ p.ngoUserId }`}> { firstWordsForNGO }</Link> </CardSubtitle>
                            </CardBody>
                        </Card>
                    </div>
                );
            })
        }

        let showRecommendedProjects = [];

        if(this.state.recommendedProjects === []) {
            showRecommendedProjects = [];
        } else {
            showRecommendedProjects = this.state.recommendedProjects.map(p => {
                var firstWordsForProject = this.getFirstThreeWords(p.name);
                var firstWordsForNGO = this.getFirstThreeWords(p.ngoName);

                return (
                    <div key={p.id} className="projectCard">
                        <Card>
                            <CardImg top width="300px" height="300px" src= { p.imageUrl } alt="Card image cap" />
                            <CardBody id="cardBody">
                                <CardTitle id="cardTitle"><Link to={`/project/${ p.id }`}> { firstWordsForProject } </Link></CardTitle>
                                <CardSubtitle id="cardSubtitle"> <Link to={`/user/${ p.ngoUserId }`}> { firstWordsForNGO }</Link> </CardSubtitle>
                            </CardBody>
                        </Card>
                    </div>
                );
            })
        }

        return(
            <div className="Userhome">
                <div id="ShowingBlackBackground">
                    <Navbar />
                </div>

                <div id="recommendedProjects">
                    <h1>Recommended Projects</h1>
                    <hr />
                    { showRecommendedProjects }
                </div>

                <div id="recommendedProjects">
                    <h1>All Projects</h1>
                    <hr />
                    { showAllProjects }
                </div>

            </div>
        );
    }
}

export default Userhome;