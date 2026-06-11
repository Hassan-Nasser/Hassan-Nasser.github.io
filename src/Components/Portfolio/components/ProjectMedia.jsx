import { Play, Maximize2 } from "lucide-react";
import { GridCell } from "./GridCell";
import { CarouselThumbnail } from "./CarouselThumbnail";
import { MiniGridButton } from "./MiniGridButton";

export const ProjectMedia = ({
    project,
    isCollection,
    hasVideo,
    activeType,
    setActiveType,
    activeSubProject,
    setActiveSubProject,
    activeImg,
    setActiveImg,
    isPlayingVideo,
    setIsPlayingVideo,
    isFetchingThumbnail,
    shouldPreloadIframe,
    iframeLoaded,
    setIframeLoaded,
    carouselThumb,
    ytFallback,
    setYtFallback,
    videoUrl,
    setLightboxOpen,
    screenshots,
    showCarousel,
    carouselRef
}) => {
    return (
        <div className="project-media-side">
            <div className="main-media-display">
                {isCollection && (activeType === "grid1" || activeType === "grid2") ? (
                    <div className="collection-grid animate-fade-in">
                        {project.subProjects.slice(activeType === "grid1" ? 0 : 10, activeType === "grid1" ? 10 : 20).map((sp, idx) => (
                            <GridCell
                                key={idx}
                                sp={sp}
                                onClick={() => {
                                    setActiveSubProject(sp);
                                    setActiveType("video");
                                    setIsPlayingVideo(true);
                                }}
                            />
                        ))}
                    </div>
                ) : activeType === "video" && hasVideo ? (
                    <div className="video-wrapper" style={{ background: '#020617' }}>
                        {(isPlayingVideo || shouldPreloadIframe) && (
                            <>
                                {!iframeLoaded && isPlayingVideo && (
                                    <div className="skeleton-loader-premium" style={{ zIndex: 10 }}>
                                        <div className="skeleton-logo" />
                                    </div>
                                )}
                                <iframe
                                    loading="lazy"
                                    onLoad={() => setIframeLoaded(true)}
                                    className="media-iframe"
                                    src={videoUrl}
                                    title={`${project.name} Video Trailer`}
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    style={{ opacity: iframeLoaded ? 1 : 0, transition: 'opacity 0.4s ease', zIndex: 1 }}
                                />
                            </>
                        )}
                        {!isPlayingVideo && (
                            <div
                                className="video-preview-wrapper"
                                onClick={() => setIsPlayingVideo(true)}
                                style={{ zIndex: 2 }}
                            >
                                {carouselThumb ? (
                                    <img
                                        decoding="async"
                                        loading="lazy"
                                        className="media-active-img animate-fade-in"
                                        src={carouselThumb}
                                        alt={`${project.name} Video Thumbnail`}
                                        onError={() => {
                                            if (carouselThumb.includes("maxresdefault.jpg")) {
                                                setYtFallback(true);
                                            }
                                        }}
                                        onLoad={(e) => {
                                            if (carouselThumb.includes("maxresdefault.jpg") && e.target.naturalWidth === 120) {
                                                setYtFallback(true);
                                            }
                                        }}
                                    />
                                ) : (
                                    <div className="skeleton-loader-premium">
                                        <div className="skeleton-logo" />
                                    </div>
                                )}
                                <div className="video-play-overlay">
                                    <div className="play-button-youtube">
                                        <Play size={32} fill="white" className="play-icon-triangle" />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="image-wrapper" onClick={() => setLightboxOpen(true)}>
                        {(!activeImg && isFetchingThumbnail) ? (
                            <div className="skeleton-loader-premium">
                                <div className="skeleton-logo" />
                            </div>
                        ) : (
                            <>
                                {activeImg ? (
                                    <img
                                        decoding="async"
                                        loading="lazy"
                                        className="media-active-img animate-fade-in"
                                        src={typeof activeImg === 'number' ? (screenshots[activeImg] && (screenshots[activeImg].includes('ytimg.com') || screenshots[activeImg].includes('youtube.com') || screenshots[activeImg].includes('data:image')) ? screenshots[activeImg] : `https://wsrv.nl/?url=${encodeURIComponent(screenshots[activeImg])}&w=1280&output=webp&q=80`) : (activeImg.includes('ytimg.com') || activeImg.includes('youtube.com') || activeImg.includes('data:image') ? activeImg : `https://wsrv.nl/?url=${encodeURIComponent(activeImg)}&w=1280&output=webp&q=80`)}
                                        alt={`${project.name} active display`}
                                    />
                                ) : (
                                    <div className="media-active-img animate-fade-in" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#020617' }}>
                                        <span style={{ color: '#64748b', fontFamily: 'Inter', fontSize: '0.9rem' }}>Media Unavailable</span>
                                    </div>
                                )}
                                <div className="image-overlay">
                                    <Maximize2 size={24} className="maximize-icon" />
                                    <span className="overlay-text">CLICK TO ZOOM</span>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>
            {showCarousel && (
                <div ref={carouselRef} className="media-thumbnails">
                    {isCollection ? (
                        <>
                            <MiniGridButton
                                sps={project.subProjects.slice(0, 10)}
                                isActive={activeType === "grid1"}
                                onClick={() => setActiveType("grid1")}
                            />
                            {project.subProjects.length > 10 && (
                                <MiniGridButton
                                    sps={project.subProjects.slice(10, 20)}
                                    isActive={activeType === "grid2"}
                                    onClick={() => setActiveType("grid2")}
                                />
                            )}
                            {activeType === "video" && activeSubProject && (
                                <CarouselThumbnail
                                    src={activeSubProject.profile}
                                    isActive={true}
                                    icon={<Play size={18} fill="white" className="play-ico" />}
                                />
                            )}
                        </>
                    ) : (
                        <>
                            {project.url && (
                                <CarouselThumbnail
                                    src={carouselThumb}
                                    isActive={activeType === "video"}
                                    onClick={() => {
                                        setActiveType("video");
                                        setIsPlayingVideo(false);
                                    }}
                                    icon={<Play size={18} fill="white" className="play-ico" />}
                                />
                            )}
                            {screenshots.length > 0 ? (
                                screenshots.map((src, idx) => (
                                    <CarouselThumbnail
                                        key={idx}
                                        src={src}
                                        isActive={activeType === "image" && activeImg === src}
                                        onClick={() => {
                                            setActiveType("image");
                                            setActiveImg(src);
                                        }}
                                    />
                                ))
                            ) : project.hasGallery ? (
                                [1, 2, 3].map((skeleton) => (
                                    <button key={`skeleton-${skeleton}`} className="thumbnail-btn" style={{ position: 'relative', pointerEvents: 'none', overflow: 'hidden' }}>
                                        <div className="skeleton-loader-premium" style={{ zIndex: 1, borderRadius: 'inherit' }}>
                                            <div className="skeleton-logo" style={{ width: '20px', height: '20px' }} />
                                        </div>
                                    </button>
                                ))
                            ) : null}
                        </>
                    )}
                </div>
            )}
        </div>
    );
};
