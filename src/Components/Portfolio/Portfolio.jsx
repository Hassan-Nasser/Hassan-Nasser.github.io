import React, { Component } from "react";
import "./Portfolio.scss";
import { db } from "../../config/firebase";
import firebase from 'firebase/compat/app';
import { collection, getDoc, getDocs, query, where } from "firebase/firestore";
import { Pagination } from "../Pagination/Pagination";
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import { withRouter } from "../../config/withRouter";

const tagsJson = {
    "Multiplayer": { index: 0, id: "1" },
    "Metaverse": { index: 1, id: "2" },
    "Blockchain": { index: 2, id: "3" },
    "Turn_Based": { index: 3, id: "4" },
    "Shopping": { index: 4, id: "5" },
    "Collectible_Cards": { index: 5, id: "6" },
    "Casual": { index: 6, id: "7" },
    "VR": { index: 7, id: "8" },
    "AR": { index: 8, id: "9" },
    "Mobile": { index: 9, id: "a10" },
    "Software": { index: 10, id: "a11" },
}
class Portfolio extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tags: [],
            projects: [],
            selected: -1,
        };
        this.child = React.createRef();
    }


    componentDidMount() {
        this.getAllTags();
        const tagName = window.location.hash.split('=')[1] || "All";
        console.log("tagname = ",tagName);
        if (tagName === "All") {
            this.getAllProject();
            return;
        }
        this.getProjectWithTag(tagsJson[tagName].id)
        this.setState({ selected: tagsJson[tagName].index })

    }

    getAllTags = async () => {
        const tagDocs = collection(db, "tags");
        const tags = await getDocs(tagDocs);
        const tagList = await Promise.all(tags.docs.map(doc => {
            const tag = {};
            tag.name = doc.data().name;
            tag.id = doc.id
            return tag;
        }))
        this.setState({ tags: tagList });
    }

    getAllProject = async () => {
        const projectDocs = collection(db, "projects");
        const projects = await getDocs(projectDocs);
        const projectList = await Promise.all(projects.docs.map(async (doc) => {
            const project = doc.data();
            project.profile = await getDownloadURL(ref(getStorage(), `${doc.data().name}.jpg`));
            project.tags = await Promise.all(doc.data().tags.map(async (tag) => await (await getDoc(tag)).data()));
            return project;
        }))
        this.setState({ projects: projectList });
        this.child.current.SetLoading(false);
    }
    getProjectWithTag = async (tagId) => {
        const tagRef = firebase.firestore().collection('tags').doc(tagId);
        const projectDocs = query(collection(db, "projects"), where("tags", "array-contains", tagRef));
        const allDocs = await getDocs(projectDocs);
        const projectList = await Promise.all(allDocs.docs.map(async (doc) => {
            const project = doc.data();
            project.profile = await getDownloadURL(ref(getStorage(), `${doc.data().name}.jpg`));
            project.tags = await Promise.all(doc.data().tags.map(async (tag) => await (await getDoc(tag)).data()));
            return project;
        }))
        this.child.current.SetLoading(false);
        this.setState({ projects: projectList });
    }
    onTagClick = (tag, index) => {

        this.setState({ selected: index });
        if (index == -1) {
            this.props.navigate(`/portfolio?tag=All`)
            this.getAllProject();
            return
        }
        const [key, value] = Object.entries(tagsJson).find(([key, value]) => value.index == index) || [];
        console.log(key, value); // Output: "key2" "value2"
        this.props.navigate(`/portfolio?tag=${key}`)
        this.getProjectWithTag(tag.id)
    }

    render() {
        return (
            <section className="portfolio spad">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <ul className="portfolio__filter">
                                <li
                                    className={`TechnaSans ${this.state.selected === -1 ? "active" : ""}`}
                                    onClick={() => {
                                        this.onTagClick({}, -1);
                                        this.child.current?.resetCurrentPage();
                                        this.child.current.SetLoading(true);
                                    }}>All</li>
                                {this.state.tags && this.state.tags.map((tag, index) =>
                                    <li key={index}
                                        className={`TechnaSans ${this.state.selected === index ? "active" : ""}`}
                                        onClick={() => {
                                            this.onTagClick(tag, index);
                                            this.child.current?.resetCurrentPage();
                                            this.child.current.SetLoading(true);
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