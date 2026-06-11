import React from "react";
import { Play } from "lucide-react";
import { getYouTubeThumbnail } from "../utils/youtubeUtils";

export const GridCell = ({ sp, onClick }) => {
    const thumbUrl = getYouTubeThumbnail(sp.url, 'mqdefault') || sp.profile;

    return (
        <div className="grid-cell" onClick={() => onClick({ ...sp, profile: thumbUrl })} style={{ position: 'relative', overflow: 'hidden', backgroundColor: '#0f172a' }}>
            <img
                decoding="async"
                src={thumbUrl || "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs="}
                alt={sp.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, zIndex: 1 }}
            />
            <div className="grid-cell-overlay" style={{ zIndex: 2 }}>
                <span className="grid-cell-title">{sp.name}</span>
                <Play size={24} className="grid-cell-play" />
            </div>
        </div>
    );
};
