import React, { Component } from 'react';
import Navbar from "./Navbar";
import '../css/creative.css';
import '../css/creative.min.css';
import img1f from '../img/portfolio/fullsize/1.jpg';
import img1t from '../img/portfolio/thumbnails/1.jpg';
import img2f from '../img/portfolio/fullsize/2.jpg';
import img2t from '../img/portfolio/thumbnails/2.jpg';
import img3f from '../img/portfolio/fullsize/3.jpg';
import img3t from "../img/portfolio/thumbnails/3.jpg";
import img4f from "../img/portfolio/fullsize/4.jpg";
import img4t from "../img/portfolio/thumbnails/4.jpg";
import img5f from "../img/portfolio/fullsize/5.jpg";
import img5t from "../img/portfolio/thumbnails/5.jpg";
import img6f from "../img/portfolio/fullsize/6.jpg";
import img6t from "../img/portfolio/thumbnails/6.jpg";
import axios from "axios/index";
import url from "../serverurl";

class Home extends Component {

    constructor() {
        super();
        this.state = {
            isLoggedIn: false
        }
        this.handleViewMore = this.handleViewMore.bind(this);
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

    handleViewMore(e) {
        e.preventDefault();
        console.log("Hello on handle view more");
        this.props.history.push('/userhome');
    }

    render() {
        return(
            <div className="Home">
                <Navbar/>

                {/*<Firstproject/>*/}
                {/*<ThreeProjects/>*/}

                <header className="masthead text-center text-white d-flex">
                    <div className="container my-auto">
                        <div className="row">
                            <div className="col-lg-10 mx-auto">
                                <h1 className="text-uppercase">
                                    <strong>Your Favorite Source of Free HandsOn Projects</strong>
                                </h1>
                                <hr/>
                            </div>
                            <div className="col-lg-8 mx-auto">
                                <p className="text-faded mb-5">WeServe helps you build better connections to Volunteers or Pro-Bono Consultants using the WeServe's smart Machine Learning framework! Just login start going, no strings attached!</p>
                                <a className="btn btn-primary btn-xl js-scroll-trigger" href="#about">Find Out More</a>
                            </div>
                        </div>
                    </div>
                </header>

                <section id="services">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12 text-center">
                                <h2 className="section-heading">At Your Service</h2>
                                <hr className="my-4" />
                            </div>
                        </div>
                    </div>
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-3 col-md-6 text-center">
                                <div className="service-box mt-5 mx-auto">
                                    <i className="fa fa-4x fa-diamond text-primary mb-3 sr-icons"></i>
                                    <h3 className="mb-3">Help NGOs</h3>
                                    <p className="text-muted mb-0">Help NGOs and Feel Happy</p>
                                </div>
                            </div>
                            <div className="col-lg-3 col-md-6 text-center">
                                <div className="service-box mt-5 mx-auto">
                                    <i className="fa fa-4x fa-paper-plane text-primary mb-3 sr-icons"></i>
                                    <h3 className="mb-3">Ready to Start</h3>
                                    <p className="text-muted mb-0">NGO will get your match, selects you and you are ready to start</p>
                                </div>
                            </div>
                            <div className="col-lg-3 col-md-6 text-center">
                                <div className="service-box mt-5 mx-auto">
                                    <i className="fa fa-4x fa-newspaper-o text-primary mb-3 sr-icons"></i>
                                    <h3 className="mb-3">Up to Date</h3>
                                    <p className="text-muted mb-0">We update projects to keep things current.</p>
                                </div>
                            </div>
                            <div className="col-lg-3 col-md-6 text-center">
                                <div className="service-box mt-5 mx-auto">
                                    <i className="fa fa-4x fa-heart text-primary mb-3 sr-icons"></i>
                                    <h3 className="mb-3">Made with Love</h3>
                                    <p className="text-muted mb-0">We have strived hard and have made this website with great love!</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="p-0" id="portfolio">
                    <div className="container-fluid p-0">
                        <div className="row no-gutters popup-gallery">
                            <div className="col-lg-4 col-sm-6">
                                <a className="portfolio-box" href={ img1f }>
                                    <img className="img-fluid" src={ img1t } alt=""/>
                                        <div className="portfolio-box-caption">
                                            <div className="portfolio-box-caption-content">
                                                <div className="project-category text-faded">

                                                </div>
                                                <div className="project-name">
                                                    Always be a helping hand
                                                </div>
                                            </div>
                                        </div>
                                </a>
                            </div>
                            <div className="col-lg-4 col-sm-6">
                                <a className="portfolio-box" href={ img2f }>
                                    <img className="img-fluid" src={ img2t } alt=""/>
                                        <div className="portfolio-box-caption">
                                            <div className="portfolio-box-caption-content">
                                                <div className="project-category text-faded">

                                                </div>
                                                <div className="project-name">
                                                    Social
                                                </div>
                                            </div>
                                        </div>
                                </a>
                            </div>
                            <div className="col-lg-4 col-sm-6">
                                <a className="portfolio-box" href= { img3f }>
                                    <img className="img-fluid" src={ img3t } alt=""/>
                                        <div className="portfolio-box-caption">
                                            <div className="portfolio-box-caption-content">
                                                <div className="project-category text-faded">

                                                </div>
                                                <div className="project-name">
                                                    IT
                                                </div>
                                            </div>
                                        </div>
                                </a>
                            </div>
                            <div className="col-lg-4 col-sm-6">
                                <a className="portfolio-box" href={ img4f }>
                                    <img className="img-fluid" src={ img4t } alt="" />
                                        <div className="portfolio-box-caption">
                                            <div className="portfolio-box-caption-content">
                                                <div className="project-category text-faded">

                                                </div>
                                                <div className="project-name">
                                                    Mechanical
                                                </div>
                                            </div>
                                        </div>
                                </a>
                            </div>
                            <div className="col-lg-4 col-sm-6">
                                <a className="portfolio-box" href={ img5f }>
                                    <img className="img-fluid" src={ img5t } alt="" />
                                        <div className="portfolio-box-caption">
                                            <div className="portfolio-box-caption-content">
                                                <div className="project-category text-faded">

                                                </div>
                                                <div className="project-name">
                                                    Be a Teacher
                                                </div>
                                            </div>
                                        </div>
                                </a>
                            </div>
                            <div onClick={ this.handleViewMore } className="col-lg-4 col-sm-6">
                                <a className="portfolio-box" href= { img6f }>
                                    <img className="img-fluid" src= { img6t } alt="" />
                                        <div className="portfolio-box-caption">
                                            <div className="portfolio-box-caption-content">
                                                <div className="project-category text-faded">

                                                </div>
                                                <div className="project-name">
                                                    View More
                                                </div>
                                            </div>
                                        </div>
                                </a>
                            </div>
                        </div>
                    </div>
                </section>


                <section id="contact">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-8 mx-auto text-center">
                                <h2 className="section-heading">Let's Get In Touch!</h2>
                                <hr className="my-4" />
                                    <p className="mb-5">Ready to start helping with us? That's great! Give us a call or send us an email and we will get back to you as soon as possible!</p>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-4 ml-auto text-center">
                                <i className="fa fa-phone fa-3x mb-3 sr-contact"></i>
                                <p>123-456-6789</p>
                            </div>
                            <div className="col-lg-4 mr-auto text-center">
                                <i className="fa fa-envelope-o fa-3x mb-3 sr-contact"></i>
                                <p>
                                    <a href="mailto:your-email@your-domain.com">feedback@weserveyou.com</a>
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

            </div>
        );
    }
}

export default Home;