
import React from "react";


export default function Page(props) {
    let {style, children, ...otherProps} = {...props};
    let {height, width, ...cleanedStyle} = {...style};
    
    let pageStyle = {
      height: '100%',
      width: '100%',
      ...cleanedStyle
    }
    return(
      <div style={pageStyle} {...otherProps}>
        {children}
      </div>
    );
  }
  