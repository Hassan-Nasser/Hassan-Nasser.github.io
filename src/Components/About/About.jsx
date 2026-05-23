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
                                        <FontAwesomeIcon icon={faCalendarDays} className="me-2" /> 2018 - Present
                                    </div>
                                    <h3 className="timeline-job-title">Senior Game Developer</h3>
                                    <span className="timeline-company">Upwork - Freelance</span>
                                    <p className="timeline-description">
                                        Worked with market-leading companies developing large-scale mobile games and AR apps, delivering innovative solutions and exceptional user experiences.
                                    </p>
                                </div>
                            </TimelineItem>

                            {/* Timeline Item 2 */}
                            <TimelineItem>
                                <div className="timeline-marker"></div>
                                <div className="timeline-card">
                                    <div className="timeline-time">
                                        <FontAwesomeIcon icon={faCalendarDays} className="me-2" /> 2021 - 2022
                                    </div>
                                    <h3 className="timeline-job-title">Senior Game Developer</h3>
                                    <span className="timeline-company">Chrono Games</span>
                                    <p className="timeline-description">
                                        Played a pivotal role in optimizing 'Forest Knight' network architecture for large-scale mobile gaming, supporting hundreds of thousands of players.
                                    </p>
                                </div>
                            </TimelineItem>

                            {/* Timeline Item 3 */}
                            <TimelineItem>
                                <div className="timeline-marker"></div>
                                <div className="timeline-card">
                                    <div className="timeline-time">
                                        <FontAwesomeIcon icon={faCalendarDays} className="me-2" /> 2021 - 2022
                                    </div>
                                    <h3 className="timeline-job-title">Senior Game Developer</h3>
                                    <span className="timeline-company">Front Tech, LLC – Part Time</span>
                                    <p className="timeline-description">
                                        Led the development of 'Millionaire Deal - Card Game,' a multiplayer card game with unique collectible cards, focusing on enhancing gameplay mechanics and player engagement.
                                    </p>
                                </div>
                            </TimelineItem>

                            {/* Timeline Item 4 */}
                            <TimelineItem>
                                <div className="timeline-marker"></div>
                                <div className="timeline-card">
                                    <div className="timeline-time">
                                        <FontAwesomeIcon icon={faCalendarDays} className="me-2" /> 2020 - 2021
                                    </div>
                                    <h3 className="timeline-job-title">Senior Game Developer</h3>
                                    <span className="timeline-company">Alamat.tech</span>
                                    <p className="timeline-description">
                                        Developed a wide range of hyper-casual games, AR experiences, and multiplayer games.
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