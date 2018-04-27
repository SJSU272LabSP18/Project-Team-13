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
            convertedProjectName: ''
        };

        this.getAllPostedProjects = this.getAllPostedProjects.bind(this);
        this.getFirstThreeWords = this.getFirstThreeWords.bind(this);
    }



    componentWillMount() {
        this.getAllPostedProjects();
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
        if(wordArray.length > 4) {
            for(var i=0; i < 4;i++) {
                firstThreeWords += ' ' + wordArray[i] ;
            }
        } else {
            firstThreeWords = stringToConvert;
        }

        return firstThreeWords;

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



        return(
            <div className="Userhome">

                <div id="ShowingBlackBackground">
                    <Navbar />
                </div>


                <div id="showAllProjects">
                    { showAllProjects }
                </div>


                <div id="recommendedProjects">
                    <h1>Recommended Projects</h1>
                    <hr />
                </div>

            </div>
        );
    }

}

export default Userhome;