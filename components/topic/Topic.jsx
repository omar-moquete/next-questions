import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { followTopic, isUserFollowngTopic, unfollowTopic } from "../../db";
import { globalActions } from "../../redux-store/globalSlice";
import InlineSpinner from "../UI/inline-spinner/InlineSpinner";
import classes from "./Topic.module.scss";

const Topic = function ({ topicUid, className, title }) {
  const user = useSelector((slices) => slices.auth.user);
  const [isRemoving, setIsRemoving] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  // Allows the useEffect to re-run "setIsFollowing" when it changes.
  const currentFollowedTopics = useSelector(
    (slices) => slices.global.questionUI.currentFollowedTopics
  );

  useEffect(() => {
    if (!user) return;
    (async () => {
      const isFollowing = await isUserFollowngTopic(topicUid);
      if (isFollowing)
        dispatch(globalActions.setCurrentFollowedTopic(topicUid));
      setIsFollowing(isFollowing);
    })();
  }, [user, currentFollowedTopics]);

  const handleTopicSubscription = async () => {
    if (!user) router.push("/login");

    if (isFollowing) {
      // If a click event happens and isFollowing === true, then unfollow and setIsFollowing to false
      setLoading(true);
      await unfollowTopic(topicUid);
      dispatch(globalActions.removeCurrentFollowedTopic(topicUid));
      setIsFollowing(false);
      setLoading(false);
    } else {
      // Else If a click event happens and isFollowing === false, then follow and setIsFollowing to true
      setLoading(true);
      await followTopic(topicUid);
      dispatch(globalActions.setCurrentFollowedTopic(topicUid));
      setIsFollowing(true);
      setLoading(false);
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
      className={`${className || ""} ${
        isFollowing ? classes.topicFollowed : classes.topic
      }`}
    >
      {isRemoving && (
        <div
          className={`${
            isFollowing ? classes.unfollowFollowed : classes.unfollow
          } ${className || ""}`}
          onClick={handleTopicSubscription}
        >
          {loading && <InlineSpinner width="24px" height="24px" />}
          {isFollowing && !loading && "unfollow"}
          {!isFollowing && !loading && "follow"}
        </div>
      )}
      #{title}
    </div>
  );
};

export default Topic;
