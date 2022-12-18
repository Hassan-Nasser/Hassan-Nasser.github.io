import { useEffect, useState, useContext } from "react";
import Tag from "../Tag/Tag";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { db } from "../../config/firebase";
import "./Project.scss";
import AppContext from "../AppContext";
import NoImage from '../../images/no-image.png';

const storage = getStorage();

const Project = ({ project, showModal, tagsExist, headerPosition }) => {
    const [projectImage, setProjectImage] = useState(null);
    const { setIsModal } = useContext(AppContext);
    useEffect(() => {
        let isMounted = true;
        getDownloadURL(ref(storage, `${project.name}.jpg`))
            .then((data) => {
                if (isMounted)
                    setProjectImage(data);
            }).catch((err) => {
                console.log("err", err);
                setProjectImage(NoImage);
            });
        return () => { isMounted = false };
    }, [project]);

    return (<article className="pbox style2" style={{ width: "100%", cursor: "pointer", height: "20em" }}>
        <button
            className="transparent image featured"
            onClick={() => {
                setIsModal(true);
                showModal();
            }
            }
        >
            {projectImage
                ? <img className="project-image" src={projectImage} alt={project.name} />
                : <img className="project-image" src={require("../../images/grey.png")} alt={project.name} />}

            {tagsExist && (
                <Tag isModal={false} className="tag tag-position" tags={project.tags} />
            )}
            <div className={headerPosition}>
                <span className="project-name prototype bold">{project.name}</span>
            </div>

        </button>
    </article>)
}

export default Project;