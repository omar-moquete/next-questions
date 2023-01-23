import React, { useEffect, useState } from "react";
import {
  getListOfQuestionsWithListOfTopics,
  getLoggedInUserTopics,
  getQuestionsWithTopicName,
  getQuestionsWithTopicUid,
  getUserImageUrlWithUsername,
  questions,
  QUESTIONS_TEST_DATA,
  USER_QUESTION_TEST_DATA,
} from "../../_TEST_DATA";
import QuestionItem from "../question-item/QuestionItem";
import classes from "./Feed.module.scss";
import SearchIcon from "../UI/svg/SearchIcon";
import HashIcon from "../UI/svg/HashIcon";
import FeedControlBar from "./feed-control-bar/FeedControlBar";
import { useDispatch, useSelector } from "react-redux";
import { globalActions } from "../../redux-store/globalSlice";
import QuestionIcon from "../UI/svg/QuestionIcon";
import FeedInfo from "./feed-info/FeedInfo";
import MyFeedInfo from "./my-feed-info/MyFeedInfo";

const Feed = function (props) {
  const dispatch = useDispatch();
  const selectedTopicUid = useSelector(
    (state) => state.global.selectedTopicUid
  );
  // Current feed is a list of questions
  const [currentFeed, setCurrentFeed] = useState(
    getListOfQuestionsWithListOfTopics(getLoggedInUserTopics())
  ); // initially MY_FEED will be selected

  // A topic is selected when a topic is clicked from the dropdown
  useEffect(() => {
    // NOTE: If selectedTopicUid === null means that my feed is active.
    if (selectedTopicUid === null) {
      // [ ] Find all questions with all fav topics and setCurrentFeed to it
      // [ ]TODO: fix topic search algorithm to "startswith instead of "contains""
      const topicsList = getLoggedInUserTopics();
      const myFeed = getListOfQuestionsWithListOfTopics(topicsList);
      setCurrentFeed(myFeed);
    } else {
      // NOTE: if this block executes is because there was a topic previously selected since it's the only way to update selectedTopicUid to a truthy value, therefore we can conclude that there must be a selected topic.

      // [ ] Find all questions in db that include the topic uid and setCurrentFeed
      const feed = getQuestionsWithTopicUid(selectedTopicUid);
      setCurrentFeed(feed);
    }
  }, [selectedTopicUid]);

  return (
    // [x] Create "currently viewing" element
    <div className={classes.feed}>
      <FeedControlBar />

      {/* <FeedInfo/> outputs information about the currently selected topic */}
      {/* <MyFeeedInfo/> outputs the questions that belong to the user topics */}
      {selectedTopicUid ? (
        <FeedInfo topicUid={selectedTopicUid} />
      ) : (
        <MyFeedInfo />
      )}

      <ul className={classes.questions}>
        {currentFeed.map((questionItem) => (
          <QuestionItem
            key={questionItem.uid}
            className={classes["question-item"]}
            username={questionItem.askedBy}
            imageUrl={getUserImageUrlWithUsername(questionItem.askedBy)}
            question={questionItem}
          />
        ))}
      </ul>
    </div>
  );
};

export default Feed;

// feed / feedControlBar / topicsResults
// ---- sends topics results ->
// ----      ---------    sets selected topic to state

// TO GET MY FEED: db --> users.favoriteTopics <--from, get--> questions with those favoriteTopics
// TO GET OTHER FEEDS: selected topic <---find in db, then get questions with the selected topic

// state: currentTopic, currentFeedData <--- where data is pushed from favtopic questions or currentTopicQuestions
// currentTopic is a topic if no topic selected, show myfeed

// a topic looks like: {uid, text, description, questionsAsked}
