import React, { Component } from 'react';
import '../css/login.css';
import axios from 'axios';
import url from '../serverurl';
import swal from 'sweetalert';

class Login extends Component {

    constructor() {
        super();
        this.state = {
            username: "",
            password: "",
            message: "",
            isLoggedIn: false
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
    }

    componentWillMount() {

        axios.get(url + "/checksession", {withCredentials: true})
            .then((response) => {
                console.log("In checksession on Navbar",response.data);
                if(response.data.sessionUsername !== "ERROR") {
                    this.setState({
                        isLoggedIn: true
                    }, () => {
                        if(this.state.isLoggedIn === true) {
                            this.props.history.push('/userhome');
                        }
                    })
                }
            })


    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }


    handleLogin(e) {
        e.preventDefault();
        console.log("In handle login on login page...", this.state.username, this.state.password);
        var user = {
            username: this.state.username,
            password:this.state.password
        }
        axios.post(url + "/login", user, {withCredentials: true})
            .then((response) => {
                console.log("In handle login after response on login page...", response.data);
                if(response.data.message === "success") {
                    swal("Login Successfull", "", "success");
                    this.setState({
                        isLoggedIn: true
                    }, () => {
                        this.props.history.push('/userhome');
                    })
                } else {
                    swal(response.data.message, "", "warning");
                }
            })
    }




    render() {
        return(
            <div className="Login">
                <div className="container">
                    <div className="row">
                        <div className="col-sm-6 col-md-4 col-md-offset-4">
                            <h1 className="text-center login-title">Sign in to continue to WeServe</h1>
                            <div className="account-wall">
                                <img className="profile-img" src="https://lh5.googleusercontent.com/-b0-k99FZlyE/AAAAAAAAAAI/AAAAAAAAAAA/eu7opA4byxI/photo.jpg?sz=120"
                                     alt="" />
                                    <form className="form-signin" onSubmit={this.handleLogin}>
                                        <input type="text" name="username" onChange={this.handleChange} className="form-control" placeholder="username" required autoFocus />
                                            <input type="password" name="password" onChange={this.handleChange} className="form-control" placeholder="Password" required />
                                                <button className="btn btn-lg btn-primary btn-block" type="submit">
                                                    Sign in</button>
                                    </form>
                            </div>
                            <a href="/signup" className="text-center new-account">Create an account </a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Login;