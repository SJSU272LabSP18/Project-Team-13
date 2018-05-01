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
            region: '',
            ngoName: '',
            ngoId: '',
            need: '',
            beneficiaries: '',
            funding: '',
            recommendedUsers: [],
            loggedInUserType: '',
            loggedInUsername: '',
            loggedInUserID: ''

        }
        this.getProject = this.getProject.bind(this);
        this.getVolunteers = this.getVolunteers.bind(this);
        this.checkSession = this.checkSession.bind(this);
    }

    componentWillMount() {
        this.getProject();
        //replace this with Matthew's elastic search query
        this.checkSession();
        this.getVolunteers();

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
                }
            })
    }


    getVolunteers() {
        var tempArray = [];
        var user1 = {
            image: 'https://source.unsplash.com/Kfk-TPxLVL0',
            name: 'Venkatesh Devale',
            type: 'volunteer',
            email: 'venkatesh@devale.com',
            region: 'India'
        };
        var user2 = {
            image: 'https://source.unsplash.com/Kfk-TPxLVL0',
            name: 'Sajjan',
            type: 'volunteer',
            email: 's@j.com',
            region: 'India'
        };
        tempArray.push(user1);
        tempArray.push(user2);
        this.setState({
            recommendedUsers: tempArray
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
                })
            })
    }


    render() {

        let recommendedUsersToShow = null;
        let hireButton = null;
        if(this.state.ngoId === this.state.loggedInUserID) {
            hireButton = <button className="btn-primary">Hire</button>;
        }
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
                               <p> { u.name } </p>
                           </div>
                       </td>
                       <td>
                           <div>
                               <p> { u.type } </p>
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
                                   { hireButton }
                               </div>
                           </div>
                       </td>
                   </tr>
               );
            });
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



                            <div id="recommendedVOrC">
                                <h1>Recommended Volunteers</h1>
                                <hr/>

                                <table className='table table-hover'>
                                    <thead>
                                    <tr className='table-secondary'>
                                        <th id='volunteerImage'>Image</th>
                                        <th id='volunteerName'>Name</th>
                                        <th id='volunteerType'>Type</th>
                                        <th id='volunteerEmail'>Email</th>
                                        <th id='volunteerRegion'>Region</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                        { recommendedUsersToShow }
                                    </tbody>

                                </table>
                            </div>

                            {/*showing dumy volunteers*/}


                        </div>
                    </div>

                </div>

            </div>
        );
    }
}

export default Project;