import React from "react";
import classes from "./Tooltip1.module.scss";

const Tooltip1 = function ({ text, onClose }) {
  return (
    <div className={classes.tooltip} onMouseEnter={onClose}>
      <div onClick={onClose}>✖</div>
      <p>{text}</p>
    </div>
  );
};

export default Tooltip1;
