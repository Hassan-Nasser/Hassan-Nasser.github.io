import React, { useEffect, useState, useRef } from "react";
import "./Navigation.scss";
import 'bootstrap/dist/css/bootstrap.min.css';
import { HashLink } from "react-router-hash-link";
import logoGif from "../../images/logo-Animated.gif";

export function Navigation(props) {
    const [classs, setClasss] = useState('');
    const [showNavbar, setShowNavbar] = useState(false);
    const navRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            setClasss(window.scrollY > 300 ? "top-nav-collapse" : "");
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (navRef.current && !navRef.current.contains(event.target)) {
                setShowNavbar(false);
            }
        };

        if (showNavbar) {
            document.addEventListener("mousedown", handleClickOutside);
            document.addEventListener("touchstart", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("touchstart", handleClickOutside);
        }
        
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("touchstart", handleClickOutside);
        };
    }, [showNavbar]);

    const handleShowNavbar = () => {
        setShowNavbar(!showNavbar);
    };

    return (
        <nav ref={navRef} className={`navbar navbar-expand-lg fixed-top navbar-dark Poppins ${classs}`}>
            <div className="container">
                <a className="navbar-brand page-scroll nav-brand-wrapper" href="/">
                    <img src={logoGif} alt="Hassan Nasser" className="nav-logo-gif" />
                    <span className="nav-brand-text">Hassan</span>
                </a>

                <button className="navbar-toggler p-0 border-0" onClick={handleShowNavbar} type="button" data-toggle="offcanvas">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className={`navbar-collapse offcanvas-collapse ${showNavbar ? "open" : ""}`} id="navbarsExampleDefault">
                    <ul className="navbar-nav ml-auto">
                        <li className="nav-item" onClick={() => setShowNavbar(false)}>
                            <HashLink smooth className="nav-link page-scroll" to="/#">Home</HashLink>
                        </li>
                        <li className="nav-item" onClick={() => setShowNavbar(false)}>

                            <HashLink smooth className="nav-link page-scroll" to="/#portfolio">Portfolio</HashLink>
                        </li>
                        <li className="nav-item" onClick={() => {

                            setShowNavbar(false)
                        }}>
                            <HashLink smooth className="nav-link page-scroll" to="/#profile">Experience</HashLink>

                        </li>
                        {/* <li className="nav-item" onClick={() => setShowNavbar(false)}>
                            <HashLink smooth className="nav-link page-scroll" to="/#services">Services</HashLink>

                        </li> */}

                        {/* <li className="nav-item" onClick={() => setShowNavbar(false)}>

                            <HashLink smooth className="nav-link page-scroll" to="/#testimonial">Testimonial</HashLink>
                        </li> */}
                        <li className="nav-item" onClick={() => setShowNavbar(false)}>
                            <HashLink smooth className="nav-link page-scroll" to="/#contact">Contact</HashLink>

                        </li>
                    </ul>

                </div>
            </div>
        </nav>

    );
}