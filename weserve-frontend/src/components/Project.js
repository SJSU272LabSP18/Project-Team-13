import React, { Component } from 'react';
import Navbar from "./Navbar";
import axios from 'axios';
import url from '../serverurl';
import Footer from './Footer';
import '../css/project.css';

class Project extends Component {

    constructor() {
        super();
        this.state = {
            projectID: '',
            projectName: '',
            ngoName: '',
            image: '',
            description: '',
            region: ''
        }
        this.getProject = this.getProject.bind(this);
    }

    componentWillMount() {
        this.getProject();
    }

    getProject() {
        var data = {
            projectID: this.props.match.params.value
        }
        axios.post(url + '/getspecificproject', data ,{ withCredentials: true })
            .then((response) => {
                console.log(response.data);
                this.setState({
                    projectID: response.data.result[0].projectID,
                    projectName: response.data.result[0].projectName,
                    image: response.data.result[0].image,
                    description: response.data.result[0].description,
                    region: response.data.result[0].region
                })
            })
    }

    render() {
        return(
            <div className="Project">
                <div id="ShowingBlackBackground">
                    <Navbar />
                </div>
                <div className="container">
                    <div id="projectName">
                        <h1 className="my-4">{this.state.projectName}

                        </h1>
                        <div className="row">
                            <div className="col-md-8">
                                <img className="img-fluid" src= { this.state.image }  alt="" width="100%" height="100%"/>
                            </div>
                            <div className="col-md-4">
                                <h3 className="my-3">Project Description</h3>
                                <p> { this.state.description } </p>
                            </div>

                            <div id="recommendedVOrC">
                                <h1>Recommended Volunteers</h1>
                                <hr/>
                            </div>

                        </div>
                    </div>

                </div>

            </div>
        );
    }
}

export default Project;