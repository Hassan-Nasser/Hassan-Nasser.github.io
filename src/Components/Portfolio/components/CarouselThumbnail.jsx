import React, { useState, useEffect } from "react";

export const CarouselThumbnail = ({ src, isActive, onClick, icon }) => {
    const getOptimizedSrc = (url) => {
        if (!url) return null;
        if (url.includes('ytimg.com') || url.includes('youtube.com') || url.includes('data:image')) return url;
        return `https://wsrv.nl/?url=${encodeURIComponent(url)}&w=160&output=webp&q=60`;
    };

    const optimizedSrc = getOptimizedSrc(src);
    const [imgSrc, setImgSrc] = useState(optimizedSrc);

    useEffect(() => {
        setImgSrc(getOptimizedSrc(src));
    }, [src]);

    const handleError = () => {
        setImgSrc(src);
    };

    const handleLoad = (e) => {
    };

    return (
        <button className={`thumbnail-btn ${isActive ? "active" : ""}`} onClick={onClick} style={{ position: 'relative', overflow: 'hidden', backgroundColor: '#0f172a' }}>
            <img
                decoding="async"
                src={imgSrc || "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs="}
                alt="Thumbnail"
                onLoad={(e) => {
                    if (imgSrc) handleLoad(e);
                }}
                onError={handleError}
                className="thumb-image"
                style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, zIndex: 2 }}
            />
            {icon && (
                <div className="thumb-video-icon" style={{ zIndex: 3, position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {icon}
                </div>
            )}
        </button>
    );
};
