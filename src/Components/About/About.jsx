import React from "react";
import "./About.scss";
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDays } from "@fortawesome/free-regular-svg-icons";

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
                            <div className="timeline-item">
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
                            </div>

                            {/* Timeline Item 2 */}
                            <div className="timeline-item">
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
                            </div>

                            {/* Timeline Item 3 */}
                            <div className="timeline-item">
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
                            </div>

                            {/* Timeline Item 4 */}
                            <div className="timeline-item">
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
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}