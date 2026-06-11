import React, { useEffect, useRef } from "react";
import "./Experience.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDays } from "@fortawesome/free-regular-svg-icons";

export function Experience(props) {
    const sectionRef = useRef(null);

    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return;

        const items = section.querySelectorAll('.timeline-item');
        
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.remove("reveal-hidden");
                        entry.target.classList.add("revealed");
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.05,
                rootMargin: "0px 0px -20px 0px"
            }
        );

        items.forEach(item => observer.observe(item));

        return () => {
            observer.disconnect();
        };
    }, []);

    return (
        <div id="experience" className="experience-section" ref={sectionRef}>
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
                            <div className="timeline-item reveal-hidden">
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
                            </div>

                            {/* Timeline Item 2 */}
                            <div className="timeline-item reveal-hidden">
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
                            </div>

                            {/* Timeline Item 3 */}
                            <div className="timeline-item reveal-hidden">
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
                            </div>

                            {/* Timeline Item 4 */}
                            <div className="timeline-item reveal-hidden">
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
                            </div>

                            {/* Timeline Item 5 */}
                            <div className="timeline-item reveal-hidden">
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
                            </div>

                            {/* Timeline Item 6 */}
                            <div className="timeline-item reveal-hidden">
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
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}