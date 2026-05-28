import React, { useState, useEffect, useRef } from "react";
import "./Projects.scss";
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import { Link } from 'react-router-dom';
import { Play, Maximize2, X, ExternalLink, ChevronRight, ChevronDown } from "lucide-react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGooglePlay, faApple } from '@fortawesome/free-brands-svg-icons';

const projectModules = import.meta.glob("../../data/projects/*.json", { eager: true });
const projectsDataRaw = Object.values(projectModules).map(m => m.default || m);
import highlightsDataRaw from "../../data/highlights.json";
import secondaryOrderRaw from "../../data/secondary_order.json";

export const ProjectRow = ({ project: initialProject }) => {
    const [project, setProject] = useState(initialProject);
    const isCollection = !!project.isCollection;
    const hasVideo = !!project.url || isCollection;
    const hasThumbnail = !!project.profile;

    const screenshots = project.url ? [] : [project.profile].filter(Boolean);

    const [activeType, setActiveType] = useState(isCollection ? "grid1" : (project.url ? "video" : "image"));
    const [activeSubProject, setActiveSubProject] = useState(null);
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
            if (isCollection) {
                const needsImages = project.subProjects.some(sp => !sp.profile);
                if (needsImages) {
                    const loadData = async () => {
                        let updatedProject = { ...project };
                        const updatedSubProjects = await Promise.all(
                            updatedProject.subProjects.map(async (sp) => {
                                if (!sp.profile) {
                                    if (sp.hasThumbnail === false) {
                                        return { ...sp, profile: "" };
                                    }
                                    try {
                                        let url;
                                        const imageKey1 = sp.id || sp.name;
                                        const imageKey2 = sp.name;
                                        try {
                                            url = await getDownloadURL(ref(getStorage(), `${imageKey1}.jpg`));
                                        } catch (err1) {
                                            try {
                                                url = await getDownloadURL(ref(getStorage(), `${imageKey1}.png`));
                                            } catch (err2) {
                                                if (imageKey1 !== imageKey2) {
                                                    try {
                                                        url = await getDownloadURL(ref(getStorage(), `${imageKey2}.jpg`));
                                                    } catch (err3) {
                                                        url = await getDownloadURL(ref(getStorage(), `${imageKey2}.png`));
                                                    }
                                                } else {
                                                    throw err2;
                                                }
                                            }
                                        }
                                        return { ...sp, profile: url };
                                    } catch (err) {
                                        return { ...sp, profile: "" };
                                    }
                                }
                                return sp;
                            })
                        );
                        updatedProject.subProjects = updatedSubProjects;
                        
                        // Cache the fetched URLs back into the global source object
                        if (initialProject && initialProject.subProjects) {
                            initialProject.subProjects = updatedSubProjects;
                        }

                        if (isMounted) setProject(updatedProject);
                    };
                    loadData();
                }
            } else {
                const needsImage = project.profile === undefined;
                if (needsImage) {
                    const loadData = async () => {
                        let updatedProject = { ...project };
                        let updated = false;

                        if (updatedProject.hasThumbnail === false) {
                            updatedProject.profile = "";
                            updated = true;
                        } else {
                        try {
                            let url;
                            const imageKey1 = updatedProject.id || updatedProject.name;
                            const imageKey2 = updatedProject.name;
                            try {
                                url = await getDownloadURL(ref(getStorage(), `${imageKey1}.jpg`));
                            } catch (err1) {
                                try {
                                    url = await getDownloadURL(ref(getStorage(), `${imageKey1}.png`));
                                } catch (err2) {
                                    if (imageKey1 !== imageKey2) {
                                        try {
                                            url = await getDownloadURL(ref(getStorage(), `${imageKey2}.jpg`));
                                        } catch (err3) {
                                            url = await getDownloadURL(ref(getStorage(), `${imageKey2}.png`));
                                        }
                                    } else {
                                        throw err2;
                                    }
                                }
                            }
                            updatedProject.profile = url;
                            updated = true;
                        } catch (err) {
                            console.error(`Error fetching profile image for ${updatedProject.name}:`, err);
                            updatedProject.profile = ""; 
                            updated = true;
                        }
                        }

                        if (isMounted && updated) {
                            setProject(updatedProject);
                        }
                    };
                    loadData();
                }
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

    const showCarousel = screenshots.length > 0 || isCollection;

    useEffect(() => {
        if (project.profile) {
            setActiveImg(project.profile);
        }
    }, [project.profile]);

    let currentVideoUrl = "";
    let currentThumbnail = "";
    if (isCollection && activeSubProject) {
        currentVideoUrl = activeSubProject.url;
        currentThumbnail = activeSubProject.profile;
    } else {
        currentVideoUrl = project.url;
        currentThumbnail = project.profile;
    }

    const baseVideoUrl = currentVideoUrl
        ? currentVideoUrl
            .replace("?autoplay=1", "")
            .replace("&autoplay=1", "")
            .replace("youtube.com", "youtube-nocookie.com")
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

                {/* Right Side: Media (Video Display + Screenshots Carousel similar to Steam Store) */}
                <div className="project-media-side">
                    <div className="main-media-display">
                        {isCollection && (activeType === "grid1" || activeType === "grid2") ? (
                            <div className="collection-grid animate-fade-in">
                                {project.subProjects.slice(activeType === "grid1" ? 0 : 10, activeType === "grid1" ? 10 : 20).map((sp, idx) => (
                                    <div 
                                        key={idx} 
                                        className="grid-cell"
                                        style={{ backgroundImage: `url(${sp.profile})` }}
                                        onClick={() => {
                                            setActiveSubProject(sp);
                                            setActiveType("video");
                                            setIsPlayingVideo(true);
                                        }}
                                    >
                                        {!sp.profile && <div className="loading-pulse" />}
                                        <div className="grid-cell-overlay">
                                            <span className="grid-cell-title">{sp.name}</span>
                                            <Play size={24} className="grid-cell-play" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : activeType === "video" && hasVideo ? (
                            (!currentThumbnail || isPlayingVideo) ? (
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
                                    {currentThumbnail && (
                                        <img
                                            className="media-active-img"
                                            src={currentThumbnail}
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
                            {isCollection ? (
                                <>
                                    <button
                                        className={`thumbnail-btn ${activeType === "grid1" ? "active" : ""}`}
                                        onClick={() => setActiveType("grid1")}
                                    >
                                        <div className="thumb-image grid-thumb-icon">
                                            <div className="mini-grid">
                                                {project.subProjects.slice(0, 10).map((sp, i) => (
                                                    <div key={i} className="mini-grid-cell" style={{ backgroundImage: `url(${sp.profile})` }}></div>
                                                ))}
                                            </div>
                                        </div>
                                    </button>
                                    {project.subProjects.length > 10 && (
                                        <button
                                            className={`thumbnail-btn ${activeType === "grid2" ? "active" : ""}`}
                                            onClick={() => setActiveType("grid2")}
                                        >
                                            <div className="thumb-image grid-thumb-icon">
                                                <div className="mini-grid">
                                                    {project.subProjects.slice(10, 20).map((sp, i) => (
                                                        <div key={i} className="mini-grid-cell" style={{ backgroundImage: `url(${sp.profile})` }}></div>
                                                    ))}
                                                </div>
                                            </div>
                                        </button>
                                    )}
                                    {activeType === "video" && activeSubProject && (
                                        <button className={`thumbnail-btn active`}>
                                            <div
                                                className="thumb-image"
                                                style={{ backgroundImage: `url(${activeSubProject.profile})` }}
                                            >
                                                <div className="thumb-video-icon">
                                                    <Play size={18} fill="white" className="play-ico" />
                                                </div>
                                            </div>
                                        </button>
                                    )}
                                </>
                            ) : (
                                <>
                                    {project.url && (
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
                                </>
                            )}
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

const nonSpotlightProjects = freshProjects.filter(p => !initialSpotlightProjects.includes(p));
const secondaryOrderedProjects = computeSpotlight(nonSpotlightProjects, secondaryOrderRaw);

export const sortedAllProjects = [
    ...initialSpotlightProjects,
    ...secondaryOrderedProjects,
    ...nonSpotlightProjects.filter(p => !secondaryOrderedProjects.includes(p))
];

const Projects = ({ projectsData, hideSeeMore = false }) => {
    const [projects, setProjects] = useState(projectsData || initialSpotlightProjects);
    const [isExpanded, setIsExpanded] = useState(hideSeeMore);

    useEffect(() => {
        if (projectsData) {
            setProjects(projectsData);
            setIsExpanded(true);
        }
    }, [projectsData]);

    const handleExpand = () => {
        setProjects(sortedAllProjects);
        setIsExpanded(true);
    };

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

            {!isExpanded && (
                <div className={`see-more-section ${projects.length % 2 === 0 ? 'bg-even' : 'bg-odd'}`}>
                    <div className="container text-center">
                        <button className="see-more-projects-btn" onClick={handleExpand} style={{ cursor: "pointer" }}>
                            SEE ALL PROJECTS <ChevronDown size={18} className="btn-arrow" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Projects;