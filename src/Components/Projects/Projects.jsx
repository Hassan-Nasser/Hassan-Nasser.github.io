import React, { useState, useEffect, useRef } from "react";
import "./Projects.scss";
import { db } from "../../config/firebase";
import { collection, getDoc, getDocs, query, where } from "firebase/firestore";
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import { Link } from 'react-router-dom';
import { Play, Maximize2, X, ExternalLink, ChevronRight } from "lucide-react";

const projectMetaDetails = {
    "Forest Knight": {
        role: "Lead Game Developer | Architecture & Systems",
        platforms: "Android | iOS",
        buttonText: "Google Play Store"
    },
    "Arena Rumble": {
        role: "Senior Game Developer | Multiplayer & Core Systems",
        platforms: "PC | Web",
        buttonText: "Play Demo"
    },
    "Millionaires Deal": {
        role: "Senior Unity Developer | Card Mechanics & UI",
        platforms: "Android | iOS",
        buttonText: "Google Play Store"
    },
    "Virtual Market Metaverse": {
        role: "Lead Metaverse Architect | 3D WebGL & Systems",
        platforms: "PC | VR | Web",
        buttonText: "Launch WebGL App"
    }
};

const ProjectRow = ({ project }) => {
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

    const meta = projectMetaDetails[project.name] || {
        role: "Senior Game Developer",
        platforms: "PC | Mobile",
        buttonText: "Launch App"
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

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const getSpotlightProjects = async () => {
            try {
                const projectsCol = query(collection(db, "projects"), where("spotlight", "==", true));
                const allDocs = await getDocs(projectsCol);

                const projectList = await Promise.all(
                    allDocs.docs.map(async (doc) => {
                        let data = doc.data();
                        try {
                            data.profile = await getDownloadURL(ref(getStorage(), `${doc.data().name}.jpg`));
                        } catch (err) {
                            console.error(`Error fetching profile image for ${doc.data().name}:`, err);
                            data.profile = "";
                        }

                        try {
                            data.tags = await Promise.all(
                                doc.data().tags.map(async (tagRef) => {
                                    const tagDoc = await getDoc(tagRef);
                                    return tagDoc.data();
                                })
                            );
                        } catch (err) {
                            console.error(`Error fetching tags for ${doc.data().name}:`, err);
                            data.tags = [];
                        }

                        return data;
                    })
                );

                projectList.sort((a, b) => {
                    const orderA = parseInt(a.order || 999);
                    const orderB = parseInt(b.order || 999);
                    return orderA - orderB;
                });

                setProjects(projectList);
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