import React from "react";
import "./MainContent.scss";
import { Home } from '../Home/Home';
import { Experience } from '../Experience/Experience';
import { Services } from '../Services/Services';
import Portfolio from '../Portfolio/Portfolio';
import Testimonial from "../Testimonial/Testimonial";
import Contact from "../Contact/Contact";

export function MainContent(props) {
    return (
        <>
            <Home />
            <Portfolio />
            <Experience />
            {/* <Services /> */}
            {/* <Testimonial /> */}
            <Contact />
        </>
    );
}