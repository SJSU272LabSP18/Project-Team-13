import React, { Component } from 'react';
import '../css/signup.css';
import url from '../serverurl';
import axios from 'axios';
import uuid from 'uuid';
import swal from 'sweetalert';

class Signup extends Component {

    constructor() {
        super();
        this.state = {
            message: "",
            display: "none",
            username: "",
            email: "",
            password: "",
            confirmpassword: ""
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleSubmit(e) {
        e.preventDefault();
        console.log("In Side Signup handle Submit");
        var usertype = null;

        if(document.getElementById("radioButtonNGO").checked === true) {
            usertype = "ngo";
        } else if(document.getElementById("radioButtonVolunteer").checked === true) {
            usertype = "volunteer";
        } else if(document.getElementById("radioButtonProBono").checked === true) {
            usertype = "consultant";
        }

        if(usertype !== null) {
            if(this.state.password === this.state.confirmpassword) {
                var user = {
                    id: uuid.v4(),
                    username: this.state.username,
                    email: this.state.email,
                    password: this.state.password,
                    usertype: usertype
                }
                this.setState({
                    message: "",
                    display: 'none'
                })

                axios.post(url + '/signup', user, {withCredentials:true})
                    .then((response) => {
                        console.log(response.data);
                        this.setState({
                            message: response.data.message,
                            display: "block"
                        },() => {
                            swal(response.data.message);
                            this.props.history.push("/login");
                        })
                    })


            } else {
                this.setState({
                    message: "Both password should match",
                    display: "block"
                })
            }
        } else {
            this.setState({
                message: "Select one profile to continue",
                display: "block"
            })
        }
    }


    render() {
        var displayStyle = {
            display: this.state.display
        }
        return(
            <div className="Signup">
                <div className="container">
                    <div className="row">
                        <div className="col-md-6 col-md-5 col-md-offset-4">
                            <h1 className="text-center signup-title">Sign Up to Volunteer with WeServe</h1>
                            <div className="account-wall">
                                <img className="profile-img" src="https://lh5.googleusercontent.com/-b0-k99FZlyE/AAAAAAAAAAI/AAAAAAAAAAA/eu7opA4byxI/photo.jpg?sz=120"
                                     alt="" />

                                <div className="alert alert-danger form-control" role="alert" style={ displayStyle }>
                                    { this.state.message }
                                </div>

                                <form className="form-signup" onSubmit={this.handleSubmit}>
                                    <div >
                                        Signup as:
                                        <hr />
                                    </div>

                                        <label className="radio-inline ml-2"><input type="radio" id="radioButtonNGO" name="radioBtn" value="ngo" />       NGO</label>


                                        <label className="radio-inline ml-2" ><input type="radio" id="radioButtonVolunteer" name="radioBtn" value="volunteer" />   Volunteer</label>


                                        <label className="radio-inline ml-2" ><input type="radio" id="radioButtonProBono" name="radioBtn" value="consultant" />   Consultant</label>

                                    <input type="text" name="username" onChange={this.handleChange} className="form-control" placeholder="username" required autoFocus />
                                    <input type="email" name="email" onChange={this.handleChange} className="form-control" placeholder="Email" required />
                                    <input type="text" name="password" onChange={this.handleChange} id="password" className="form-control" placeholder="Password" required />
                                    <input type="password" name="confirmpassword" onChange={this.handleChange} id="confirmpassword" className="form-control" placeholder="Confirm Password" required />

                                    <br/>
                                    <button className="btn btn-lg btn-primary btn-block" type="submit">
                                        Sign Up</button>
                                </form>
                                <a href="/login" className="text-center new-account">Login </a>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Signup;