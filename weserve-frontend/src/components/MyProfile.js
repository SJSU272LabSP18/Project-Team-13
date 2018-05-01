import React, { Component } from 'react';
import Navbar from "./Navbar";
import '../css/myprofile.css';
import url from '../serverurl';
import axios from 'axios';
//import image from '../img/stevejobs.jpg';


class MyProfile extends Component {

    constructor(){
        super();

        this.state = {
            firstname: "",
            lastname: "",
            email: "",
            phone: "",
            description: "",
            region:"",
            profile:[],
            editing: false,
            disabled: true,
            image: '',
            username: ''
        }
        //this.handleClick = this.handleClick.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    edit() {
        this.setState({
            editing: true,
            disabled: false
        })
    }
    cancel() {
        this.setState({
            editing: false,
            disabled: true
        })
    }
    handleChange(e) {
        const {name, value} =e.target;
        this.setState({
            [e.target.name]: e.target.value
        })
        if(name == 'image'){
            var data =new FormData();
            data.append('file', e.target.files[0]);
            data.append('firstname', this.state.username);
            this.upload(data);
        }
    }
    upload(data) {
        console.log('in upload data');
        axios.post(url + '/upload', data , {withCredentials: true})
            .then((response) => {
            console.log('Res in upload', response);
    }).catch((err) => {
            console.log("error in upload", err);
    })
    }

    componentWillMount(){
        axios.get(url + "/checksession", {withCredentials: true})
            .then((response) => {
            console.log("In checksession on Navbar",response.data);
        if(response.data.sessionUsername !== "ERROR") {
            const user = {
                userid: response.data.sessionUsername
            }
            console.log("in profile component will mount", user);
            this.setState({
                username: response.data.sessionUsername
            })
            axios.post(url + '/get_logged_user_info' , user ,{withCredentials: true})
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
    })
    }


    handleSubmit(e){
        e.preventDefault();
        console.log("Inside user profile" );
        var userDetails = {
            firstname: this.state.firstname,
            lastname: this.state.lastname,
            email: this.state.email,
            description: this.state.description,
            region: this.state.region
        }
        //console.log(this.state.image);
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

        const username = this.state.username;
        let button = null;
        if(this.state.editing == false){
            button = (
                <div class="form-group">
                <div class="col-lg-3">
                <button type="button" onClick={this.edit.bind(this)} class="btn btn-primary form-control"><label> Edit your profile </label></button>
            </div>
            </div>
        )
        } else {
            button = (
                <div class="form-group">
                <div class="btn-group">
                <button type="reset" onClick={this.cancel.bind(this)} class="btn btn-primary form-control"><label>Cancel</label></button>
            </div>
            </div>
        )
        }
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
            <img src={this.state.image} class="img-rounded img-responsive" alt="" />
            <h5></h5>
            </div>
            </div>
            <div class="col-md-9 personal-info">
            <h3>Personal Info</h3>

        <form class="form-horizontal" role="form" onSubmit={this.handleSubmit}>
    <div class="form-group">
            <label class="col-lg-3 control-label">First name:</label>
        <div class="col-lg-8">
            <input class="form-control" type="text"  name="firstname" id="fname" disabled={this.state.disabled} value={this.state.firstname} onChange={this.handleChange}></input>
        </div>
        </div>
        <div class="form-group">
            <label class="col-lg-3 control-label">Last name :</label>
        <div class="col-lg-8">
            <input class="form-control" type="text"  name="lastname" id="lname" disabled={this.state.disabled} value={this.state.lastname} onChange={this.handleChange}/>
        </div>
        </div>
        <div class="form-group">
            <label class="col-lg-3 control-label">Upload Image (Only Link):</label>
        <div class="col-lg-8">
            <input class="form-control" type="text"  name="image" id="image" disabled={this.state.disabled} onChange={this.handleChange}/>
        </div>
        </div>
        <div class="form-group">
            <label class="col-lg-3 control-label">Email :</label>
        <div class="col-lg-8">
            <input class="form-control" type="email"  name="email" id="email"  disabled={this.state.disabled} value={this.state.email} onChange={this.handleChange}/>
        </div>
        </div>
        <div class="form-group">
            <label class="col-lg-3 control-label">About Me :</label>
        <div class="col-lg-8">
            <textArea class="form-control" type="text"  name="description" id="description" disabled={this.state.disabled}  onChange={this.handleChange}>{this.state.description}</textArea>
        </div>
        </div>
        <div class="form-group">
            <label class="col-lg-3 control-label">Region :</label>
        <div class="col-lg-8">
            <input class="form-control" type="text"  name="region" id="region" disabled={this.state.disabled} value={this.state.region} onChange={this.handleChange}/>
        </div>
        </div>
        <div class='form-group'>
            <div class='col-lg-8'>
            <button type="submit" class="btn btn-primary"  name="save" id="save" >Save Changes</button>
        </div>
        </div>
        {button}
    </form>
        </div>
        </div>
        </div>
        </div>
    );
    }

}

export default MyProfile;