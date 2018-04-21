import React, { Component } from 'react';
import Navbar from "./Navbar";
import { Card, CardImg, CardText, CardBody,
    CardTitle, CardSubtitle, Button } from 'reactstrap';

import '../css/userhome.css';

class Userhome extends Component {

    constructor() {
        super();
        this.state = {

        }

        this.handleProjectClick = this.handleProjectClick.bind(this);
        this.handleNGOProfileClick = this.handleNGOProfileClick.bind(this);
    }

    handleProjectClick(e) {
        e.preventDefault();
        alert("On Project Click");
    }

    handleNGOProfileClick(e) {
        e.preventDefault();
        alert("On NGO Profile Click");
    }

    render() {
        return(
            <div className="Userhome">

                <div id="ShowingBlackBackground">
                    <Navbar />
                </div>

                <div className="projectCard">
                    <Card>
                        <CardImg top width="100%" src="https://placeholdit.imgix.net/~text?txtsize=33&txt=318%C3%97180&w=318&h=180" alt="Card image cap" />
                        <CardBody>
                            <CardTitle><a onClick={ this.handleProjectClick } href="#">Project Name</a></CardTitle>
                            <CardSubtitle> <a onClick={ this.handleNGOProfileClick } href='#'>Project Owner(NGO) should be link</a></CardSubtitle>
                            <CardText>Project Description</CardText>
                        </CardBody>
                    </Card>
                </div>

            </div>
        );
    }

}

export default Userhome;