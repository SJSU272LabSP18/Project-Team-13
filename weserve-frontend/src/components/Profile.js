import React, { Component } from 'react';
import Navbar from "./Navbar";
import '../css/profile.css';
import url from '../serverurl';
import axios from 'axios';


class Profile extends Component {

    constructor(){
        super();

        this.state = {
            firstname: "",
            lastname: "",
            email: "",
            phone: "",
            description: "",
            region:"",
            image: ''
        }
        //this.handleClick = this.handleClick.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleChange(e) {
        const {name, value} =e.target;
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    componentWillMount(){
        const userId = this.props.match.params.value;
        console.log("in profile component will mount", userId);
        const user = {
            userid: userId
        }
        axios.post(url + '/get_user_info' , user ,{withCredentials: true})
            .then((response) => {
            console.log("in profile",response.data.result[0]);
        this.setState({
            firstname: response.data.result[0].firstName,
            lastname: response.data.result[0].lastName,
            email: response.data.result[0].email,
            phone: response.data.result[0].phone,
            description: response.data.result[0].description,
            region: response.data.result[0].region,
            image: response.data.result[0].image
        })
    })
    }


    handleSubmit(e){
        e.preventDefault();
        console.log("Inside user profile" );
        var userDetails = {
            firstname: this.state.firstname,
            lastname: this.state.lastname,
            email: this.state.email,
            phone: this.state.phone,
            description: this.state.description,
            region: this.state.region
        }
        axios.post(url + '/profile', userDetails , {withCredentials :true})
            .then((response) => {
            console.log(response.data);
        if(response.data.message === 'success'){
            alert('Updated successfully');
            this.props.history.push('/userhome');
        }
        else{
            alert("error");
        }
    })
    }

    render() {
        return(
            <div className="Profile">
            <div id="ShowingBlackBackground">
            <Navbar />
            </div>
            <div class="container">
            <hr />
            <div class="row">
            <div class="col-md-3">
            <div class="text-center">

            <img id="imgProfile" src={this.state.image} class="img-rounded img-responsive" alt="" />
            <h5></h5>
            </div>
            </div>
            <div class="col-md-9 personal-info">
            <h3>Personal Info</h3>

        <form class="form-horizontal" role="form" onSubmit={this.handleSubmit}>
    <div class="form-group">
            <label class="col-lg-3 control-label">First name:</label>
        <div class="col-lg-8">
            <input class="form-control" type="text"  name="firstname" id="fname"  value={this.state.firstname} onChange={this.handleChange} disabled></input>
        </div>
        </div>
        <div class="form-group">
            <label class="col-lg-3 control-label">Last name :</label>
        <div class="col-lg-8">
            <input class="form-control" type="text"  name="lastname" id="lname"  value={this.state.lastname} onChange={this.handleChange} disabled/>
        </div>
        </div>
        <div class="form-group">
            <label class="col-lg-3 control-label">Email :</label>
        <div class="col-lg-8">
            <input class="form-control" type="text"  name="email" id="email"   value={this.state.email} onChange={this.handleChange} disabled/>
        </div>
        </div>
        <div class="form-group">
            <label class="col-lg-3 control-label">About Me :</label>
        <div class="col-lg-8">
            <textArea class="form-control"   name="description" id="description"  onChange={this.handleChange} disabled>{this.state.description}</textArea>
        </div>
        </div>
        <div class="form-group">
            <label class="col-lg-3 control-label">Region :</label>
        <div class="col-lg-8">
            <input class="form-control" type="text"  name="region" id="region"  value={this.state.region} onChange={this.handleChange} disabled/>
        </div>
        </div>
        </form>
        </div>
        </div>
        </div>
        </div>
    );
    }

}

export default Profile;