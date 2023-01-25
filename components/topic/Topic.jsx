import React, { useState } from "react";
import {
  followTopic,
  isUserFollowngTopic,
  unfollowTopic,
} from "../../_TEST_DATA";
import classes from "./Topic.module.scss";

const Topic = function (props) {
  const [isRemoving, setIsRemoving] = useState(false);
  const [topicUid, setTopicUid] = useState(props.uid);
  const [isFollowing, setIsFollowing] = useState(isUserFollowngTopic(topicUid));

  const handleTopicSubscription = () => {
    if (isFollowing) {
      // If a click event happens and isFollowing === true, then unfollow and setIsFollowing to false
      unfollowTopic(topicUid);
      setIsFollowing(false);
    } else {
      // Else If a click event happens and isFollowing === false, then follow and setIsFollowing to true
      setIsFollowing(true);
      followTopic(topicUid);
    }
    // [ ] Remove topic item from db (users.topics).
    // [ ] Update view accordingly.
  };

  const showRemove = () => {
    setIsRemoving(true);
  };
  const cancelRemove = () => {
    // Makes sure state is only set if mouse left while remove overlay is on.
    if (!isRemoving) return;
    setIsRemoving(false);
  };
  return (
    <div
      onClick={showRemove}
      onMouseLeave={cancelRemove}
      className={`${classes.topic} ${props.className || ""}`}
    >
      {isRemoving && (
        <div
          className={`${classes.unfollow} ${props.className || ""}`}
          onClick={handleTopicSubscription}
        >
          {isFollowing && "unfollow"}
          {!isFollowing && "follow"}
        </div>
      )}
      #{props.text}
    </div>
  );
};

export default Topic;
