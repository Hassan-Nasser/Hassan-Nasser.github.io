import React, { useEffect, useState } from "react";
import "./Navigation.scss";
import 'bootstrap/dist/css/bootstrap.min.css';
import { HashLink } from "react-router-hash-link";

export function Navigation(props) {
    const [classs, setClasss] = useState('');
    const [showNavbar, setShowNavbar] = React.useState(false);

    useEffect(() => {
        window.addEventListener('scroll', () => {
            setClasss(window.scrollY > 300 ? "top-nav-collapse" : "");
        })
    }, [])

    const handleShowNavbar = () => {

        setShowNavbar(!showNavbar);
    };
    return (

        <nav className={`navbar navbar-expand-lg fixed-top navbar-dark Play ${classs}`}>
            <div className="container">
                <a className="navbar-brand logo-text page-scroll" href="/">Hassan</a>

                <button className="navbar-toggler p-0 border-0" onClick={handleShowNavbar} type="button" data-toggle="offcanvas">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className={`navbar-collapse offcanvas-collapse ${showNavbar ? "open" : ""}`} id="navbarsExampleDefault">
                    <ul className="navbar-nav ml-auto">
                        <li className="nav-item" onClick={() => setShowNavbar(false)}>
                            <HashLink smooth className="nav-link page-scroll" to="/#">Home</HashLink>
                        </li>
                        <li className="nav-item" onClick={() => {

                            setShowNavbar(false)
                        }}>
                            <HashLink smooth className="nav-link page-scroll" to="/#profile">Profile</HashLink>

                        </li>
                        <li className="nav-item" onClick={() => setShowNavbar(false)}>

                            <HashLink smooth className="nav-link page-scroll" to="/#portfolio">Portfolio</HashLink>
                        </li>
                        <li className="nav-item" onClick={() => setShowNavbar(false)}>
                            <HashLink smooth className="nav-link page-scroll" to="/#services">Services</HashLink>

                        </li>

                        <li className="nav-item" onClick={() => setShowNavbar(false)}>

                            <HashLink smooth className="nav-link page-scroll" to="/#testimonial">Testimonial</HashLink>
                        </li>
                        <li className="nav-item" onClick={() => setShowNavbar(false)}>
                            <HashLink smooth className="nav-link page-scroll" to="/#contact">Contact</HashLink>

                        </li>
                    </ul>

                </div>
            </div>
        </nav>

    );
}