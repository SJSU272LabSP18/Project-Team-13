import React, { Component } from 'react';
import '../css/creative.css';
import '../css/creative.min.css';
import axios from 'axios';
import url from '../serverurl';


class Navbar extends Component {

    constructor() {
        super();
        this.state = {
            isLoggedIn: false,
            username: '',
            usertype: ''
        }
        this.handleLogout = this.handleLogout.bind(this);
    }

    componentWillMount() {
        axios.get(url + "/checksession", {withCredentials: true})
            .then((response) => {
                console.log("In checksession on Navbar",response.data);
                if(response.data.sessionUsername !== "ERROR") {
                    this.setState({
                        isLoggedIn: true,
                        username: response.data.sessionUsername,
                        usertype: response.data.usertype
                    }, () => {
                        console.log(this.state.username);
                    })
                }
            })
    }

    handleLogout() {
        axios.post(url + '/logout', null, { withCredentials: true })
            .then((response) => {
                console.log("Response after logging out...");
                if(response.data.result === "Session destoryed..please login") {
                    this.props.history.push('/');
                }
                this.setState({
                    isLoggedIn: false,
                    username: '',
                    usertype: ''
                })
            })
    }
    

    render() {

        let changes = null;
        if(this.state.isLoggedIn === false) {   // not logged in view
            changes = (
                <ul className="navbar-nav ml-auto">
                    <li className="nav-item">
                        <a className="nav-link" href="login">Login</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="signup">Signup</a>
                    </li>
                </ul>
            );
        } else if (this.state.isLoggedIn === true && this.state.usertype === 'ngo') {   // ngo view
            changes = (
                <ul className="navbar-nav ml-auto">
                    <li className="nav-item">
                        <a className="nav-link" href="/myprofile">MyProfile</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="/dashboard">Dashboard</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="/postproject">Post Project</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" onClick={ this.handleLogout } href="/logout">Logout</a>
                    </li>
                </ul>
            );
        } else {    // volunteer view
            changes = (
                <ul className="navbar-nav ml-auto">
                    <li className="nav-item">
                        <a className="nav-link" href="/myprofile">MyProfile</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="/dashboard">Dashboard</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" onClick={ this.handleLogout } href="/logout">Logout</a>
                    </li>
                </ul>
            );
        }

        return(
            <div className="Navbar">
                <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top" id="mainNav">
                    <div className="container">
                        <a className="navbar-brand js-scroll-trigger" href="/">WeServe</a>
                        <button className="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="" id="navbarResponsive">
                            { changes }
                        </div>
                    </div>
                </nav>
            </div>
        );
    }
}

export default Navbar;