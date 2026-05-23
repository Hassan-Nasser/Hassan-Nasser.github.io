import React from 'react';
import { HashLink } from "react-router-hash-link";
import { Activity, Box, ChevronRight, Fingerprint, Terminal, Zap } from 'lucide-react';
import './Profile.scss';

export function Profile(props) {
    return (
        <header id="home" className="header-manifest">
            <div className="manifest-grid">
                
                {/* Tactical Subject Profile - Top on Mobile, Right on Desktop */}
                <div className="profile-column-right animate-zoom-in">
                    <div className="portrait-wrapper">
                        
                        {/* Outer Frame Decoration */}
                        <div className="outer-border"></div>
                        <div className="frame-corner top-left"></div>
                        <div className="frame-corner bottom-right"></div>

                        {/* Main Portrait Slab */}
                        <div className="portrait-slab">
                            
                            {/* HUD Header */}
                            <div className="hud-header">
                                <div className="diagnostic">
                                    <Activity size={14} className="diagnostic-pulse" />
                                    <span className="diagnostic-text mono">LIV_DIAGNOSTIC: ACTIVE</span>
                                </div>
                                <span className="hud-version mono">v7.02.ARCH</span>
                            </div>

                            {/* Profile Area */}
                            <div className="image-area">
                                <img
                                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=Hassan&backgroundColor=0f172a&mood=serious&accessories=eyepatch"
                                    alt="Subject Hassan"
                                    className="profile-avatar"
                                />
                                
                                {/* Scanning HUD Overlays */}
                                <div className="scan-gradient"></div>
                                <div className="scan-line"></div>

                                {/* Data Points on Portrait */}
                                <div className="hud-data-points">
                                    <div className="data-point">
                                        <span className="dot"></span>
                                        <span className="data-text mono">VR_HEADSET: ACTIVE</span>
                                    </div>
                                    <div className="data-point">
                                        <span className="dot"></span>
                                        <span className="data-text mono">UNITY_LINK: STABLE</span>
                                    </div>
                                </div>

                                <div className="hud-watermark mono">ARCH_01</div>
                            </div>

                            {/* HUD Footer Stats */}
                            <div className="hud-footer">
                                <div className="footer-stat">
                                    <div className="stat-label mono">EXPERTISE_INDEX</div>
                                    <div className="stat-bar">
                                        <div className="fill bg-blue"></div>
                                        <div className="fill bg-blue"></div>
                                        <div className="fill bg-blue"></div>
                                        <div className="fill bg-blue"></div>
                                        <div className="fill bg-empty"></div>
                                    </div>
                                </div>
                                <div className="footer-stat text-end">
                                    <div className="stat-label mono">SYSTEM_LATENCY</div>
                                    <div className="stat-value mono">14<span className="unit">ms</span></div>
                                </div>
                            </div>
                        </div>

                        {/* Floating Identity Chip */}
                        <div className="identity-chip">
                            <div className="chip-text">SUBJECT: HASSAN_NASSER</div>
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
                        {/* Decorative Elements around name */}
                        <div className="auth-badge">
                            <Fingerprint size={24} className="badge-icon" />
                            <span className="badge-text mono">AUTH_STATUS: VALIDATED</span>
                        </div>
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

                        <div className="stack-grid">
                            <div className="stack-card">
                                <div className="card-header-hud">
                                    <Zap size={14} className="icon-blue" />
                                    <span className="card-tag">Legacy Stack</span>
                                </div>
                                <div className="card-body-hud">8+ YRS Unity Specialist</div>
                            </div>
                            <div className="stack-card">
                                <div className="card-header-hud">
                                    <Box size={14} className="icon-purple" />
                                    <span className="card-tag">Current Pipeline</span>
                                </div>
                                <div className="card-body-hud">Unreal Engine 5 Core</div>
                            </div>
                        </div>

                        <div className="action-buttons">
                            <HashLink smooth className="btn-manifest-solid" to="/#portfolio">
                                LAUNCH ARCHIVES <ChevronRight size={20} className="btn-arrow" />
                            </HashLink>
                            <HashLink smooth className="btn-manifest-outline" to="/#profile">
                                VIEW DOSSIER
                            </HashLink>
                        </div>
                    </div>
                </div>

            </div>
        </header>
    );
}