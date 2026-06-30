import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGooglePlay, faApple } from '@fortawesome/free-brands-svg-icons';
import { ExternalLink } from "lucide-react";

export const ProjectInfo = ({ project, meta }) => {
    return (
        <div className="project-info-side">
            <div className="project-header">
                <div className="project-title-group">
                    <h2 className="project-title">{project.name}</h2>
                    <div className="project-sub-meta">
                        <span className="project-role">{meta.role}</span>
                        <span className="meta-separator">|</span>
                        <span className="project-platforms">({meta.platforms})</span>
                    </div>
                </div>
            </div>

            <p className="project-desc">{project.description}</p>

            {project.highlights && project.highlights.length > 0 && (
                <div className="project-highlights-container">
                    <h4 className="highlights-title">Technical Contributions</h4>
                    <ul className="highlights-list">
                        {project.highlights.map((h, i) => (
                            <li key={i} className="highlight-item">{h}</li>
                        ))}
                    </ul>
                </div>
            )}

            <div className="project-tags">
                {project.platforms && project.platforms.map((platformName, idx) => (
                    <span key={`p-${idx}`} className="project-tag-badge platform-badge">
                        {platformName}
                    </span>
                ))}
                {project.genres && project.genres.map((genreName, idx) => (
                    <span key={`g-${idx}`} className="project-tag-badge">
                        {genreName}
                    </span>
                ))}
            </div>

            <div className="project-actions">
                {project.googlePlay && (
                    <a
                        href={project.googlePlay}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-glass-action"
                    >
                        <FontAwesomeIcon icon={faGooglePlay} style={{ marginRight: '8px' }} /> Google Play
                    </a>
                )}
                {project.appStore && (
                    <a
                        href={project.appStore}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-glass-action"
                    >
                        <FontAwesomeIcon icon={faApple} style={{ marginRight: '8px', fontSize: '1.2em', marginBottom: '2px' }} /> App Store
                    </a>
                )}
                {project.url && !project.url.includes("youtube.com") && !project.url.includes("youtu.be") && !project.googlePlay && !project.appStore && (
                    <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-glass-action"
                    >
                        {meta.buttonText} <ExternalLink size={16} className="action-icon" />
                    </a>
                )}
            </div>
        </div>
    );
};
