import React, { useState, useEffect, useRef } from "react";
import "./About.scss";
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDays } from "@fortawesome/free-regular-svg-icons";

const TimelineItem = ({ children }) => {
    const elementRef = useRef(null);
    const [isIntersecting, setIsIntersecting] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsIntersecting(true);
                    observer.unobserve(entry.target);
                }
            },
            {
                threshold: 0.15,
                rootMargin: "0px 0px -50px 0px"
            }
        );
        if (elementRef.current) {
            observer.observe(elementRef.current);
        }
        return () => {
            if (elementRef.current) {
                observer.unobserve(elementRef.current);
            }
        };
    }, []);

    return (
        <div 
            ref={elementRef} 
            className={`timeline-item ${isIntersecting ? "revealed" : "reveal-hidden"}`}
        >
            {children}
        </div>
    );
};

export function About(props) {
    return (
        <div id="profile" className="basic-1">
            <div className="container">
                {/* Centered Title Section */}
                <div className="row text-center mb-5">
                    <div className="col-12">
                        <h2 className="experience-section-title">MY EXPERIENCE</h2>
                        <div className="title-glow-bar"></div>
                    </div>
                </div>

                {/* Timeline Section */}
                <div className="row justify-content-center">
                    <div className="col-lg-10 col-12">
                        <div className="experience-timeline">
                            {/* Vertical Line Track */}
                            <div className="timeline-track"></div>

                            {/* Timeline Item 1 */}
                            <TimelineItem>
                                <div className="timeline-marker"></div>
                                <div className="timeline-card">
                                    <div className="timeline-time">
                                        <FontAwesomeIcon icon={faCalendarDays} className="me-2" /> Nov 2022 - Present
                                    </div>
                                    <h3 className="timeline-job-title">Game Developer & Software Engineer</h3>
                                    <span className="timeline-company">Upwork (Freelancer) | Remote</span>
                                    <p className="timeline-description">
                                        Delivered 30+ Unity projects across varied genres, architecting scalable multiplayer backends and complex gameplay systems. Created custom toolkits, commercial platforms, and web-based game hubs to accelerate development cycles.
                                    </p>
                                </div>
                            </TimelineItem>

                            {/* Timeline Item 2 */}
                            <TimelineItem>
                                <div className="timeline-marker"></div>
                                <div className="timeline-card">
                                    <div className="timeline-time">
                                        <FontAwesomeIcon icon={faCalendarDays} className="me-2" /> Dec 2021 - Nov 2022
                                    </div>
                                    <h3 className="timeline-job-title">Senior Game Developer</h3>
                                    <span className="timeline-company">Forest Knight (Contract) | Remote</span>
                                    <p className="timeline-description">
                                        Rebuilt the multiplayer architecture and optimized core gameplay systems for a blockchain-based game with 150,000+ players. Developed robust campaign progression systems while reducing server costs by over 70%.
                                    </p>
                                </div>
                            </TimelineItem>

                            {/* Timeline Item 3 */}
                            <TimelineItem>
                                <div className="timeline-marker"></div>
                                <div className="timeline-card">
                                    <div className="timeline-time">
                                        <FontAwesomeIcon icon={faCalendarDays} className="me-2" /> Aug 2021 - Sep 2022
                                    </div>
                                    <h3 className="timeline-job-title">Senior Game Developer</h3>
                                    <span className="timeline-company">Front Tech, LLC (Part-time) | Cairo, Egypt</span>
                                    <p className="timeline-description">
                                        Led the end-to-end development of "Millionaire Deal," a multiplayer turn-based card game. Managed the implementation of core gameplay features, virtual economies, and integrated polished visual assets.
                                    </p>
                                </div>
                            </TimelineItem>

                            {/* Timeline Item 4 */}
                            <TimelineItem>
                                <div className="timeline-marker"></div>
                                <div className="timeline-card">
                                    <div className="timeline-time">
                                        <FontAwesomeIcon icon={faCalendarDays} className="me-2" /> Feb 2020 - Jul 2021
                                    </div>
                                    <h3 className="timeline-job-title">Intermediate Game Developer</h3>
                                    <span className="timeline-company">Alamat.tech | Cairo, Egypt</span>
                                    <p className="timeline-description">
                                        Engineered scalable real-time multiplayer systems and ranked matchmaking using Unity and Photon. Built automated asset pipelines that significantly improved the team's iteration speed.
                                    </p>
                                </div>
                            </TimelineItem>

                            {/* Timeline Item 5 */}
                            <TimelineItem>
                                <div className="timeline-marker"></div>
                                <div className="timeline-card">
                                    <div className="timeline-time">
                                        <FontAwesomeIcon icon={faCalendarDays} className="me-2" /> Mar 2019 - Feb 2020
                                    </div>
                                    <h3 className="timeline-job-title">Junior Game Developer</h3>
                                    <span className="timeline-company">DASA Studios | Cairo, Egypt</span>
                                    <p className="timeline-description">
                                        Contributed to the development and integration of over 10 multiplayer card and board games, linking them to a centralized hub for unified matchmaking and progression.
                                    </p>
                                </div>
                            </TimelineItem>

                            {/* Timeline Item 6 */}
                            <TimelineItem>
                                <div className="timeline-marker"></div>
                                <div className="timeline-card">
                                    <div className="timeline-time">
                                        <FontAwesomeIcon icon={faCalendarDays} className="me-2" /> Jun 2017 - Oct 2018
                                    </div>
                                    <h3 className="timeline-job-title">Junior Game Developer</h3>
                                    <span className="timeline-company">NasNav | Cairo, Egypt</span>
                                    <p className="timeline-description">
                                        Built interactive AR and 3D applications, including a real estate design app and a fully navigable virtual shopping mall with 360° showrooms.
                                    </p>
                                </div>
                            </TimelineItem>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}