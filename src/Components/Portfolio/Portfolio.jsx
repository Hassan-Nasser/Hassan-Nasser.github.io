import React, { useState, useEffect } from "react";
import "./Portfolio.scss";
import { ChevronDown } from "lucide-react";
import { ProjectRow } from "./components/ProjectRow";
import { sortedAllProjects, getInitialCount } from "./utils/projectSorting";

const Portfolio = ({ projectsData, hideSeeMore = false }) => {
    const [isExpanded, setIsExpanded] = useState(hideSeeMore || !!projectsData);

    const displayProjects = projectsData || sortedAllProjects;
    const initialCount = projectsData ? projectsData.length : getInitialCount();

    useEffect(() => {
        if (projectsData) {
            setIsExpanded(true);
        }
    }, [projectsData]);

    useEffect(() => {

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    el.classList.remove("reveal-hidden");
                    el.classList.add("revealed");

                    const handleTransitionEnd = (e) => {
                        if (e.target === el && (e.propertyName === 'opacity' || e.propertyName === 'transform')) {
                            el.style.willChange = 'auto';
                            el.removeEventListener('transitionend', handleTransitionEnd);
                        }
                        if (e.target.classList.contains('project-media-side') && (e.propertyName === 'opacity' || e.propertyName === 'transform')) {
                            e.target.style.willChange = 'auto';
                            e.target.removeEventListener('transitionend', handleTransitionEnd);
                        }
                    };
                    el.addEventListener('transitionend', handleTransitionEnd);
                    
                    const mediaSide = el.querySelector('.project-media-side');
                    if (mediaSide) {
                        mediaSide.addEventListener('transitionend', handleTransitionEnd);
                    }
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: "0px 0px -50px 0px"
        });

        const timeoutId = setTimeout(() => {
            const rows = document.querySelectorAll('.project-row.reveal-hidden');
            rows.forEach(row => {
                if (row.style.visibility === 'hidden') return;
                observer.observe(row);
            });

            rows.forEach(row => {
                if (row.style.visibility === 'hidden') return;
                const rect = row.getBoundingClientRect();
                if (rect.top < window.innerHeight - 100) {
                    row.classList.remove("reveal-hidden");
                    row.classList.add("revealed");
                    observer.unobserve(row);
                }
            });
        }, 100);

        return () => {
            clearTimeout(timeoutId);
            observer.disconnect();
        };
    }, [displayProjects, isExpanded]);

    const handleExpand = () => {
        setIsExpanded(true);
    };

    return (
        <div id="portfolio" className="portfolio-section">
            <div className="container">
                <div className="row text-center mb-5">
                    <div className="col-12">
                        <h2 className="projects-section-title">PROJECTS I'VE WORKED ON</h2>
                        <div className="title-glow-bar"></div>
                    </div>
                </div>
            </div>

            <div className="projects-list-container" style={{ position: 'relative' }}>
                {displayProjects.map((project, index) => {
                    const isVisible = isExpanded || index < initialCount;
                    const isLastVisible = index === (isExpanded ? displayProjects.length - 1 : initialCount - 1);
                    return (
                        <ProjectRow
                            key={project.id || project.name || index}
                            initialProject={project}
                            isVisible={isVisible}
                            isLastVisible={isLastVisible}
                        />
                    );
                })}
            </div>

            {!isExpanded && (
                <div className={`see-more-section ${initialCount % 2 === 0 ? 'bg-even' : 'bg-odd'}`}>
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

export default Portfolio;