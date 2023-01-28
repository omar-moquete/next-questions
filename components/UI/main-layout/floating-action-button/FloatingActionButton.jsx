import React from "react";
import classes from "./FloatingActionButton.module.scss";
import QuestionIcon from "../../svg/QuestionIcon";

const FloatingActionButton = function (props) {
  return (
    <div className={classes.fab}>
      <div className={classes.filter}>
        <QuestionIcon />
      </div>
      <span>New question</span>
    </div>
  );
};

export default FloatingActionButton;
