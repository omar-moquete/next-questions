import React, { useEffect, useState } from "react";
import QuestionItem from "../question-item/QuestionItem";
import classes from "./Feed.module.scss";
import { useSelector } from "react-redux";
import InlineSpinner from "../UI/inline-spinner/InlineSpinner";
import FeedInfo from "./feed-info/FeedInfo";
import { useRouter } from "next/router";
import {
  getQuestionsWithSearchParam,
  getQuestionsWithTopicUid,
  getTopicInfoWithTopicUid,
} from "../../db";
import SearchFeedInfo from "./search-feed-info/SearchFeedInfo";
import FeedControlBar from "../feed-control-bar/FeedControlBar";

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

      {!loading && !currentFeed && !searchParam && (
        <div className={classes.nothing}>
          <div className={classes.title}>
            <h3>Find questions</h3>
          </div>
          <p>Start by searching for a question or a topic.</p>
        </div>
      )}

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
