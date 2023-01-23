import React, { useEffect, useState } from "react";
import classes from "./FeedInfo.module.scss";
import QuestionIcon from "../../UI/svg/QuestionIcon";
import { getTopicInfoWithTopicUid } from "../../../_TEST_DATA";

const FeedInfo = function ({ topicUid }) {
  // Get the info about the currently selected topic
  const [topicInfo, setTopicInfo] = useState(
    getTopicInfoWithTopicUid(topicUid)
  );

  useEffect(() => {
    // If topicUid is updated, update info. This is neccessary because when the user searches again for another topic without leaving the page, the current page must be updated to the new selected information.
    setTopicInfo(getTopicInfoWithTopicUid(topicUid));
  }, [topicUid]);

  return (
    <div className={classes.main}>
      <div className={classes.info}>
        <h3>#{topicInfo.text}</h3>
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
