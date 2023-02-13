import React, { useState } from "react";
import classes from "./MyFeedInfo.module.scss";
import HashIcon from "../../UI/svg/HashIcon";
import Topic from "../../topic/Topic";

const MyFeedInfo = function ({ userTopics }) {
  // Total amount of topics saved

  const moreHandler = () => {
    // [ ]Todo: Show all favorite topics on click
  };

  if (!userTopics) return null;
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

        {userTopics.length === 0 && (
          <div className={classes.nothing}>
            <h2>No topics</h2>
            <p>To follow a topic just tap on the topic of any question.</p>
          </div>
        )}
        {userTopics.length !== 0 &&
          userTopics.map((topic) => (
            <div key={topic.uid} className={classes["topic-wrapper"]}>
              <Topic
                className={classes.topic}
                uid={topic.uid}
                title={topic.title}
              />
            </div>
          ))}
      </div>
      {userTopics.length > 0 && (
        <label className={classes.more} onClick={moreHandler}>
          See all
        </label>
      )}
    </div>
  );
};

export default MyFeedInfo;
