import React, { useEffect, useState } from "react";
import {
  getListOfQuestionsWithListOfTopics,
  getLoggedInUserTopics,
  getQuestionsWithTopicUid,
  getUserImageUrlWithUsername,
} from "../../_TEST_DATA";
import QuestionItem from "../question-item/QuestionItem";
import classes from "./Feed.module.scss";
import FeedControlBar from "./feed-control-bar/FeedControlBar";
import { useSelector } from "react-redux";
import InlineSpinner from "../UI/inline-spinner/InlineSpinner";
import FeedInfo from "./feed-info/FeedInfo";
import MyFeedInfo from "./my-feed-info/MyFeedInfo";
import useDatabase from "../../hooks/useDatabase";
import { useRouter } from "next/router";

const Feed = function () {
  // is null initially
  const selectedTopicUid = useSelector(
    (state) => state.global.selectedTopicUid
  );
  const [selectedTopicInfo, setSelectedTopicInfo] = useState(null);

  const [currentFeed, setCurrentFeed] = useState(null);
  const database = useDatabase();
  const { user, authStatus, authStatusNames } = useSelector(
    (slices) => slices.auth
  );
  const [userTopics, setUserTopics] = useState(null);

  const router = useRouter();
  const [loading, setLoading] = useState(true);

  // Topic selection changes
  useEffect(() => {
    if (!selectedTopicUid) return;
    setLoading(true);
    (async () => {
      const feed = await database.getQuestionsWithTopicUid(selectedTopicUid);
      const topicInfo = await database.getTopicInfoWithTopicUid(
        selectedTopicUid
      );
      setSelectedTopicInfo(topicInfo);
      setCurrentFeed(feed);
      setLoading(false);
    })();
  }, [selectedTopicUid]);

  // No user logged in
  useEffect(() => {
    if (authStatus !== authStatusNames.notLoaded) return;
    setLoading(true);
    (async () => {
      const allQuestions = await database.getAllQuestions();
      setCurrentFeed(allQuestions);
      setLoading(false);
    })();
  }, [authStatus]);

  // MyFeed
  useEffect(() => {
    if (selectedTopicUid !== null) return;
    if (!user) return;
    setLoading(true);
    (async () => {
      const userFollowedTopics = await database.getUserFollowedTopics(
        user.userId
      );
      setUserTopics(userFollowedTopics);
      const userTopics = userFollowedTopics.map(
        (userFollowedTopic) => userFollowedTopic.uid
      );

      const myFeed = await database.getQuestionsWithTopicUids(userTopics);
      setCurrentFeed(myFeed);
      setLoading(false);

      return;
    })();
  }, [user, selectedTopicUid]);

  return (
    <div className={classes.feed}>
      <FeedControlBar />
      {/* <FeedInfo/> outputs information about the currently selected topic */}
      {/* <MyFeeedInfo/> outputs the questions that belong to the user topics */}
      {loading && <InlineSpinner className={classes.spinner} color="#fff" />}

      {!selectedTopicUid && !loading && <MyFeedInfo userTopics={userTopics} />}
      {selectedTopicInfo && selectedTopicUid && !loading && (
        <FeedInfo topicInfo={selectedTopicInfo} />
      )}

      {/* [ ]TODO: Add No questions component */}
      {currentFeed && !loading && (
        <ul className={classes.questions}>
          {currentFeed.map((question) => (
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

export default Feed;
