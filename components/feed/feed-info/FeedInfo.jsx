import React, { useEffect, useState } from "react";
import classes from "./FeedInfo.module.scss";
import QuestionIcon from "../../UI/svg/QuestionIcon";
import useDatabase from "../../../hooks/useDatabase";

const FeedInfo = function ({ topicInfo }) {
  return (
    <div className={classes.main}>
      <div className={classes.info}>
        <h3>#{topicInfo.title}</h3>
        <div className={classes.stats}>
          <div className={classes.stat}>
            <QuestionIcon />
            <p className={classes.total}>{topicInfo.questionsAsked.length}</p>
          </div>
          {/* Can add more stats here */}
        </div>
      </div>

      <p>{topicInfo.description}</p>
      <p className={classes.author}>Created by: {topicInfo.authorUsername}</p>
    </div>
  );
};

export default FeedInfo;
