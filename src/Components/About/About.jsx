import React from "react";
import "./About.scss";
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDays } from "@fortawesome/free-regular-svg-icons";

export function About(props) {
    return (
        <div id="profile" className="basic-1">
            <div className="container">
                <div className="row">
                    <div className="col-lg-3">
                        <div className="text-container montserrat">
                            <h2>Hi there I'm <strong>Hassan,</strong></h2>
                            <p>
                                I'm an expert game developer with {new Date().getFullYear() - 2017} years of experience, Here are highlights from my recent roles.
                            </p>
                        </div>
                    </div>
                    <div className="col-lg-9">
                        <div className="row flex-column h-100">
                            <div className="col flex-grow-0 text-container ex-container">
                                <div className="time Poppins"><FontAwesomeIcon icon={faCalendarDays} /> 2018 - Present</div>
                                <h6 className="job-title montserrat">Senior Game Developer</h6>
                                <h6 className="company">Upwork - Freelance</h6>
                                <p className="job-description montserrat">Worked with market-leading companies developing large-scale mobile games and AR apps, delivering innovative solutions and exceptional user experiences.<br />
                                </p>

                            </div>
                            <div className="col">
                                <div className="text-container ex-container">

                                    <div className="time Poppins"><FontAwesomeIcon icon={faCalendarDays} /> 2021 - 2022</div>
                                    <h6 className="job-title montserrat">Senior Game Developer</h6>
                                    <h6 className="company">Chrono Games</h6>
                                    <p className="job-description montserrat">Played a pivotal role in optimizing 'Forest Knight' network architecture for large-scale mobile gaming, supporting hundreds of thousands of players.<br />
                                    </p>
                                </div>
                            </div>
                            <div className="col">
                                <div className="text-container ex-container">
                                    <div className="time Poppins"><FontAwesomeIcon icon={faCalendarDays} /> 2021 - 2022</div>
                                    <h6 className="job-title montserrat">Senior Game Developer</h6>
                                    <h6 className="company">Front Tech, LLC – Part Time</h6>
                                    <p className="job-description montserrat"> Led the development of 'Millionaire Deal - Card Game,' a multiplayer card game with unique collectible cards, focusing on enhancing gameplay mechanics and player engagement.<br />
                                    </p>

                                </div>
                            </div>
                            <div className="col">
                                <div className="text-container ex-container">

                                    <div className="time Poppins"><FontAwesomeIcon icon={faCalendarDays} /> 2020 - 2021</div>
                                    <h6 className="job-title montserrat">Senior Game Developer</h6>
                                    <h6 className="company"> Alamat.tech</h6>
                                    <p className="job-description montserrat">Developed a wide range of hyper-casual games, AR experiences, and multiplayer games.<br />
                                    </p>
                                </div>
                            </div>

                        </div>

                    </div>


                    <hr />
                </div>
            </div>
        </div>
    );
}