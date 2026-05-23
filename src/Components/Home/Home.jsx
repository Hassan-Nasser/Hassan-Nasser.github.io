import React from "react";
import "./Home.scss";
import { Profile } from '../Profile/Profile';
import { About } from '../About/About';
import { Services } from '../Services/Services';
import Projects from '../Projects/Projects';
import Testimonial from "../Testimonial/Testimonial";
import Contacts from "../Contacts/Contacts";

export function Home(props) {
    return (
        <>
            <Profile />
            <About />
            <Projects />
            <Services />  
            <Testimonial />
            <Contacts />
        </>
    );
}