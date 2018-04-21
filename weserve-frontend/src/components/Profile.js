import React, { Component } from 'react';
import Navbar from "./Navbar";
import '../css/profile.css';

class Profile extends Component {



    render() {
        return(
            <div className="Profile">

                <div id="ShowingBlackBackground">
                    <Navbar />
                </div>
                <h1>Hello On Profile</h1>
            </div>
        );
    }

}

export default Profile;