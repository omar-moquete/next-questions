import React from "react";
import classes from "./FeedInfo.module.scss";
import QuestionIcon from "../../UI/svg/QuestionIcon";

import Link from "next/link";
import { DELETED_USER_USERNAME } from "../../../app-config";

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
      <span className={classes.author}>
        <em>
          Created by:{" "}
          {topicInfo.author === DELETED_USER_USERNAME ? (
            DELETED_USER_USERNAME
          ) : (
            <Link href={`/${topicInfo.author}`}>{topicInfo.author}</Link>
          )}
        </em>
      </span>
    </div>
  );
};

export default FeedInfo;
