import React, { useEffect, useRef } from "react";
import "./Contact.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faLinkedin, faUpwork, faYoutube } from "@fortawesome/free-brands-svg-icons";
import { Mail, Phone, MapPin, Send } from "lucide-react";

function Contact() {
    const sectionRef = useRef(null);

    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return;

        const revealElements = section.querySelectorAll('.contact-hidden');
        
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.remove("contact-hidden");
                        entry.target.classList.add("contact-revealed");
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
        );

        revealElements.forEach(el => observer.observe(el));

        return () => {
            observer.disconnect();
        };
    }, []);

    return (
        <section id="contact" className="contact-section" ref={sectionRef}>
            <div className="container">
                {/* Section Title */}
                <div className="row text-center mb-5">
                    <div className="col-12">
                        <h2 className="contact-section-title">GET IN TOUCH</h2>
                        <div className="title-glow-bar contact-glow-bar"></div>
                        <p className="contact-subtitle">
                            Have a project in mind or want to collaborate? I'd love to hear from you.
                        </p>
                        <div className="contact-location contact-hidden" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginTop: '1.25rem' }}>
                            <MapPin size={18} className="location-icon" />
                            <span>Cairo, Egypt</span>
                        </div>
                    </div>
                </div>

                {/* Contact Cards Grid */}
                <div className="contact-grid">
                    <div className="contact-card-wrapper contact-hidden">
                        <a href="mailto:Hassan.h.nasser@gmail.com" className="contact-card">
                            <div className="contact-card-icon">
                                <Mail size={24} />
                            </div>
                            <span className="contact-card-label">Email</span>
                            <span className="contact-card-value">Hassan.h.nasser@gmail.com</span>
                        </a>
                    </div>

                    <div className="contact-card-wrapper contact-hidden">
                        <a href="tel:+201065622685" className="contact-card">
                            <div className="contact-card-icon">
                                <Phone size={24} />
                            </div>
                            <span className="contact-card-label">Phone</span>
                            <span className="contact-card-value">+2 0106 562 2685</span>
                        </a>
                    </div>
                </div>

                {/* Social Links */}
                <div className="contact-hidden">
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
                </div>


            </div>
        </section>
    );
}

export default Contact;