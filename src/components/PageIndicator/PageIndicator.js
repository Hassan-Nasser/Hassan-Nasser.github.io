import React from "react";
import PageIndicatorButton from "../PageIndicatorButton/PageIndicatorButton";
import "./PageIndicator.scss";

class PageIndicator extends React.Component {

  renderIndicators = () => {
    let count = this.props.pageCount;
    let indicators = [];

    for (let i = 0; i < count; i++) {
      indicators.push(
        <PageIndicatorButton
          active={i === this.props.activePage}
          pageIndex={i}
          goToPage={this.props.goToPage}
          key={i}
        />
      );
    }
    return indicators;
  }

  render() {
    return (
      <div className="indicator">
        {this.renderIndicators()}
      </div>
    );
  }
}

export default PageIndicator;
