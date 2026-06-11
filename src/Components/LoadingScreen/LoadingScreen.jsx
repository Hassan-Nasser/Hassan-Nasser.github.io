import React, { useEffect, useState } from 'react';
import './LoadingScreen.scss';
import logoAnimated from '../../images/logo-Animated.gif';

export const LoadingScreen = ({ isLoaded }) => {
    const [render, setRender] = useState(true);

    useEffect(() => {
        if (isLoaded) {
            const timer = setTimeout(() => {
                setRender(false);
            }, 800);
            return () => clearTimeout(timer);
        }
    }, [isLoaded]);

    useEffect(() => {
        if (!isLoaded) {
            document.body.style.overflow = 'hidden';
            document.body.style.touchAction = 'none';
        } else {
            document.body.style.overflow = '';
            document.body.style.touchAction = '';
        }

        return () => {
            document.body.style.overflow = '';
            document.body.style.touchAction = '';
        };
    }, [isLoaded]);

    if (!render) return null;

    return (
        <div className={`loading-screen-container ${isLoaded ? 'fade-out' : ''}`}>
            <div className="loading-content">
                <img src={logoAnimated} alt="Initializing..." className="loading-logo" />
                <div className="loading-spinner-container">
                    <div className="loading-spinner-bar"></div>
                </div>
                <div className="loading-text">SYSTEM INITIALIZING...</div>
            </div>
        </div>
    );
};
