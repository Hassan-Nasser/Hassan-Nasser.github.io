
import React from "react";

class PageIndicatorButton extends React.Component {
    goToPage = () => {
      this.props.goToPage(this.props.pageIndex);
    }
    
    render() {
      let indicatorStyle = {
        height: '12px',
        width: this.props.active ? '26px' : '12px',
        margin: '10px',
        borderRadius: '10px',
        backgroundColor: 'white',
        transition: 'width 500ms ease'
      };
      
      return(
        <div style={indicatorStyle} onClick={this.goToPage}>
        </div>
      );
    }
  }
  
  export default PageIndicatorButton;