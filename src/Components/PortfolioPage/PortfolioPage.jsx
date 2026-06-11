import React, { Component } from "react";
import "./PortfolioPage.scss";
import Portfolio from "../Portfolio/Portfolio";
import { sortedAllProjects } from "../Portfolio/utils/projectSorting";
import "../Portfolio/Portfolio.scss";
import { Home } from "../Home/Home";
import { withRouter } from "../../config/withRouter";

class PortfolioPage extends Component {
    render() {
        return (
            <>
                <Home />
                <Portfolio projectsData={sortedAllProjects} hideSeeMore={true} />
            </>
        );
    }
}
export default withRouter(PortfolioPage) 