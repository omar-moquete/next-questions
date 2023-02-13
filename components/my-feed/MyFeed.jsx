import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getQuestionsWithTopicUids, getUserFollowedTopics } from "../../db";
import FeedControlBar from "../feed/feed-control-bar/FeedControlBar";
import QuestionItem from "../question-item/QuestionItem";
import InlineSpinner from "../UI/inline-spinner/InlineSpinner";
import MyFeedInfo from "./my-feed-info/MyFeedInfo";
import classes from "./MyFeed.module.scss";

const MyFeed = function () {
  const user = useSelector((slices) => slices.auth.user);
  const router = useRouter();
  const [userTopics, setUserTopics] = useState(); // data for myFeedInfo
  const [myFeed, setMyFeed] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    (async () => {
      const userTopics = await getUserFollowedTopics(user.userId); // good
      setUserTopics(userTopics); // data for myFeedInfo

      const userTopicUids = userTopics.map(
        (userFollowedTopic) => userFollowedTopic.uid
      );

      const myFeed = await getQuestionsWithTopicUids([userTopicUids]);
      setMyFeed(myFeed);
      setLoading(false);
    })();
  }, [user]);
  return (
    <div className={classes.feed}>
      <FeedControlBar />
      {loading && <InlineSpinner className={classes.spinner} color="#fff" />}
      {userTopics && !loading && <MyFeedInfo userTopics={userTopics} />}

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
