import React, { useState } from "react";
import classes from "./MyFeedInfo.module.scss";
import HashIcon from "../UI/svg/HashIcon";
import Topic from "../topic/Topic";
import { MAX_DISPLAYED_TOPICS_IN_MY_TOPIC_INFO } from "../../app-config";
import InlineSpinner from "../UI/inline-spinner/InlineSpinner";

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
            <p className={classes.total}>{userTopics?.length || "..."}</p>
          </div>
        </div>
      </div>

      {userTopics === null && (
        <div className={classes.initialSpinner}>
          <InlineSpinner height={32} color="#fff" />
        </div>
      )}
      {userTopics !== null && (
        <>
          <div className={`${classes.topics}`}>
            {userTopics.length === 0 && (
              <div className={classes.nothing}>
                <h2>No topics</h2>
                <p>To follow a topic just tap on the topic of any question.</p>
              </div>
            )}

            {userTopics.length > 0 && (
              <div
                className={`${classes.topicsContainer} ${
                  topicWrapperClass || ""
                }`}
              >
                <ul>
                  <>
                    {showMoreTopics &&
                      userTopics.map((topic) => {
                        return (
                          <li
                            key={topic.uid}
                            className={classes["topic-wrapper"]}
                          >
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
                      userTopics
                        .slice(0, MAX_DISPLAYED_TOPICS_IN_MY_TOPIC_INFO)
                        .map((topic) => {
                          return (
                            <li
                              key={topic.uid}
                              className={classes["topic-wrapper"]}
                            >
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

                {userTopics.length > MAX_DISPLAYED_TOPICS_IN_MY_TOPIC_INFO && (
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
        </>
      )}
    </div>
  );
};

export default MyFeedInfo;
