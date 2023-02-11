import React, { useEffect, useState } from "react";
import classes from "./FeedInfo.module.scss";
import QuestionIcon from "../../UI/svg/QuestionIcon";

import Link from "next/link";

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
      <Link href={`/${topicInfo.author}`} className={classes.author}>
        created by: <span>{topicInfo.author}</span>
      </Link>
    </div>
  );
};

export default FeedInfo;
