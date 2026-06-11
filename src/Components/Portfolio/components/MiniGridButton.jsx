import React from "react";
import { getYouTubeThumbnail } from "../utils/youtubeUtils";

const MiniGridCell = ({ sp }) => {
    const thumbUrl = getYouTubeThumbnail(sp.url, 'default') || sp.profile;

    return (
        <div className="mini-grid-cell" style={{ backgroundImage: thumbUrl ? `url(${thumbUrl})` : 'none' }}></div>
    );
};

export const MiniGridButton = ({ sps, isActive, onClick }) => {
    return (
        <button className={`thumbnail-btn ${isActive ? "active" : ""}`} onClick={onClick} style={{ position: 'relative', overflow: 'hidden' }}>
            <div className="thumb-image grid-thumb-icon" style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 }}>
                <div className="mini-grid">
                    {sps.map((sp, i) => (
                        <MiniGridCell key={i} sp={sp} />
                    ))}
                </div>
            </div>
        </button>
    );
};
