import React, { useEffect, useState } from "react";
import QuestionItem from "../question-item/QuestionItem";
import classes from "./Feed.module.scss";
import FeedControlBar from "./feed-control-bar/FeedControlBar";
import { useDispatch, useSelector } from "react-redux";
import InlineSpinner from "../UI/inline-spinner/InlineSpinner";
import FeedInfo from "./feed-info/FeedInfo";
import MyFeedInfo from "./my-feed-info/MyFeedInfo";
import { useRouter } from "next/router";
import {
  getAllQuestions,
  getQuestionsWithSearchParam,
  getQuestionsWithTopicUid,
  getQuestionsWithTopicUids,
  getTopicInfoWithTopicUid,
  getUserFollowedTopics,
} from "../../db";
import SearchFeedInfo from "./search-feed-info/SearchFeedInfo";

const Feed = function () {
  const selectedTopicUid = useSelector(
    (state) => state.global.selectedTopicUid
  );
  const [selectedTopicInfo, setSelectedTopicInfo] = useState(null);
  const searchParam = useSelector((slices) => slices.global.searchParam);

  const [currentFeed, setCurrentFeed] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // When searchParam changes
  useEffect(() => {
    (async () => {
      if (!searchParam) return;
      setLoading(true);
      const results = await getQuestionsWithSearchParam(searchParam);
      setSelectedTopicInfo(null);
      setCurrentFeed(results);
      setLoading(false);
    })();
  }, [searchParam]);

  // When topic selection changes
  useEffect(() => {
    if (searchParam) return;
    if (!selectedTopicUid) return;
    setLoading(true);
    (async () => {
      const feed = await getQuestionsWithTopicUid(selectedTopicUid);
      const topicInfo = await getTopicInfoWithTopicUid(selectedTopicUid);
      setSelectedTopicInfo(topicInfo);
      setCurrentFeed(feed);
      setLoading(false);
    })();
  }, [selectedTopicUid]);

  // No user logged in
  // useEffect(() => {
  //   if (searchParam) return;
  //   if (authStatus !== authStatusNames.notLoaded) return;
  //   setLoading(true);
  //   (async () => {
  //     const allQuestions = await getAllQuestions();
  //     setCurrentFeed(allQuestions);
  //     setLoading(false);
  //   })();
  // }, [authStatus, searchParam]);

  // MyFeed
  // useEffect(() => {
  //   if (!user) return;

  //   setLoading(true);
  //   (async () => {
  //     const userFollowedTopics = await getUserFollowedTopics(user.userId);
  //     setUserTopics(userFollowedTopics);
  //     const userTopics = userFollowedTopics.map(
  //       (userFollowedTopic) => userFollowedTopic.uid
  //     );

  //     const myFeed = await getQuestionsWithTopicUids(userTopics);
  //     setCurrentFeed(myFeed);
  //     setLoading(false);

  //     return;
  //   })();
  // }, [user, selectedTopicUid, searchParam]);

  return (
    <div className={classes.feed}>
      <FeedControlBar />
      {loading && <InlineSpinner className={classes.spinner} color="#fff" />}

      {selectedTopicUid && selectedTopicInfo && !loading && currentFeed && (
        <FeedInfo topicInfo={selectedTopicInfo} />
      )}

      {!loading && searchParam && currentFeed && (
        <SearchFeedInfo results={currentFeed} />
      )}

      {!currentFeed && (
        <div className={classes.nothing}>
          <div className={classes.title}>
            <h3>Find questions</h3>
          </div>

          <p>Start by searching for a question or a topic.</p>
        </div>
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
