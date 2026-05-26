import React, { useState, useEffect, useRef } from "react";
import "./Projects.scss";
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import { Link } from 'react-router-dom';
import { Play, Maximize2, X, ExternalLink, ChevronRight } from "lucide-react";

import projectsDataRaw from "../../data/projects.json";
import highlightsDataRaw from "../../data/highlights.json";

const ProjectRow = ({ project: initialProject }) => {
    const [project, setProject] = useState(initialProject);
    const hasVideo = !!project.url;
    const hasThumbnail = !!project.profile;

    const screenshots = hasVideo ? [] : [project.profile].filter(Boolean);

    const [activeType, setActiveType] = useState(hasVideo ? "video" : "image");
    const [activeImg, setActiveImg] = useState("");
    const [isPlayingVideo, setIsPlayingVideo] = useState(false);
    const [lightboxOpen, setLightboxOpen] = useState(false);

    const elementRef = useRef(null);
    const [isIntersecting, setIsIntersecting] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsIntersecting(true);
                observer.unobserve(entry.target);
            }
        }, {
            threshold: 0.15,
            rootMargin: "0px 0px -50px 0px"
        });

        if (elementRef.current) {
            observer.observe(elementRef.current);
        }

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        let isMounted = true;
        if (isIntersecting) {
            const needsImage = project.profile === undefined;
            const needsTags = project.tags && project.tags.some(t => t._refPath);

            if (needsImage || needsTags) {
                const loadData = async () => {
                    let updatedProject = { ...project };
                    let updated = false;

                    if (needsImage) {
                        try {
                            const url = await getDownloadURL(ref(getStorage(), `${updatedProject.name}.jpg`));
                            updatedProject.profile = url;
                            updated = true;
                        } catch (err) {
                            console.error(`Error fetching profile image for ${updatedProject.name}:`, err);
                            updatedProject.profile = ""; 
                            updated = true;
                        }
                    }

                    if (needsTags) {
                        try {
                            const fetchedTags = await Promise.all(
                                updatedProject.tags.map(async (t) => {
                                    if (t._refPath) {
                                        const tagDoc = await getDoc(doc(db, t._refPath));
                                        return tagDoc.exists() ? tagDoc.data() : { name: "Unknown" };
                                    }
                                    return t;
                                })
                            );
                            updatedProject.tags = fetchedTags;
                            updated = true;
                        } catch (err) {
                            console.error(`Error fetching tags for ${updatedProject.name}:`, err);
                            updatedProject.tags = [];
                            updated = true;
                        }
                    }

                    if (isMounted && updated) {
                        setProject(updatedProject);
                        if (memoryProjectsCache) {
                            const idx = memoryProjectsCache.findIndex(p => p.name === updatedProject.name);
                            if (idx !== -1) {
                                memoryProjectsCache[idx] = updatedProject;
                                localStorage.setItem(CACHE_KEY_PROJECTS, JSON.stringify(memoryProjectsCache));
                            }
                        }
                    }
                };
                loadData();
            }
        }
        return () => { isMounted = false; };
    }, [isIntersecting, project.profile, project.name]);

    const meta = {
        role: project.role || "Developer",
        platforms: project.platforms && project.platforms.length > 0 
            ? project.platforms.join(' | ') 
            : "Mobile",
        buttonText: project.buttonText || "View Project",
    };

    const showCarousel = screenshots.length > 0;

    useEffect(() => {
        if (project.profile) {
            setActiveImg(project.profile);
        }
    }, [project.profile]);

    const baseVideoUrl = project.url
        ? project.url.replace("?autoplay=1", "").replace("&autoplay=1", "")
        : "";
    const videoUrl = isPlayingVideo
        ? `${baseVideoUrl}${baseVideoUrl.includes("?") ? "&" : "?"}autoplay=1`
        : baseVideoUrl;

    return (
        <div
            ref={elementRef}
            className={`project-row ${isIntersecting ? "revealed" : "reveal-hidden"}`}
        >
            <div className="project-row-inner container">

                {/* Left Side: Name, Description, Meta & Action buttons */}
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
                                {meta.buttonText} <ExternalLink size={16} className="action-icon" />
                            </a>
                        )}
                        {project.url && !project.url.includes("youtube.com") && !project.url.includes("youtu.be") && !project.googlePlay && (
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

                {/* Right Side: Media (Video Display + Screenshots Carousel similar to Steam Store) */}
                <div className="project-media-side">
                    <div className="main-media-display">
                        {activeType === "video" && hasVideo ? (
                            (!hasThumbnail || isPlayingVideo) ? (
                                <div className="video-wrapper">
                                    <iframe
                                        className="media-iframe"
                                        src={videoUrl}
                                        title={`${project.name} Video Trailer`}
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    />
                                </div>
                            ) : (
                                <div className="video-preview-wrapper" onClick={() => setIsPlayingVideo(true)}>
                                    {project.profile && (
                                        <img
                                            className="media-active-img"
                                            src={project.profile}
                                            alt={`${project.name} Video Thumbnail`}
                                        />
                                    )}
                                    <div className="video-play-overlay">
                                        <div className="play-button-youtube">
                                            <Play size={32} fill="white" className="play-icon-triangle" />
                                        </div>
                                    </div>
                                </div>
                            )
                        ) : (
                            <div className="image-wrapper" onClick={() => setLightboxOpen(true)}>
                                <img
                                    className="media-active-img animate-fade-in"
                                    src={activeImg}
                                    alt={`${project.name} active display`}
                                />
                                <div className="image-overlay">
                                    <Maximize2 size={24} className="maximize-icon" />
                                    <span className="overlay-text">CLICK TO ZOOM</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Horizontal Steam-style media selector thumbnails — ONLY render if there is a carousel */}
                    {showCarousel && (
                        <div className="media-thumbnails">
                            {hasVideo && (
                                <button
                                    className={`thumbnail-btn ${activeType === "video" ? "active" : ""}`}
                                    onClick={() => {
                                        setActiveType("video");
                                        setIsPlayingVideo(false);
                                    }}
                                >
                                    <div
                                        className="thumb-image"
                                        style={{ backgroundImage: `url(${project.profile})` }}
                                    >
                                        <div className="thumb-video-icon">
                                            <Play size={18} fill="white" className="play-ico" />
                                        </div>
                                    </div>
                                </button>
                            )}

                            {screenshots.map((src, idx) => (
                                <button
                                    key={idx}
                                    className={`thumbnail-btn ${activeType === "image" && activeImg === src ? "active" : ""}`}
                                    onClick={() => {
                                        setActiveType("image");
                                        setActiveImg(src);
                                    }}
                                >
                                    <div
                                        className="thumb-image"
                                        style={{ backgroundImage: `url(${src})` }}
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

            </div>

            {/* Lightbox full-screen modal */}
            {lightboxOpen && (
                <div className="lightbox-modal" onClick={() => setLightboxOpen(false)}>
                    <div className="lightbox-content animate-zoom-in" onClick={(e) => e.stopPropagation()}>
                        <button className="lightbox-close-btn" onClick={() => setLightboxOpen(false)}>
                            <X size={28} />
                        </button>
                        <img className="lightbox-img" src={activeImg} alt={`${project.name} Fullscreen`} />
                        <div className="lightbox-caption">{project.name} - Gameplay Screenshot</div>
                    </div>
                </div>
            )}
        </div>
    );
};

const computeSpotlight = (projCache, highlightNames) => {
    const spotlightProjects = projCache.filter(p => highlightNames.includes(p.name) || highlightNames.includes(p.id));

    spotlightProjects.sort((a, b) => {
        let indexA = highlightNames.indexOf(a.name);
        if (indexA === -1) indexA = highlightNames.indexOf(a.id);
        
        let indexB = highlightNames.indexOf(b.name);
        if (indexB === -1) indexB = highlightNames.indexOf(b.id);
        
        return indexA - indexB;
    });

    return spotlightProjects;
};const freshProjects = projectsDataRaw.map(d => {
    const data = { ...d };
    data.platforms = data.platforms || [];
    data.genres = data.genres || [];
    return data;
});

const initialSpotlightProjects = computeSpotlight(freshProjects, highlightsDataRaw);

const Projects = () => {
    const [projects, setProjects] = useState(initialSpotlightProjects);

    return (
        <div className="work" id="portfolio">
            <div className="container">
                <div className="row text-center mb-5">
                    <div className="col-12">
                        <h2 className="projects-section-title">PROJECTS I'VE WORKED ON</h2>
                        <div className="title-glow-bar"></div>
                    </div>
                </div>
            </div>
            
            <div className="projects-list-container">
                {projects.map((project, index) => (
                    <ProjectRow key={index} project={project} />
                ))}
            </div>

            <div className={`see-more-section ${projects.length % 2 === 0 ? 'bg-even' : 'bg-odd'}`}>
                <div className="container text-center">
                    <Link className="see-more-projects-btn" to="/portfolio?tag=All">
                        See More Projects <ChevronRight size={18} className="btn-arrow" />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Projects;