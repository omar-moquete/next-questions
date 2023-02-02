import React, { useState } from "react";
import classes from "./MyFeedInfo.module.scss";
import QuestionIcon from "../../UI/svg/QuestionIcon";
import HashIcon from "../../UI/svg/HashIcon";
import {
  getListOfQuestionsWithListOfTopics,
  getLoggedInUserTopics,
  getTopicInfoWithTopicUid,
  getUserAnsweredQuestions,
  getUserAnsweredQuestionsWithListOfTopics,
  isUserFollowngTopic,
} from "../../../_TEST_DATA";
import Topic from "../../topic/Topic";

const MyFeedInfo = function () {
  // Total amount of topics saved
  const [userTopics, setUserTopics] = useState(getLoggedInUserTopics());

  const moreHandler = () => {
    // [ ]Todo: Show all favorite topics on click
  };

  return (
    <div className={classes.main}>
      <div className={classes.info}>
        <h3>My feed </h3>
        <div className={classes.stats}>
          <div className={classes.stat}>
            <HashIcon />
            <p className={classes.total}>{userTopics.length}</p>
          </div>
          {/* Can add more stats here */}
        </div>
      </div>

      <div className={`${classes.topics} ${classes.small}`}>
        {/* [ ]TODO: Limit results */}
        {/* [ ]TODO: Make sure component updates when topic is removed */}

        {userTopics.map((topic) => {
          const topicInfo = getTopicInfoWithTopicUid(topic.uid);

          return (
            <div key={topicInfo.uid} className={classes["topic-wrapper"]}>
              <Topic
                className={classes.topic}
                uid={topicInfo.uid}
                title={topicInfo.title}
              />
            </div>
          );
        })}
      </div>
      <label className={classes.more} onClick={moreHandler}>
        See all
      </label>
    </div>
  );
};

export default MyFeedInfo;
