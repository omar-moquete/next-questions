import React, { useState } from "react";
import classes from "./MyFeedInfo.module.scss";
import HashIcon from "../UI/svg/HashIcon";
import Topic from "../topic/Topic";

const MyFeedInfo = function ({
  userTopicsState,
  className,
  topicWrapperClass,
  moreWrapperClass,
}) {
  const [userTopics] = userTopicsState;
  const [showMoreTopics, setShowMoreTopics] = useState(false);

  const moreHandler = () => {
    setShowMoreTopics((prev) => !prev);
  };

  return (
    <div className={`${classes.main} ${className || ""}`}>
      <div className={classes.info}>
        <h3>My feed </h3>
        <div className={classes.stats}>
          <div className={classes.stat}>
            <HashIcon />
            <p className={classes.total}>{userTopics.length}</p>
          </div>
        </div>
      </div>

      <div className={`${classes.topics}`}>
        {/* [ ]TODO: Limit results */}
        {/* [ ]TODO: Make sure component updates when topic is removed */}
        {userTopics.length === 0 && (
          <div className={classes.nothing}>
            <h2>No topics</h2>
            <p>To follow a topic just tap on the topic of any question.</p>
          </div>
        )}

        {userTopics.length > 0 && (
          <div
            className={`${classes.topicsContainer} ${topicWrapperClass || ""}`}
          >
            <ul>
              <>
                {showMoreTopics &&
                  userTopics.map((topic) => {
                    return (
                      <li key={topic.uid} className={classes["topic-wrapper"]}>
                        <Topic
                          className={classes.topic}
                          topicUid={topic.uid}
                          title={topic.title}
                          userTopicsState={userTopicsState}
                        />
                      </li>
                    );
                  })}

                {!showMoreTopics &&
                  userTopics.slice(0, 2).map((topic) => {
                    return (
                      <li key={topic.uid} className={classes["topic-wrapper"]}>
                        <Topic
                          className={classes.topic}
                          topicUid={topic.uid}
                          title={topic.title}
                          userTopicsState={userTopicsState}
                        />
                      </li>
                    );
                  })}
              </>
            </ul>

            {userTopics.length > 2 && (
              <label
                className={`${classes.more} ${moreWrapperClass || ""}`}
                onClick={moreHandler}
              >
                {showMoreTopics ? "Show less" : "Show more"}
              </label>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyFeedInfo;
