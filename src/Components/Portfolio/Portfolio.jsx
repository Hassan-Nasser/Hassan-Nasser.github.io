import React, { Component } from "react";
import "./Portfolio.scss";
import { Pagination } from "../Pagination/Pagination";
import { getDownloadURL, getStorage, ref } from "firebase/storage";
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
        this.child = React.createRef();
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

    fetchProfilesForProjects = async (projectsToProcess) => {
        const projectList = await Promise.all(projectsToProcess.map(async (project) => {
            const p = { ...project };
            try {
                if(!p.profile) {
                   p.profile = await getDownloadURL(ref(getStorage(), `${p.name}.jpg`));
                }
            } catch (err) {
                console.error("Could not fetch profile image for", p.name);
            }
            return p;
        }));
        this.setState({ projects: projectList });
        this.child.current?.SetLoading(false);
    }

    getAllProject = () => {
        this.fetchProfilesForProjects(localProjects);
    }

    getProjectWithTag = (tagName) => {
        const filtered = localProjects.filter(p => 
            (p.genres && p.genres.includes(tagName)) || 
            (p.platforms && p.platforms.includes(tagName))
        );
        this.fetchProfilesForProjects(filtered);
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
                                        this.child.current?.resetCurrentPage();
                                        this.child.current?.SetLoading(true);
                                    }}>All</li>
                                {this.state.tags && this.state.tags.map((tag, index) =>
                                    <li key={index}
                                        className={`TechnaSans ${this.state.selected === tag.name ? "active" : ""}`}
                                        onClick={() => {
                                            this.onTagClick(tag.name);
                                            this.child.current?.resetCurrentPage();
                                            this.child.current?.SetLoading(true);
                                        }} >{tag.name}</li>
                                )}
                            </ul>
                        </div>
                    </div>

                    <div className="row portfolio__gallery">
                        {this.state.projects && (
                            <Pagination projectsProps={this.state.projects} ref={this.child} />
                        )}

                    </div>
                </div>
            </section>
        );
    }
}
export default withRouter(Portfolio) 