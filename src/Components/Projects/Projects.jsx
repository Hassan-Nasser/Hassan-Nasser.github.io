import { Component, useRef } from "react";
import "./Projects.scss";
import { db } from "../../config/firebase";
import { collection, getDoc, getDocs, query, where } from "firebase/firestore";
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import Masonry from '@mui/lab/Masonry';
import { Link } from 'react-router-dom';
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Modal from "../Modal/Modal";
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

class Projects extends Component {

    constructor(props) {
        super(props);
        this.state = {
            projects: [],
            storage: getStorage(),
            isOpen: false,
            isLoading: true,
            currentProject: {}
        };
    }
    componentDidMount() {
        this.getProjectProfile();
    }

    getProjectProfile = async () => {
        const projectsCol = query(collection(db, 'projects'), where("spotlight", "==", true));
        const allDocs = await getDocs(projectsCol);

        const projects = await Promise.all(
            allDocs.docs.map(async (doc) => {
                let data = doc.data();
                data.profile = await getDownloadURL(ref(getStorage(), `${doc.data().name}.jpg`));
                data.tags = await Promise.all(doc.data().tags.map(async (tag) => await (await getDoc(tag)).data()));
                return data
            })
        );
        const heights = [200, 600, 197, 188, 190, 200, 180];
        const projectWithHeights = projects.map((p, index) => ({ ...p, height: heights[index] }))
        this.setState({ projects: projectWithHeights, isLoading: false });
    }


    render() {

        return (
            <div className="work" id="portfolio">
                <div className=" container">
                    <div className="row">
                        <h3 className="TechnaSans center font-3 white">Stuff I worked on </h3>
                    </div>
                    <div className="work__gallery">
                        <Masonry columns={{ xs: 1, sm: 2, md: 3 }} spacing={2} >
                            {this.state.isLoading ?
                                ([200, 600, 197, 188, 190, 200, 180].map((h, index) =>  (
                                    <div
                                        className="work__item" key={index}
                                        style={{ height: h, padding: 0.5 }}>
                                        <div className="set-bg project-profile">
                                        <Skeleton height={"100%"} width={200} style={{ backgroundColor: '#eaeaea' }} />
                                        </div>
                                    </div>
                                ))
                                )
                                :
                                (<>
                                    {this.state.projects.map((project, index) => (
                                        <div
                                            onClick={() => {
                                                this.setState({ isOpen: true });
                                                this.setState({ currentProject: project });
                                            }}
                                            className="work__item pointer" key={index}
                                            style={{ height: project.height, padding: 0.5 }}>
                                            <div className="set-bg project-profile" style={{ backgroundImage: `url(${project.profile})` }} >
                                                <a className="play-btn" >
                                                    <FontAwesomeIcon icon={faPlay} /></a>
                                                <div className="work__item__hover">
                                                    <h4>{project.name}</h4>
                                                    <ul>
                                                        {project.tags.map((tag, index) =>
                                                            <li className="montserrat" key={index}>{tag.name}</li>
                                                        )}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                    }</>)
                            }


                        </Masonry >
                    </div>

                    <Link className=" primary-btn" to="/portfolio?tag=All">See More Projects </Link>

                    {this.state.isOpen &&
                        <Modal project={this.state.currentProject} isOpen={this.state.isOpen} onClose={() => this.setState({ isOpen: false })} />}

                </div >
                <hr />
            </div>
        )
    }
}
export default Projects;