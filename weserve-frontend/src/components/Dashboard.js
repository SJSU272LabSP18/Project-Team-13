import React, { Component } from 'react';
import Navbar from "./Navbar";
import '../css/dashboard.css';
import axios from "axios/index";
import url from "../serverurl";
import swal from "sweetalert";

class Dashboard extends Component {

    constructor() {
        super();
        this.state = {
            loggedInUserType: '',
            loggedInUsername: '',
            loggedInUserID: '',
            message: '',
            projects: [],
            tableName: '',
            interestedProjects: [],
            message1: ''
        }
        this.checkSession = this.checkSession.bind(this);
        this.getCurrentWorkingProjects = this.getCurrentWorkingProjects.bind(this);
        this.getNGOPostedProjects = this.getNGOPostedProjects.bind(this);
        this.getInterestedProjects = this.getInterestedProjects.bind(this);
    }

    componentWillMount() {
        this.checkSession();

    }

    getInterestedProjects() {
        var user  = {
            userid: this.state.loggedInUserID
        }

        axios.post(url + '/getAllInterestedProjects', user, { withCredentials: true } )
            .then((response) => {
                console.log(response.data);
                if (response.data.message === "Got all interested projects successfully") {
                    this.setState({
                        message1: '',
                        interestedProjects: response.data.result,
                    })
                }
                else if (response.data.message === "No interested projects yet") {
                    this.setState({
                        message1: 'No interested projects yet'
                    })

                }
            })
    }


    getNGOPostedProjects() {
        var ngoid= this.state.loggedInUserID;
        axios.get(url + '/getNGOPostedProjects/' + ngoid, { withCredentials: true } )
            .then((response) => {
                console.log(response.data);
                if(response.data.message === "Got all posted projects successfully") {
                    this.setState({
                        message: '',
                        projects: response.data.result,
                        tableName: "Your Posted Projects"
                    })
                }
                else if( response.data.message === "No projects posted yet" ) {
                    this.setState({
                        message: 'No projects posted yet'
                    })
                }
            })
    }

    getCurrentWorkingProjects() {
        var userid= this.state.loggedInUserID;
        axios.get(url + '/getCurrentWorkingProjects/' + userid, { withCredentials: true } )
            .then((response) => {
                console.log(response.data);
                if (response.data.message === "Got all current working projects successfully") {
                    this.setState({
                        message: '',
                        projects: response.data.result,
                        tableName: "Your Current Working Projects"
                    })
                }
                else if (response.data.message === "No current working projects") {
                    this.setState({
                        tableName: "Your Current Working Projects",
                        message: 'No current working projects'
                    })

                }
            })
    }

    checkSession() {
        axios.get(url + "/checksession", {withCredentials: true})
            .then((response) => {
                console.log("In checksession on dashboard page",response.data);
                if(response.data.sessionUsername !== "ERROR") {
                    this.setState({
                        loggedInUsername: response.data.sessionUsername,
                        loggedInUserID: response.data.sessionUserID,
                        loggedInUserType: response.data.usertype
                    }, ()=> {
                        console.log("after checking session on dashboard page:", this.state.loggedInUserID);
                        if(this.state.loggedInUserType === 'ngo') {
                            this.getNGOPostedProjects();
                        } else {

                                this.getCurrentWorkingProjects();
                                this.getInterestedProjects();
                        }
                    })
                } else {
                    swal("Please login first");
                    this.props.history.push('/login');
                }
            })
    }

    render() {

        let changes = null;
        let projectsToShow = null;
        let interestedProjectsToShow = null;


        if(this.state.loggedInUserType === "volunteer" || this.state.loggedInUserType === 'consultant') {


            //interestedProjectsToShow
            if(this.state.interestedProjects === []) {
                interestedProjectsToShow = [];
            } else {
                interestedProjectsToShow = this.state.interestedProjects.map( p => {
                    return (
                        <tr key={p.id} onClick={() => window.location.href = '/project/' + p.projectid}>
                            <td>
                                <div>
                                    <img id="project_image" src={ p.imageUrl } alt='project image'/>
                                </div>
                            </td>
                            <td>
                                <div>
                                    <p> { p.name } </p>
                                </div>
                            </td>
                            <td>
                                <div>
                                    <p> { p.region } </p>
                                </div>
                            </td>
                            <td>
                                <div>
                                    <p> { p.contact } </p>
                                </div>
                            </td>
                        </tr>
                    );
                });
            }


            changes = (
                <div id="interestedProjects">
                    <h1> Your Interested Projects </h1>
                    <hr/>

                    <table className='table table-hover'>
                        <thead>
                        <tr className='table-secondary'>
                            <th id='projectImage'>Image</th>
                            <th id='projectName'>Name</th>
                            <th id='projectRegion'>Region</th>
                            <th id='projectContact'>Contact</th>
                        </tr>
                        </thead>
                        <tbody>
                        { interestedProjectsToShow }
                        </tbody>

                    </table>
                    <div>
                        { this.state.message1 }
                    </div>
                </div>
            );
        }





        //projectsToShow
            if(this.state.projects === []) {
                projectsToShow = [];
            } else {
                projectsToShow = this.state.projects.map( p => {
                    return (
                        <tr key={p.id} onClick={() => window.location.href = '/project/' + p.id}>
                            <td>
                                <div>
                                    <img id="project_image" src={ p.imageUrl } alt='project image'/>
                                </div>
                            </td>
                            <td>
                                <div>
                                    <p> { p.name } </p>
                                </div>
                            </td>
                            <td>
                                <div>
                                    <p> { p.region } </p>
                                </div>
                            </td>
                            <td>
                                <div>
                                    <p> { p.contact } </p>
                                </div>
                            </td>
                        </tr>
                    );
                });
            }





        return(
            <div className="Dashboard">

                <div id="ShowingBlackBackground">
                    <Navbar />
                </div>


                <div id="projects">
                    <h1> { this.state.tableName } </h1>
                    <hr/>

                    <table className='table table-hover'>
                        <thead>
                        <tr className='table-secondary'>
                            <th id='projectImage'>Image</th>
                            <th id='projectName'>Name</th>
                            <th id='projectRegion'>Region</th>
                            <th id='projectContact'>Contact</th>
                        </tr>
                        </thead>
                        <tbody>
                        { projectsToShow }
                        </tbody>

                    </table>
                    <div>
                        { this.state.message }
                    </div>
                </div>


                { changes }


            </div>
        );
    }

}

export default Dashboard;