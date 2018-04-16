import React, { Component } from 'react';
import '../css/creative.css'
import '../css/creative.min.css'


class Navbar extends Component {
    render() {
        return(
            <div className="Navbar">
                <nav className="navbar navbar-expand-lg navbar-light fixed-top" id="mainNav">
                    <div className="container">
                        <a className="navbar-brand js-scroll-trigger" href="#page-top">WeServe</a>
                        <button className="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarResponsive">
                            <ul className="navbar-nav ml-auto">
                                <li className="nav-item">
                                    <a className="nav-link" href="#login">Login</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="#signup">Signup</a>
                                </li>
                                {/*<li className="nav-item">*/}
                                    {/*<a className="nav-link js-scroll-trigger" href="#about">About</a>*/}
                                {/*</li>*/}
                                {/*<li className="nav-item">*/}
                                    {/*<a className="nav-link js-scroll-trigger" href="#services">Services</a>*/}
                                {/*</li>*/}
                                <li className="nav-item">
                                    <a className="nav-link js-scroll-trigger" href="#portfolio">Portfolio</a>
                                </li>
                                {/*<li className="nav-item">*/}
                                    {/*<a className="nav-link js-scroll-trigger" href="#contact">Contact</a>*/}
                                {/*</li>*/}
                            </ul>
                        </div>
                    </div>
                </nav>
            </div>
        );
    }
}

export default Navbar;