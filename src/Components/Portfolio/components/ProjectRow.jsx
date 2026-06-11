import React, { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { ProjectInfo } from "./ProjectInfo";
import { ProjectMedia } from "./ProjectMedia";

export const ProjectRow = React.memo(({ initialProject, isVisible = true, isLastVisible = false }) => {
    const [project, setProject] = useState(initialProject);
    const isCollection = !!project.isCollection;
    const hasVideo = !!project.url || isCollection;

    const screenshots = [];
    if (!project.url && project.profile) {
        screenshots.push(project.profile);
    }
    if (project.galleryUrls && project.galleryUrls.length > 0) {
        screenshots.push(...project.galleryUrls);
    }

    const [activeType, setActiveType] = useState(isCollection ? "grid1" : (project.url ? "video" : "image"));
    const [activeSubProject, setActiveSubProject] = useState(null);
    const [activeImg, setActiveImg] = useState("");
    const [isPlayingVideo, setIsPlayingVideo] = useState(false);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [isFetchingThumbnail, setIsFetchingThumbnail] = useState(false);
    const [iframeLoaded, setIframeLoaded] = useState(false);
    const [ytFallback, setYtFallback] = useState(false);
    const carouselRef = useRef(null);

    const meta = {
        role: project.role || "Developer",
        platforms: project.platforms && project.platforms.length > 0
            ? project.platforms.join(' | ')
            : "Mobile",
        buttonText: project.buttonText || "View Project",
    };

    const showCarousel = screenshots.length > 1 || isCollection || project.hasGallery;
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

    const getYouTubeThumbnail = (url) => {
        if (!url) return "";
        const match = url.match(/(?:youtube\.com\/embed\/|youtube-nocookie\.com\/embed\/|youtube\.com\/shorts\/|youtu\.be\/)([^?&]+)/);
        if (!match) return "";
        let thumbUrl = `https://img.youtube.com/vi/${match[1]}/maxresdefault.jpg`;
        if (ytFallback) thumbUrl = thumbUrl.replace('maxresdefault.jpg', 'hqdefault.jpg');
        return thumbUrl;
    };

    let carouselThumb = currentThumbnail || getYouTubeThumbnail(currentVideoUrl);
    if (ytFallback && carouselThumb.includes('maxresdefault.jpg')) {
        carouselThumb = carouselThumb.replace('maxresdefault.jpg', 'hqdefault.jpg');
    }

    useEffect(() => {
        setIframeLoaded(false);
    }, [currentVideoUrl]);

    const baseVideoUrl = (() => {
        if (!currentVideoUrl) return "";
        let url = currentVideoUrl.replace("?autoplay=1", "").replace("&autoplay=1", "");

        if (url.includes("/shorts/")) {
            url = url.replace("youtube.com/shorts/", "www.youtube-nocookie.com/embed/");
            url = url.replace("www.www.youtube", "www.youtube");
        } else {
            url = url.replace("youtube.com", "www.youtube-nocookie.com");
            url = url.replace("www.www.youtube", "www.youtube");
        }
        return url;
    })();

    const videoUrl = isPlayingVideo
        ? `${baseVideoUrl}${baseVideoUrl.includes("?") ? "&" : "?"}autoplay=1`
        : baseVideoUrl;

    return (
        <div
            className="project-row reveal-hidden"
            style={isVisible ? {
                borderBottom: isLastVisible ? 'none' : undefined
            } : {
                position: 'absolute',
                visibility: 'hidden',
                pointerEvents: 'none',
                opacity: 0,
                left: 0,
                right: 0,
                zIndex: -1,
                borderBottom: isLastVisible ? 'none' : undefined
            }}
        >
            <div className="project-row-inner container">
                <ProjectInfo project={project} meta={meta} />

                <ProjectMedia
                    project={project}
                    isCollection={isCollection}
                    hasVideo={hasVideo}
                    activeType={activeType}
                    setActiveType={setActiveType}
                    activeSubProject={activeSubProject}
                    setActiveSubProject={setActiveSubProject}
                    activeImg={activeImg}
                    setActiveImg={setActiveImg}
                    isPlayingVideo={isPlayingVideo}
                    setIsPlayingVideo={setIsPlayingVideo}
                    isFetchingThumbnail={isFetchingThumbnail}
                    shouldPreloadIframe={false}
                    iframeLoaded={iframeLoaded}
                    setIframeLoaded={setIframeLoaded}
                    carouselThumb={carouselThumb}
                    ytFallback={ytFallback}
                    setYtFallback={setYtFallback}
                    videoUrl={videoUrl}
                    setLightboxOpen={setLightboxOpen}
                    screenshots={screenshots}
                    showCarousel={showCarousel}
                    carouselRef={carouselRef}
                />
            </div>
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
}, (prevProps, nextProps) => {
    return prevProps.isVisible === nextProps.isVisible &&
        prevProps.initialProject === nextProps.initialProject;
});
