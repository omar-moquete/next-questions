import React from "react";
import classes from "./FeedInfo.module.scss";
import QuestionIcon from "../../UI/svg/QuestionIcon";

const FeedInfo = function () {
  return (
    <div className={classes.info}>
      <h3>#DominicanRepublic</h3>
      <p>
        Description Lorem ipsum dolor sit amet, consectetur adipisicing elit.
        Soluta, aliquam et adipisci fugit molestias architecto fuga? Dolores
        sapiente minima debitis aliquid quia modi laboriosam.
      </p>
      <div className={classes.questions}>
        <QuestionIcon />
        <p className={classes.total}>23</p>
      </div>
    </div>
  );
};

export default FeedInfo;
