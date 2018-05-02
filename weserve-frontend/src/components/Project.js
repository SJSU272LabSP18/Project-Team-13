import React, { Component } from 'react';
import Navbar from "./Navbar";
import axios from 'axios';
import url from '../serverurl';
import Footer from './Footer';
import '../css/project.css';
import swal from 'sweetalert';
import { Link } from 'react-router-dom';

class Project extends Component {

    constructor() {
        super();
        this.state = {
            projectID: '',
            projectName: '',
            ngoName: '',
            image: '',
            description: '',
            region: '',
            ngoName: '',
            ngoId: '',
            need: '',
            beneficiaries: '',
            funding: '',
            recommendedUsers: [],
            loggedInUserType: '',
            loggedInUsername: '',
            loggedInUserID: '',
            message: '',
            currentHiredVolunteers: []
        }
        this.getProject = this.getProject.bind(this);
        this.getRecommendedUsers = this.getRecommendedUsers.bind(this);
        this.checkSession = this.checkSession.bind(this);
        this.handleHireButtonClick = this.handleHireButtonClick.bind(this);
        this.getHiredVolunteersForThisProject = this.getHiredVolunteersForThisProject.bind(this);
    }

    componentWillMount() {
        this.getProject();
        this.checkSession();
        this.getHiredVolunteersForThisProject();
    }

    getHiredVolunteersForThisProject() {
        var project = {
            projectid: this.props.match.params.value
        }
        axios.post(url + '/getAllVolunteersForProject', project, { withCredentials: true })
            .then((response) => {
                console.log("After getAllVolunteersForProject", response.data);
                if(response.data.message === "Got all hired volunteers successfully") {
                    this.setState({
                        currentHiredVolunteers: response.data.result,
                        message: ''
                    })
                } else if(response.data.message === "No hired volunteers yet") {
                    this.setState({
                        message: "No volunteers hired yet"
                    })
                }
            })
    }



    checkSession() {
        axios.get(url + "/checksession", {withCredentials: true})
            .then((response) => {
                console.log("In checksession on project details page",response.data);
                if(response.data.sessionUsername !== "ERROR") {
                    this.setState({
                        loggedInUsername: response.data.sessionUsername,
                        loggedInUserID: response.data.sessionUserID,
                        loggedInUserType: response.data.usertype
                    }, ()=> {
                        console.log("after checking session on project details page:", this.state.loggedInUserID);
                    })
                } else {
                    swal("Please login again");
                    this.props.history.push('/login');
                }
            })
    }

    getProject() {
        var data = {
            projectID: this.props.match.params.value
        }
        axios.post(url + '/getspecificproject', data ,{ withCredentials: true })
            .then((response) => {
                console.log(response.data);
                this.setState({
                    projectID: response.data.result[0].id,
                    projectName: response.data.result[0].name,
                    image: response.data.result[0].imageUrl,
                    description: response.data.result[0].scope,
                    region: response.data.result[0].region,
                    ngoName: response.data.result[0].ngoName,
                    ngoId: response.data.result[0].ngoUserId,
                    need: response.data.result[0].need,
                    beneficiaries: response.data.result[0].beneficiaries,
                    funding: response.data.result[0].funding
                }, () => {
                    console.log("After getting specific project on project page",this.state.projectID);
                    this.getRecommendedUsers();
                })
            })
    }

    getRecommendedUsers() {
        var projectId = this.state.projectID;
        console.log("In getRecommendedUsers", projectId);
        var count = 10;

        function getRecs(callback) {
            axios.get(url + '/es/rec_users_for_project/' + projectId + '/' + count, { withCredentials: true })
                .then(function(response) {
                    callback(response);
                });
        }
        getRecs(function(response) {
            var data = {
                userIDs: response.data.result
            }
            axios.post(url + '/getmultipleusers', data ,{ withCredentials: true })
                .then((response) => {
                    console.log(response.data);
                    this.setState({
                        recommendedUsers: response.data.result
                    })
                })
        }.bind(this));
    }

    handleHireButtonClick(e) {
        e.preventDefault();
        var userid = e.target.id;
        var projectid = this.state.projectID;
        var user = {
            userid: Number(userid),
            projectid: projectid
        }
        console.log("User in handleHireButtonClick", user);
        axios.post(url + '/saveVolunteerForProject', user, { withCredentials: true })
            .then((response) => {
                console.log(response.data);
                if(response.data.message === "Volunteer Hired") {
                    swal(response.data.message, "", "success");
                    window.location.reload(true);
                }
                else if(response.data.message === "This volunteer is already hired, check current volunteers above") {
                    swal(response.data.message, "", "warning");
                }
            })
    }

    render() {
        let recommendedUsersToShow = null;
        let currentHiredUsersToShow = null;
        let changes = null;
        let hireButton = null;
        var buttonStyle = {
            display: "none"
        }

        if(this.state.ngoId === this.state.loggedInUserID) {
            buttonStyle.display = "block"

            //hiredCurrentUsers
            if(this.state.currentHiredVolunteers === []) {
                currentHiredUsersToShow = [];
            } else {
                currentHiredUsersToShow = this.state.currentHiredVolunteers.map( u => {
                    return (
                        <tr key={u.name} onClick={() => window.location.href = '/profile/' + u.id}>
                            <td>
                                <div>
                                    <img id="volunteer_user_image" src={ u.image } alt='user image'/>
                                </div>
                            </td>
                            <td>
                                <div>
                                    <p> { u.firstName } {u.lastName} </p>
                                </div>
                            </td>
                            <td>
                                <div>
                                    <p> { u.email } </p>
                                </div>
                            </td>
                            <td>
                                <div>
                                    <p> { u.region } </p>
                                </div>
                            </td>
                        </tr>
                    );
                });
            }

            //recommendedUsers
            if(this.state.recommendedUsers === []) {
                recommendedUsersToShow = [];
            } else {
                recommendedUsersToShow = this.state.recommendedUsers.map( u => {

                    return (
                        <tr key={u.name}>
                            <td>
                                <div>
                                    <img id="volunteer_user_image" src={ u.image } alt='user image'/>
                                </div>
                            </td>
                            <td>
                                <div>
                                    <p> { u.firstName } {u.lastName} </p>
                                </div>
                            </td>
                            <td>
                                <div>
                                    <p> { u.email } </p>
                                </div>
                            </td>
                            <td>
                                <div>
                                    <p> { u.region } </p>
                                    <div>
                                        <button id={ u.userID } style={ buttonStyle } onClick={ this.handleHireButtonClick } className="btn-primary">Hire</button>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    );
                });
            }


            changes = (
                <div id="changes">

                    <div id="currentHiredVorC">
                        <h1>Hired Volunteers</h1>
                        <hr/>
                        <div>
                            { this.state.message }
                        </div>
                        <br/>
                        <table className='table table-hover'>
                            <thead>
                            <tr className='table-secondary'>
                                <th id='volunteerImage'>Image</th>
                                <th id='volunteerName'>Name</th>
                                <th id='volunteerEmail'>Email</th>
                                <th id='volunteerRegion'>Region</th>
                            </tr>
                            </thead>
                            <tbody>
                            { currentHiredUsersToShow }
                            </tbody>

                        </table>
                    </div>

                    <div id="recommendedVOrC">
                        <h1>Recommended Volunteers</h1>
                        <hr/>

                        <table className='table table-hover'>
                            <thead>
                            <tr className='table-secondary'>
                                <th id='volunteerImage'>Image</th>
                                <th id='volunteerName'>Name</th>
                                <th id='volunteerEmail'>Email</th>
                                <th id='volunteerRegion'>Region</th>
                            </tr>
                            </thead>
                            <tbody>
                            { recommendedUsersToShow }
                            </tbody>

                        </table>
                    </div>
                </div>

            );
        }



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
                            <div id="imageDiv" className="col-md-8">
                                <img className="img-fluid" src= { this.state.image }  alt="" width="100%" height="100%"/>
                                <br/>
                                <div className="col-md-4 float-left">
                                    <h3 className="my-3">Posted By</h3>
                                    <p> { this.state.ngoName } </p>
                                </div>
                                <div className="col-md-4 float-left">
                                    <h3 className="my-3">Region</h3>
                                    <p> { this.state.region } </p>
                                </div>
                            </div>

                            <div className="col-md-4">
                                <h3 className="my-3">Description</h3>
                                <p> { this.state.description } </p>
                                <h3 className="my-3">Need</h3>
                                <p> { this.state.need } </p>
                                <h3 className="my-3">Funding</h3>
                                <p> { this.state.funding } </p>
                                <h3 className="my-3">Beneficiaries</h3>
                                <p> { this.state.beneficiaries } </p>
                            </div>

                            { changes }


                        </div>
                    </div>

                </div>

            </div>
        );
    }
}

export default Project;