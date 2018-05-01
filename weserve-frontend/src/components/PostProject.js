import React from 'react';
import Navbar from "./Navbar";
import url from '../serverurl';
import axios from 'axios';
import swal from 'sweetalert';
import uuid from 'uuid';

class PostProject extends React.Component{
    constructor(){
        super();
        this.state = {
            ngoName: "",
            region: "",
            region: "",
            image: "",
            name: "",
            scope: "",
            need: "",
            beneficiaries: "",
            funding: "",
            contact:"",
            editing: false,
            disabled: true
        }

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
        const {name, value} = e.target;
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleSubmit(e){
        e.preventDefault();
        console.log("inside post project");
        var projectDetails = {
            ngoUserId: uuid.v4(),
            ngoName: this.state.ngoName,
            region: this.state.region,
            image: this.state.image,
            name: this.state.name,
            scope: this.state.scope,
            need: this.state.need,
            beneficiaries: this.state.beneficiaries,
            funding: this.state.funding,
            contact: this.state.contact,
        }
        axios.post(url + '/postproject', projectDetails, {withCredentials :true})
            .then((response) => {
            console.log(response.data);
        if(response.data.message === 'Project posted Successfully'){
            swal(response.data.message);
            this.props.history.push('/userhome');
        } else {
            swal(response.data.message);
        }
    })
    }

    render(){


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
            <img src="" class="img-rounded img-responsive" alt="" />
            </div>
            </div>
            <div class="col-md-9 personal-info">
            <h3>Enter Project Details</h3>

        <form class="form-horizontal" role="form" onSubmit={this.handleSubmit}>
    <div class="form-group">
            <label class="col-lg-3 control-label">Name of NGO:</label>
        <div class="col-lg-8">
            <input class="form-control" type="text"  name="ngoName" id="ngoName"  onChange={this.handleChange}></input>
        </div>
        </div>
        <div class="form-group">
            <label class="col-lg-3 control-label">Region :</label>
        <div class="col-lg-8">
            <input class="form-control" type="text"  name="region" id="region"  onChange={this.handleChange}/>
        </div>
        </div>
        <div class="form-group">
            <label class="col-lg-3 control-label">Upload Image (Only Link):</label>
        <div class="col-lg-8">
            <input class="form-control" type="text"  name="image" id="image"  onChange={this.handleChange}/>
        </div>
        </div>
        <div class="form-group">
            <label class="col-lg-3 control-label">Name of Project :</label>
        <div class="col-lg-8">
            <input class="form-control" type="text"  name="name" id="name"   onChange={this.handleChange}/>
        </div>
        </div>
        <div class="form-group">
            <label class="col-lg-3 control-label">Scope of Project :</label>
        <div class="col-lg-8">
            <textArea class="form-control" type="text"  name="scope" id="scope"  onChange={this.handleChange}></textArea>
        </div>
        </div>
        <div class="form-group">
            <label class="col-lg-3 control-label">Need :</label>
        <div class="col-lg-8">
            <textArea class="form-control" type="text"  name="need" id="need"  onChange={this.handleChange}></textArea>
        </div>
        </div>
        <div class="form-group">
            <label class="col-lg-3 control-label">Beneficiaries :</label>
        <div class="col-lg-8">
            <textArea class="form-control" type="text"  name="beneficiaries" id="beneficiaries"  onChange={this.handleChange}></textArea>
        </div>
        </div>
        <div class="form-group">
            <label class="col-lg-3 control-label">Total Fundings for the Project :</label>
        <div class="col-lg-8">
            <input class="form-control" type="text"  name="funding" id="funding"  onChange={this.handleChange} />
        </div>
        </div>
        <div class="form-group">
            <label class="col-lg-3 control-label">Contact (Email) :</label>
        <div class="col-lg-8">
            <input class="form-control" type="email"  name="contact" id="contact"   onChange={this.handleChange}/>
        </div>
        </div>
        <div class='form-group'>
            <div class='col-lg-8'>
            <button type="submit" class="btn btn-primary"  name="save" id="save" >Post Project</button>
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

export default PostProject;