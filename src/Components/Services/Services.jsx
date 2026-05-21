import React from "react";
import "./Services.scss";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import unityIcon from "../../images/icons/Unity.png";
import unrealIcon from "../../images/icons/Unreal.png";
import arVrIcon from "../../images/icons/AR&VR.png";
import multiplayerIcon from "../../images/icons/Multiplayer.png";

export function Services(props) {
    return (
        <section id="services" className="services spad">
            <div className="container">
                <div className="row">
                    <div className="col-lg-4">
                        <div className="services__title">
                            <div className="section-title">

                                <h2>What I do?</h2>
                            </div>
                            <p>I create high-quality and polished software, apps, and games. Delivering exceptional user experiences and robust functionality.</p>
                        </div>
                    </div>
                    <div className="col-lg-8">
                        <div className="row">
                            <Link className="col-lg-6 col-md-6 col-sm-6 pointer" to="/portfolio?tag=All">
                                <div className="services__item">
                                    <div className="services__item__icon">
                                        <img className="imageIcon" src={unityIcon} alt="" />
                                    </div>
                                    <h4>Unity</h4>
                                    <p>Used unity game engine for {new Date().getFullYear() - 2017}+ years in different projects,from games to simulations to mobile apps.</p>
                                </div>
                            </Link>
                            <div className="col-lg-6 col-md-6 col-sm-6 " >
                                <div className="services__item">
                                    <div className="services__item__icon">
                                        <img className="imageIcon" src={unrealIcon} alt="" />
                                    </div>
                                    <h4>Unreal</h4>
                                    <p>Experienced in unreal engine and capable of developing all kind of AAA games with it, From battle royale games to FPS games to MMO games.</p>
                                </div>
                            </div>
                            <Link className="col-lg-6 col-md-6 col-sm-6 pointer" to="/portfolio?tag=AR">
                                <div className="services__item">
                                    <div className="services__item__icon">
                                        <img className="imageIcon" src={arVrIcon} alt="" />
                                    </div>
                                    <h4> AR & VR </h4>
                                    <p>Used different frameworks like Photon and Unet with unity to integrate multiplayer to different kind of games,board games with turn based and Host migration multiplayer, and real-time strategy games.</p>
                                </div>
                            </Link>
                            <Link className="col-lg-6 col-md-6 col-sm-6 pointer" to="/portfolio?tag=Multiplayer">
                                <div className="services__item">
                                    <div className="services__item__icon">
                                        <img className="imageIcon" src={multiplayerIcon} alt="" />
                                    </div>
                                    <h4>Multiplayer</h4>
                                    <p>Developed all kind of AR apps and VR games, used vuforia marker AR to develop multiple mobile apps,used SteamVR to develop multiple PC games and simulations.</p>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}