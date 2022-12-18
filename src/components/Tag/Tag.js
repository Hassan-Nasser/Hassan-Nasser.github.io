
import { Component } from "react";
import "./Tag.scss";
import { getDoc } from "firebase/firestore";

class Tag extends Component {

    constructor(props) {
        super();
        this.state = {
            tags: []
        };
    }
    componentDidMount() {
        this.props.tags.forEach((tag) => {
            this.getTagById(tag);
        })

    }
    getTagById = async (tagDocRef) => {
        const clubSnapshot = await (await getDoc(tagDocRef)).data();
        this.setState({ tags: [...this.state.tags, clubSnapshot] })
    };

    render() {
        return <div className={this.props.isModal ? "tag-container-modal" : "tag-container"}>
            {this.state.tags && this.state.tags.map((tag) =>
                <span key={tag.name} className={"montserrat " + `${this.props.className}`}>{tag.name}</span>
            )}
        </div>;
    }
}

export default Tag;