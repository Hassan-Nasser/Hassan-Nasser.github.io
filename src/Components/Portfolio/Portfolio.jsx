import React, { Component } from "react";
import "./Portfolio.scss";
import Projects, { sortedAllProjects } from "../Projects/Projects";
import "../Projects/Projects.scss";
import { Profile } from "../Profile/Profile";
import { withRouter } from "../../config/withRouter";

class Portfolio extends Component {
    render() {
        return (
            <>
                <Profile />
                <Projects projectsData={sortedAllProjects} hideSeeMore={true} />
            </>
        );
    }
}
export default withRouter(Portfolio) 