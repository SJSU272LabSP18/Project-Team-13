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
            projects: []
        }

        this.handleProjectClick = this.handleProjectClick.bind(this);
        this.handleNGOProfileClick = this.handleNGOProfileClick.bind(this);
        this.getAllPostedProjects = this.getAllPostedProjects.bind(this);
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

    handleProjectClick(e) {
        e.preventDefault();
        alert("On Project Click");
        this.props.history.push('/project');
    }

    handleNGOProfileClick(e) {
        e.preventDefault();
        alert("On NGO Profile Click");
    }

    render() {

        let showAllProjects = [];

        if(this.state.projects === []) {
            showAllProjects = [];
        } else {
            showAllProjects = this.state.projects.map(p => {
                return (
                    <div key={p.projectID} className="projectCard">
                        <Card>
                            <CardImg top width="300px" height="300px" src= { p.image } alt="Card image cap" />
                            <CardBody id="cardBody">
                                <CardTitle><Link to={`/project/${ p.projectID }`}> {p.projectName} </Link></CardTitle>
                                <CardSubtitle> <a onClick={ this.handleNGOProfileClick } href='#'>Project Owner(NGO) should be link</a></CardSubtitle>
                                {/*<CardText>{ p.description }</CardText>*/}
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