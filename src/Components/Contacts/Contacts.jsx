import React, { useState, useEffect, useRef } from "react";
import "./Contacts.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faLinkedin, faUpwork, faYoutube } from "@fortawesome/free-brands-svg-icons";
import { Mail, Phone, MapPin, Send } from "lucide-react";

const RevealOnScroll = ({ children, className = "" }) => {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
        );
        if (ref.current) observer.observe(ref.current);
        return () => { if (ref.current) observer.unobserve(ref.current); };
    }, []);

    return (
        <div ref={ref} className={`${className} ${visible ? "contact-revealed" : "contact-hidden"}`}>
            {children}
        </div>
    );
};

function Contacts() {
    return (
        <section className="contact-section" id="contact">
            <div className="container">
                {/* Section Title */}
                <div className="row text-center mb-5">
                    <div className="col-12">
                        <h2 className="contact-section-title">GET IN TOUCH</h2>
                        <div className="title-glow-bar contact-glow-bar"></div>
                        <p className="contact-subtitle">
                            Have a project in mind or want to collaborate? I'd love to hear from you.
                        </p>
                    </div>
                </div>

                {/* Contact Cards Grid */}
                <div className="contact-grid">
                    <RevealOnScroll className="contact-card-wrapper" >
                        <a href="mailto:Hassan.h.nasser@gmail.com" className="contact-card">
                            <div className="contact-card-icon">
                                <Mail size={24} />
                            </div>
                            <span className="contact-card-label">Email</span>
                            <span className="contact-card-value">Hassan.h.nasser@gmail.com</span>
                        </a>
                    </RevealOnScroll>

                    <RevealOnScroll className="contact-card-wrapper">
                        <a href="tel:+201065622685" className="contact-card">
                            <div className="contact-card-icon">
                                <Phone size={24} />
                            </div>
                            <span className="contact-card-label">Phone</span>
                            <span className="contact-card-value">+2 0106 562 2685</span>
                        </a>
                    </RevealOnScroll>

                    <RevealOnScroll className="contact-card-wrapper">
                        <div className="contact-card">
                            <div className="contact-card-icon">
                                <MapPin size={24} />
                            </div>
                            <span className="contact-card-label">Location</span>
                            <span className="contact-card-value">Cairo, Egypt</span>
                        </div>
                    </RevealOnScroll>
                </div>

                {/* Social Links */}
                <RevealOnScroll>
                    <div className="contact-socials">
                        <a href="https://www.linkedin.com/in/hassan-naser/"
                            target="_blank"
                            rel="noreferrer"
                            className="contact-social-link"
                            aria-label="LinkedIn"
                        >
                            <FontAwesomeIcon icon={faLinkedin} />
                        </a>
                        <a href="https://youtube.com/c/HassanNasserMohamed"
                            target="_blank"
                            rel="noreferrer"
                            className="contact-social-link"
                            aria-label="YouTube"
                        >
                            <FontAwesomeIcon icon={faYoutube} />
                        </a>
                        <a href="https://www.upwork.com/freelancers/hassannasser"
                            target="_blank"
                            rel="noreferrer"
                            className="contact-social-link"
                            aria-label="Upwork"
                        >
                            <FontAwesomeIcon icon={faUpwork} />
                        </a>
                        <a href="https://www.github.com/Hassan-Nasser"
                            target="_blank"
                            rel="noreferrer"
                            className="contact-social-link"
                            aria-label="GitHub"
                        >
                            <FontAwesomeIcon icon={faGithub} />
                        </a>
                    </div>
                </RevealOnScroll>

                {/* CTA Button */}
                <RevealOnScroll>
                    <div className="contact-cta">
                        <a href="mailto:Hassan.h.nasser@gmail.com" className="contact-cta-btn">
                            <Send size={18} className="cta-icon" />
                            SEND ME A MESSAGE
                        </a>
                    </div>
                </RevealOnScroll>
            </div>
        </section>
    );
}

export default Contacts;