import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MAX_FOLLOWED_TOPICS } from "../../app-config";
import {
  followTopic,
  getUserFollowedTopics,
  isUserFollowngTopic,
  unfollowTopic,
} from "../../db";
import { globalActions } from "../../redux-store/globalSlice";
import InlineSpinner from "../UI/inline-spinner/InlineSpinner";
import Modal1 from "../UI/modals/Modal1";
import Portal from "../UI/Portal";
import classes from "./Topic.module.scss";

const Topic = function ({ topicUid, className, title, userTopicsState }) {
  const user = useSelector((slices) => slices.auth.user);
  const [isRemoving, setIsRemoving] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const [timeoutId, setTimeoutId] = useState();
  const [intervalId, setIntervalId] = useState();
  const [countdown, setCountdown] = useState(5);
  const [showCountdown, setShowCountdown] = useState(false);
  const [showModal, setShowModal] = useState(false);
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
    if (!user) {
      router.push("/login");
      return;
    }

    if (isFollowing) {
      // If a click event happens and isFollowing === true, then unfollow and setIsFollowing to false
      setLoading(true);
      if (userTopicsState) {
        // This condition controls the inmidiate removal of the topic from my-feed if the topic is removed. This allows the topic to be removed from the UI right away without waiting for the backend to remove the post.

        // This is achieved by passing the topicsState from which a list of topics is rendered and passing this state to each topic in that list. When the topic is removed, the state can be set.

        // If the topic component is not being used as intended in my feed, this condition will not pass, preventing further errors. (Only if the state is passed down to topic.)

        // Timeout allows for topicState to be set when the timeout calls its callback function. In the meantime this 5 seconds timeout runs, the interval will control the output of a counter in the topic button.
        const intervalId = setInterval(() => {
          setCountdown((prev) => prev - 1);
        }, 1000);
        const timeoutId = setTimeout(() => {
          const [userTopics, setUserTopics] = userTopicsState;
          const excludedSelf = userTopics.filter(
            (topic) => topic.uid !== topicUid
          );
          setUserTopics(excludedSelf);
          dispatch(globalActions.removeCurrentFollowedTopic(topicUid));
        }, 5000);

        setTimeoutId(timeoutId);
        setIntervalId(intervalId);
        setShowCountdown(true);
      }
      await unfollowTopic(topicUid);
      !userTopicsState &&
        dispatch(globalActions.removeCurrentFollowedTopic(topicUid));
      setIsFollowing(false);
      setLoading(false);
    } else {
      // Else If a click event happens and isFollowing === false, then follow and setIsFollowing to true

      setLoading(true);
      if (
        (await getUserFollowedTopics(user.userId)).length >= MAX_FOLLOWED_TOPICS
      ) {
        console.error(
          `Max followed topics reached (limit: ${MAX_FOLLOWED_TOPICS}).`
        );
        setShowModal(true);
        setLoading(false);
        return;
      }
      if (intervalId) {
        timeoutId && clearTimeout(timeoutId);
        intervalId && clearInterval(intervalId);
        setCountdown(5);
        setShowCountdown(false);
      }

      await followTopic(topicUid);
      dispatch(globalActions.setCurrentFollowedTopic(topicUid));
      setIsFollowing(true);
      setLoading(false);
    }
  };

  const showRemove = () => {
    setIsRemoving(true);
  };
  const cancelRemove = () => {
    // Makes sure state is only set if mouse left while remove overlay is on.
    if (!isRemoving) return;
    setIsRemoving(false);
  };

  const closeModal = () => {
    setShowModal(false);
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
          {isFollowing && !loading && !showCountdown && "unfollow"}
          {!isFollowing && !loading && !showCountdown && "follow"}
          {showCountdown && !loading && countdown}
        </div>
      )}
      #{title}
      <Portal show={showModal}>
        <Modal1
          title="Max followed topics reached."
          paragraphs={[
            `You have reached the limit of ${MAX_FOLLOWED_TOPICS} followed topics.`,
          ]}
          buttons={[{ text: "Close", onClick: closeModal }]}
        />
      </Portal>
    </div>
  );
};

export default Topic;
