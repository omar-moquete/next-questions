import React, { useEffect, useState } from "react";
import { questions } from "../../_TEST_DATA";
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
  const FEED_A = [
    {
      id: "1",
      username: "john234",
      image:
        "https://media.istockphoto.com/id/1372641621/photo/portrait-of-a-businessman-on-gray-background.jpg?s=612x612&w=is&k=20&c=I3K5XdgQpzPWui8j9CcvTa3f3gfifxZfetZd-h4a4BM=",
      question: {
        text: "Feed a",
        date: +new Date(),
      },
      link: "https://www.google.com",
    },
  ];
  const MY_FEED = [
    {
      id: "1",
      username: "john234",
      image:
        "https://media.istockphoto.com/id/1372641621/photo/portrait-of-a-businessman-on-gray-background.jpg?s=612x612&w=is&k=20&c=I3K5XdgQpzPWui8j9CcvTa3f3gfifxZfetZd-h4a4BM=",
      question: {
        title: "What feed is this ?",
        text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Obcaecati consequatur provident praesentium quas! Saepe odio aut iste voluptate! Veritatis ipsa quasi rerum, qui rem laborum dolor tempora cum officia quo?",
        date: +new Date(),
      },
      topics: [
        {
          uid: "topicnumber300049",
          text: "cars",
          description: "All about cars",
          questionsAsked: ["questionUid"],
        },
      ],
      link: "https://www.google.com",
    },
    {
      id: "2",
      username: "john234",
      image:
        "https://media.istockphoto.com/id/1372641621/photo/portrait-of-a-businessman-on-gray-background.jpg?s=612x612&w=is&k=20&c=I3K5XdgQpzPWui8j9CcvTa3f3gfifxZfetZd-h4a4BM=",
      question: {
        title: "What feed is this ?",
        text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Obcaecati consequatur provident praesentium quas! Saepe odio aut iste voluptate! Veritatis ipsa quasi rerum, qui rem laborum dolor tempora cum officia quo?",
        date: +new Date(),
      },
      topics: [
        {
          uid: "topicnumber300049",
          text: "cars",
          description: "All about cars",
          questionsAsked: ["questionUid"],
        },
      ],
      link: "https://www.google.com",
    },
    {
      id: "3",
      username: "john234",
      image:
        "https://media.istockphoto.com/id/1372641621/photo/portrait-of-a-businessman-on-gray-background.jpg?s=612x612&w=is&k=20&c=I3K5XdgQpzPWui8j9CcvTa3f3gfifxZfetZd-h4a4BM=",
      question: {
        title: "What feed is this ?",
        text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Obcaecati consequatur provident praesentium quas! Saepe odio aut iste voluptate! Veritatis ipsa quasi rerum, qui rem laborum dolor tempora cum officia quo?",
        date: +new Date(),
      },
      topics: [
        {
          uid: "topicnumber300049",
          text: "cars",
          description: "All about cars",
          questionsAsked: ["questionUid"],
        },
      ],
      link: "https://www.google.com",
    },
  ];

  const dispatch = useDispatch();
  const selectedTopic = useSelector((state) => state.global.selectedTopic);
  const [currentFeed, setCurrentFeed] = useState(MY_FEED); // initially MY_FEED will be selected

  // A topic is selected when a topic is clicked from the dropdown
  useEffect(() => {
    // NOTE: If selectedTopic === null means that my feed is active.
    if (selectedTopic === null) {
      // [ ] Find all questions with all fav topics and setCurrentFeed to it
      setCurrentFeed(MY_FEED);
    } else {
      // NOTE: if this block executes is because there was a topic previously selected since it's the only way to update selectedTopic to a truthy value, therefore we can conclude that there must be a selected topic.

      // [ ] Find all questions in db that include the topic uid and setCurrentFeed
      setCurrentFeed(FEED_A);
    }
  }, [selectedTopic]);

  return (
    // [x] Create "currently viewing" element
    <div className={classes.feed}>
      <FeedControlBar />
      {selectedTopic ? <FeedInfo /> : <MyFeedInfo />}
      <ul className={classes.questions}>
        {currentFeed.map((questionItem) => (
          <QuestionItem
            key={questionItem.id}
            className={classes["question-item"]}
            username={questionItem.username}
            image={questionItem.image}
            link={questionItem.link}
            question={questionItem.question}
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
