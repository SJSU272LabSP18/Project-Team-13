import React, { Component } from 'react';
import '../css/signup.css';
import url from '../serverurl';
import axios from 'axios';
import uuid from 'uuid';

class Signup extends Component {

    constructor() {
        super();
        this.state = {
            message: "",
            display: "none",
            username: "",
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

        // var password = document.getElementById("password").value;
        // var confirmpassword = document.getElementById("confirmpassword").value;
        if(this.state.password === this.state.confirmpassword) {
            var user = {
                id: uuid.v4(),
                username: this.state.username,
                password: this.state.password
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
                    })
                })


        } else {
            this.setState({
                message: "Both password should match",
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
                                <form className="form-signup" onSubmit={this.handleSubmit}>
                                    <div className="alert alert-danger form-control" role="alert" style={ displayStyle }>
                                        { this.state.message }
                                    </div>
                                    <input type="email" name="username" onChange={this.handleChange} className="form-control" placeholder="Email" required autoFocus />
                                    <input type="text" name="password" onChange={this.handleChange} id="password" className="form-control" placeholder="Password" required />
                                    <input type="password" name="confirmpassword" onChange={this.handleChange} id="confirmpassword" className="form-control" placeholder="Confirm Password" required />
                                    <button className="btn btn-lg btn-primary btn-block" type="submit">
                                        Sign Up</button>
                                </form>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Signup;