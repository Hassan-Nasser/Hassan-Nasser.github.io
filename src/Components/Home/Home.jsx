import React, { useMemo, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { HashLink } from "react-router-hash-link";
import { ChevronRight, Terminal, X, FileText, Loader2 } from 'lucide-react';
import './Home.scss';
import profilePic from '../../images/profile-Picture.jpg';
import unityIcon from '../../images/icons/Unity.png';
import unrealIcon from '../../images/icons/Unreal.png';

const Portrait = () => (
    <div className="portrait-wrapper animate-zoom-in">
        <div className="portrait-slab">
            <div className="image-area" style={{ "--glitch-img": `url("${profilePic}")` }}>
                <img
                    src={profilePic}
                    alt="Subject Hassan"
                    className="profile-avatar"
                    fetchpriority="high"
                />
            </div>
        </div>
    </div>
);

export function Home(props) {
    const resumeUrl = "/Hassan_Nasser.pdf";
    const [isResumeOpen, setIsResumeOpen] = useState(false);
    const [isPdfLoaded, setIsPdfLoaded] = useState(false);

    const handleOpenResume = () => {
        setIsPdfLoaded(false);
        setIsResumeOpen(true);
    };

    const unityYears = useMemo(() => {
        const start = new Date(2017, 5, 1);
        const now = new Date();
        let years = now.getFullYear() - start.getFullYear();
        if (now.getMonth() < start.getMonth() || (now.getMonth() === start.getMonth() && now.getDate() < start.getDate())) {
            years--;
        }
        return years;
    }, []);

    const unrealYears = useMemo(() => {
        const start = new Date(2024, 0, 1);
        const now = new Date();
        let years = now.getFullYear() - start.getFullYear();
        if (now.getMonth() < start.getMonth() || (now.getMonth() === start.getMonth() && now.getDate() < start.getDate())) {
            years--;
        }
        return Math.max(1, years);
    }, []);

    return (
        <header id="home" className="header-manifest">
            <div className="manifest-grid">

                <div className="role-indicator animate-fade-in-left">
                    <div className="line"></div>
                    <span className="role-text">Game Developer & Software Engineer</span>
                </div>

                <div className="name-group animate-fade-in-left">
                    <h1 className="name-title">
                        <span className="first-name glitch-text" data-text="HASSAN">HASSAN</span>
                        <span className="last-name glitch-text" data-text="NASSER">NASSER</span>
                    </h1>
                </div>

                <Portrait />

                <div className="bio-block-container animate-fade-in-left">
                    <div className="bio-block">
                        <div className="terminal-icon-wrapper">
                            <Terminal size={18} className="terminal-icon" />
                        </div>
                        <p className="bio-text">
                            Senior Developer with years of experience building game systems and interactive software.
                        </p>
                    </div>

                    <p className="intro-description">
                        Experienced in building mobile titles, scalable multiplayer systems, and AR/VR applications using Unity and Unreal Engine.
                    </p>

                    <div className="dev-experience">
                        <div className="exp-item">
                            <img src={unityIcon} alt="Unity" className="exp-icon-large" />
                            <span className="exp-text">Unity Engine</span>
                            <span className="exp-badge">{unityYears}+ Yrs</span>
                        </div>
                        <div className="exp-item">
                            <img src={unrealIcon} alt="Unreal" className="exp-icon-large" />
                            <span className="exp-text">Unreal Engine</span>
                            <span className="exp-badge">{unrealYears}+ Yrs</span>
                        </div>
                    </div>

                    <div className="action-buttons">
                        <HashLink smooth className="btn-glass-portal" to="/#portfolio">
                            EXPLORE PROJECTS <ChevronRight size={18} className="btn-arrow" />
                        </HashLink>
                        <button className="btn-glass-portal btn-resume" onClick={handleOpenResume}>
                            RESUME <FileText size={18} className="btn-arrow" />
                        </button>
                    </div>
                </div>

            </div>

            {isResumeOpen && resumeUrl && createPortal(
                <div className="resume-modal-overlay" onClick={() => setIsResumeOpen(false)}>
                    
                    <button className="resume-close-btn-outside" onClick={() => setIsResumeOpen(false)}>
                        <X size={32} />
                    </button>

                    {!isPdfLoaded && (
                        <div className="resume-loader">
                            <Loader2 size={48} className="spinner" />
                        </div>
                    )}

                    <div 
                        className={`resume-modal-content ${isPdfLoaded ? 'animate-zoom-in' : 'hidden-state'}`} 
                        onClick={e => e.stopPropagation()}
                    >
                        <iframe 
                            src={resumeUrl} 
                            className="resume-iframe" 
                            title="Resume" 
                            onLoad={() => setIsPdfLoaded(true)}
                        />
                    </div>
                </div>,
                document.body
            )}
        </header>
    );
}