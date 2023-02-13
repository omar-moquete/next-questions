import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { isUserFollowngTopic } from "../../db";
import { followTopic, unfollowTopic } from "../../_TEST_DATA";
import classes from "./Topic.module.scss";

const Topic = function ({ topicUid, className, title }) {
  const user = useSelector((slices) => slices.auth.user);
  const [isRemoving, setIsRemoving] = useState(false);
  const [isFollowing, setIsFollowing] = useState();
  const router = useRouter();

  useEffect(() => {
    if (!user) return;
    (async () => {
      isUserFollowngTopic(topicUid);
    })();
  }, [user]);

  const handleTopicSubscription = async () => {
    if (!user) router.push("/login");

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
      className={`${className || ""} ${classes.topic}`}
    >
      {isRemoving && (
        <div
          className={`${classes.unfollow} ${className || ""}`}
          onClick={handleTopicSubscription}
        >
          {isFollowing && "unfollow"}
          {!isFollowing && "follow"}
        </div>
      )}
      #{title}
    </div>
  );
};

export default Topic;
