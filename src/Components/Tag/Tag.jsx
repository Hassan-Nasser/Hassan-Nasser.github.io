import React, { useEffect, useState } from "react";
import "./Tag.scss";
import 'bootstrap/dist/css/bootstrap.min.css';
import { db } from "../../config/firebase";
import { getDoc } from "firebase/firestore";

export function Tag(props) {
    const [tags, setTags] = useState([]);
    useEffect(() => {
        getTags()

    }, []);
    const getTags = async () => {
        let projectTags = await Promise.all(props.tags.map(async (tag) => await (await getDoc(tag)).data()))
        setTags(projectTags);
    }

    return (
        <>
            {tags && tags.map((tag, index) => <li key={index}>{tag.name}</li>)}
        </>


    );
}