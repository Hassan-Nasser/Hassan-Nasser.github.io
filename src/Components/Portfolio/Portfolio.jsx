import React, { Component } from "react";
import "./Portfolio.scss";
import { ProjectRow } from "../Projects/Projects";
import "../Projects/Projects.scss";
import { withRouter } from "../../config/withRouter";

const projectModules = import.meta.glob("../../data/projects/*.json", { eager: true });
const localProjects = Object.values(projectModules).map(m => m.default || m);

class Portfolio extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tags: [],
            projects: [],
            selected: "All",
        };
    }

    componentDidMount() {
        this.loadLocalData();
    }

    loadLocalData = async () => {
        // Extract unique tags (genres + platforms) from local projects
        const tagSet = new Set();
        localProjects.forEach(p => {
            if (p.genres) p.genres.forEach(g => tagSet.add(g));
            if (p.platforms) p.platforms.forEach(pl => tagSet.add(pl));
        });
        
        const tags = Array.from(tagSet).map((name) => ({ name }));
        this.setState({ tags });

        // Initial hash check
        let tagName = window.location.hash.split('=')[1] || "All";
        tagName = decodeURIComponent(tagName);
        tagName = tagName.replace("_", " "); // handle old formatting

        if (tagName === "All") {
            this.getAllProject();
        } else {
            this.getProjectWithTag(tagName);
            this.setState({ selected: tagName });
        }
    }

    getAllProject = () => {
        this.setState({ projects: localProjects });
    }

    getProjectWithTag = (tagName) => {
        const filtered = localProjects.filter(p => 
            (p.genres && p.genres.includes(tagName)) || 
            (p.platforms && p.platforms.includes(tagName))
        );
        this.setState({ projects: filtered });
    }

    onTagClick = (tagName) => {
        this.setState({ selected: tagName });
        if (tagName === "All") {
            this.props.navigate(`/portfolio?tag=All`)
            this.getAllProject();
        } else {
            this.props.navigate(`/portfolio?tag=${encodeURIComponent(tagName.replace(" ", "_"))}`)
            this.getProjectWithTag(tagName);
        }
    }

    render() {
        return (
            <section className="portfolio spad">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <ul className="portfolio__filter">
                                <li
                                    className={`TechnaSans ${this.state.selected === "All" ? "active" : ""}`}
                                    onClick={() => {
                                        this.onTagClick("All");
                                    }}>All</li>
                                {this.state.tags && this.state.tags.map((tag, index) =>
                                    <li key={index}
                                        className={`TechnaSans ${this.state.selected === tag.name ? "active" : ""}`}
                                        onClick={() => {
                                            this.onTagClick(tag.name);
                                        }} >{tag.name}</li>
                                )}
                            </ul>
                        </div>
                    </div>

                    <div className="projects-list-container portfolio-override-container">
                        {this.state.projects && this.state.projects.map((project, index) => (
                            <ProjectRow key={project.name || index} project={project} />
                        ))}
                    </div>
                </div>
            </section>
        );
    }
}
export default withRouter(Portfolio) 