import { Component } from "react";
import "./Highlight.scss";
import 'react-multi-carousel/lib/styles.css';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'bootstrap/dist/css/bootstrap.css';
import ImageGallery from 'react-image-gallery';
import "react-image-gallery/styles/css/image-gallery.css";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { db } from "../../config/firebase";
import Modal from "../Modal/Modal";
import AppContext from "../AppContext";
import NoImage from '../../images/no-image.png';

const storage = getStorage();

class Highlight extends Component {
  static contextType = AppContext;
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      currentProject: "",
      projectswithTag: [],
      projects: [],
      tags: [],
      projectImage: "",
      value: 0,
      isModalOpen: false,
      projectsCover: [{
        original: require("../../images/grey.png"),
        thumbnail: require("../../images/grey.png"),
      },
      {
        original: require("../../images/grey.png"),
        thumbnail: require("../../images/grey.png"),
      }]
    };
  }


  componentDidMount() {
    this.getProjects();
  }


  getProjects = async () => {
    const projects = await firebase.firestore().collection('projects').where("spotlight", "==", true).get();
    const projectList = projects.docs.map(doc => doc.data());
    this.setState({ projectsCover: [] })
    projectList.forEach(project => {
      getDownloadURL(ref(storage, `${project.name}.jpg`))
        .then((data) => {
          var joined = this.state.projectsCover.concat(
            { original: data, thumbnail: data, originalAlt: project.name }
          );
          this.setState({ projectsCover: joined })
        }).catch(err => {
          var joined = this.state.projectsCover.concat(
            { original: NoImage, thumbnail: NoImage, originalAlt: project.name }
          );
          this.setState({ projectsCover: joined })
          console.log(err)
        });
    });
    this.setState({ projects: projectList });
  }


  showModal = (e) => {
    let selectedProject = {};
    selectedProject = this.getSelectedProject(e.target.alt);
    this.setShow(selectedProject);
  }
  setShow = (currentProject) => {
    this.setState({ isModalOpen: true });
    this.setState({ currentProject });
  };
  closeModal = () => {
    this.setState({ isModalOpen: false });
  }

  getSelectedProject = (projectName) => {
    let pp = {};
    this.state.projects.forEach(p => {
      if (p.name === projectName) {
        pp = p;
        return;
      }
    })
    return pp;
  }


  render() {
    const { setIsModal } = this.context
    return (

      <div className="container">
        <div className=" d-flex justify-content-center">
          <header>
            <h2 className="prototype white">Career Highlight</h2>
            <p className="montserrat custom-grey">
              These are some of the biggest projects I worked on.
            </p>
          </header>
        </div>

        <div
          className="container-fluid slider"
        >
          <ImageGallery items={this.state.projectsCover}
            thumbnailPosition="bottom"
            showFullscreenButton={false}
            showPlayButton={false}
            showBullets={true}
            lazyLoad={true}
            onClick={(e) => { this.showModal(e); setIsModal(true); }}
          />
        </div>
        <div className="row d-flex justify-content-center">
          {this.state.isModalOpen &&
            <Modal project={this.state.currentProject} closeModal={() => this.closeModal()} />
          }
        </div>


      </div>
    );
  }
}
export default Highlight;
