import React, { useState, useEffect, useRef } from "react";
import "./Projects.scss";
import { db } from "../../config/firebase";
import { collection, getDoc, getDocs, query, where, doc } from "firebase/firestore";
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import { Link } from 'react-router-dom';
import { Play, Maximize2, X, ExternalLink, ChevronRight } from "lucide-react";

let memoryProjectsCache = null;
let memoryHighlightsCache = null;

const CACHE_KEY_PROJECTS = "portfolio_projects_cache_v3";
const CACHE_KEY_HIGHLIGHTS = "portfolio_highlights_cache_v3";

let globalPrefetchPromise = null;

const initiatePrefetch = () => {
    if (!globalPrefetchPromise) {
        // Start the network request immediately, outside the React lifecycle
        globalPrefetchPromise = Promise.all([
            getDocs(collection(db, "projects")),
            getDocs(collection(db, "highlights")),
            getDocs(collection(db, "tags"))
        ]).catch(err => {
            console.error("Prefetch failed", err);
            // Allow retry if it fails
            globalPrefetchPromise = null;
            throw err;
        });
    }
    return globalPrefetchPromise;
};

// Trigger the prefetch the absolute millisecond this file is parsed by the browser
initiatePrefetch();

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
    }, [isIntersecting, project.profile, project.tags, project.name]);

    const meta = {
        role: project.role || project.jobTitle || "Senior Game Developer",
        platforms: project.platforms || project.platform || "PC | Mobile",
        buttonText: project.buttonText || (project.googlePlay ? "Google Play Store" : "Launch App")
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
                        {project.tags && project.tags.map((tag, idx) => (
                            <span key={idx} className="project-tag-badge">
                                {tag.name}
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

const computeSpotlight = (projCache, highCache) => {
    const highlightNames = [];
    highCache.forEach(h => {
        if (h.name && !highlightNames.includes(h.name)) highlightNames.push(h.name);
        if (h.id && h.id !== 'highlights' && h.id !== 'default' && !highlightNames.includes(h.id)) highlightNames.push(h.id);
        
        Object.values(h).forEach(val => {
            if (Array.isArray(val)) {
                val.forEach(v => {
                    if (typeof v === 'string' && !highlightNames.includes(v)) highlightNames.push(v);
                });
            }
        });
    });

    let spotlightProjects = projCache.filter(p => highlightNames.includes(p.name) || highlightNames.includes(p.id));

    if (spotlightProjects.length === 0) {
        spotlightProjects = projCache.filter(p => p.spotlight);
    }

    spotlightProjects.sort((a, b) => {
        let indexA = highlightNames.indexOf(a.name);
        if (indexA === -1) indexA = highlightNames.indexOf(a.id);
        
        let indexB = highlightNames.indexOf(b.name);
        if (indexB === -1) indexB = highlightNames.indexOf(b.id);
        
        if (indexA !== -1 && indexB !== -1) return indexA - indexB;
        if (indexA !== -1) return -1;
        if (indexB !== -1) return 1;

        const orderA = parseInt(a.order || 999);
        const orderB = parseInt(b.order || 999);
        return orderA - orderB;
    });

    return spotlightProjects;
};

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const getSpotlightProjects = async () => {
            try {
                // 1. Instantly load from cache if available
                let cachedProjects = memoryProjectsCache;
                let cachedHighlights = memoryHighlightsCache;

                if (!cachedProjects || !cachedHighlights) {
                    const localProjects = localStorage.getItem(CACHE_KEY_PROJECTS);
                    const localHighlights = localStorage.getItem(CACHE_KEY_HIGHLIGHTS);

                    if (localProjects && localHighlights) {
                        cachedProjects = JSON.parse(localProjects);
                        cachedHighlights = JSON.parse(localHighlights);
                        memoryProjectsCache = cachedProjects;
                        memoryHighlightsCache = cachedHighlights;
                    }
                }

                if (cachedProjects && cachedHighlights) {
                    const spotlightProjects = computeSpotlight(cachedProjects, cachedHighlights);
                    setProjects(spotlightProjects);
                    setIsLoading(false);
                }

                // 2. Fetch fresh data using the prefetch promise (or start a new one if it failed)
                const [projectsSnap, highlightsSnap, tagsSnap] = await initiatePrefetch();

                const tagsDict = {};
                tagsSnap.docs.forEach(d => {
                    tagsDict[d.id] = { id: d.id, ...d.data() };
                    if (d.ref && d.ref.path) {
                        tagsDict[d.ref.path] = tagsDict[d.id];
                    }
                });

                const freshProjects = projectsSnap.docs.map(d => {
                    const data = d.data();
                    data.id = d.id;
                    if (data.tags && Array.isArray(data.tags)) {
                        data.tags = data.tags.map(t => {
                            const tagData = tagsDict[t.id] || tagsDict[t.path];
                            if (tagData) return tagData;
                            if (t.path) return { _refPath: t.path };
                            return t;
                        });
                    }
                    return data;
                });

                const freshHighlights = highlightsSnap.docs.map(d => ({ id: d.id, ...d.data() }));

                memoryProjectsCache = freshProjects;
                memoryHighlightsCache = freshHighlights;
                localStorage.setItem(CACHE_KEY_PROJECTS, JSON.stringify(freshProjects));
                localStorage.setItem(CACHE_KEY_HIGHLIGHTS, JSON.stringify(freshHighlights));

                const freshSpotlightProjects = computeSpotlight(freshProjects, freshHighlights);
                setProjects(freshSpotlightProjects);
            } catch (error) {
                console.error("Error loading projects from Firestore:", error);
            } finally {
                setIsLoading(false);
            }
        };

        getSpotlightProjects();
    }, []);

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
                {isLoading ? (
                    <div className="container py-5 text-center">
                        <div className="spinner-border text-info" role="status">
                            <span className="visually-hidden">Loading Projects...</span>
                        </div>
                    </div>
                ) : (
                    projects.map((project, index) => (
                        <ProjectRow key={index} project={project} />
                    ))
                )}
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