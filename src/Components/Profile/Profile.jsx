import React from 'react';
import { HashLink } from "react-router-hash-link";
import { ChevronRight, Terminal } from 'lucide-react';
import './Profile.scss';

export function Profile(props) {
    return (
        <header id="home" className="header-manifest">
            <div className="manifest-grid">
                
                {/* Tactical Subject Profile - Top on Mobile, Right on Desktop */}
                <div className="profile-column-right animate-zoom-in">
                    <div className="portrait-wrapper">
                        {/* Main Portrait Slab */}
                        <div className="portrait-slab">
                            <div className="image-area">
                                <img
                                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=Hassan&backgroundColor=0f172a&mood=serious&accessories=eyepatch"
                                    alt="Subject Hassan"
                                    className="profile-avatar"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Identity & Name - Bottom on Mobile, Left on Desktop */}
                <div className="profile-column-left animate-fade-in-left">
                    
                    <div className="role-indicator">
                        <div className="line"></div>
                        <span className="role-text">Senior Game Developer</span>
                    </div>

                    <div className="name-group">
                        <h1 className="name-title">
                            <span className="first-name">HASSAN</span>
                            <span className="last-name">NASSER</span>
                        </h1>

                    </div>

                    <div className="bio-block-container">
                        <div className="bio-block">
                            <div className="terminal-icon-wrapper">
                                <Terminal size={18} className="terminal-icon" />
                            </div>
                            <p className="bio-text">
                                Crafting captivating worlds and immersive experiences.
                            </p>
                        </div>

                        <p className="intro-description">
                            From casual games to multiplayer epics, and pushing boundaries with interactive AR/VR applications on Unity and Unreal Engine.
                        </p>

                        <div className="dev-experience">
                            <div className="exp-item">
                                <span className="exp-badge">8+ Yrs</span>
                                <span className="exp-text">Unity Specialization</span>
                            </div>
                            <div className="exp-item">
                                <span className="exp-badge">UE5</span>
                                <span className="exp-text">Unreal Engine Core</span>
                            </div>
                        </div>

                        <div className="action-buttons">
                            <HashLink smooth className="btn-glass-portal" to="/#portfolio">
                                EXPLORE PROJECTS <ChevronRight size={18} className="btn-arrow" />
                            </HashLink>
                        </div>
                    </div>
                </div>

            </div>
        </header>
    );
}