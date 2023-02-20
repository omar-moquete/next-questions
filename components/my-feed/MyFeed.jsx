import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getQuestionsWithTopicUids, getUserFollowedTopics } from "../../db";
import FeedControlBar from "../feed-control-bar/FeedControlBar";
import MyFeedInfo from "../my-feed-info/MyFeedInfo";
import QuestionItem from "../question-item/QuestionItem";
import InlineSpinner from "../UI/inline-spinner/InlineSpinner";
import classes from "./MyFeed.module.scss";

const MyFeed = function () {
  const user = useSelector((slices) => slices.auth.user);
  const [userTopics, setUserTopics] = useState(); // data for myFeedInfo
  const [myFeed, setMyFeed] = useState();
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const currentFollowedTopics = useSelector(
    (slices) => slices.global.questionUI.currentFollowedTopics
  );

  const loadData = async function () {
    if (!user) return;
    const userTopics = await getUserFollowedTopics(user.userId); // good
    setUserTopics(userTopics); // data for myFeedInfo
    const userTopicUids = userTopics.map(
      (userFollowedTopic) => userFollowedTopic.uid
    );

    const myFeed = await getQuestionsWithTopicUids(userTopicUids);
    const myFeedSorted = myFeed.sort((a, b) => {
      if (+new Date(a.date) <= +new Date(b.date)) return 1;
      else return -1;
    });
    setMyFeed(myFeedSorted);
    loading && setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [user, currentFollowedTopics]);

  const onTopicSelection = (_, topicTitle) => {
    router.push(`/feed?topic=${topicTitle}`);
  };
  return (
    <div className={classes.feed}>
      <FeedControlBar onSelect={onTopicSelection} />
      {loading && <InlineSpinner className={classes.spinner} color="#fff" />}
      {userTopics && !loading && (
        <MyFeedInfo userTopicsState={[userTopics, setUserTopics]} />
      )}

      {myFeed && myFeed.length > 0 && !loading && (
        <ul className={classes.questions}>
          {myFeed.map((question) => (
            <QuestionItem
              key={question.uid}
              className={classes["question-item"]}
              questionData={question}
            />
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyFeed;
