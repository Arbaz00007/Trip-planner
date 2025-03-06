import React from 'react'
import PropTypes from "prop-types";

export default function HomeImgDivs(props) {
  // let mar = props.ani;
  return (
    <div className={props.class}
    >
      <div className="image-overlay">
        <h1>{props.heading}</h1>
      </div>
    </div>
  )
}

HomeImgDivs.propType = {
  class: PropTypes.string,
  heading: PropTypes.string,
  ani: PropTypes.number
};