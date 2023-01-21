import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import HashIcon from "../../UI/svg/HashIcon";
import SearchIcon from "../../UI/svg/SearchIcon";
import classes from "./FeedControlBar.module.scss";
import TopicResults from "./TopicsResults";
import PrimaryButton from "../../UI/buttons/PrimaryButton";
import { globalActions } from "../../../redux-store/globalSlice";
import FeedIcon from "../../UI/svg/FeedIcon";

const FeedControlBar = function (props) {
  // Controls typed data
  const topicInputRef = useRef();
  const [topicQuery, setTopicQuery] = useState("");
  // User is considered typing if a truthy value is inserted in the input field and if an option is selected from the dropdown
  const [isTyping, setIsTyping] = useState(false);
  const [topicResults, setTopicResults] = useState([]);
  const dispatch = useDispatch();
  // Used to show/hide my feed button depending on the selected feed.
  const selectedTopic = useSelector((state) => state.global.selectedTopic);

  const getTopics = (topic) => {
    return [
      {
        uid: "1",
        text: "AmericanFootball",
        description:
          "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ducimus commodi sed fugiat tempore quidem!",
        questionsAsked: ["uid1", "uid2", "uid3", "uid4"],
      },
      {
        uid: "2",
        text: "AmericanFootball",
        description:
          "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ducimus commodi sed fugiat tempore quidem!",
        questionsAsked: ["uid1", "uid2", "uid3", "uid4"],
      },
      {
        uid: "3",
        text: "AmericanFootball",
        description:
          "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ducimus commodi sed fugiat tempore quidem!",
        questionsAsked: ["uid1", "uid2", "uid3", "uid4"],
      },
      {
        uid: "4",
        text: "AmericanFootball",
        description:
          "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ducimus commodi sed fugiat tempore quidem!",
        questionsAsked: ["uid1", "uid2", "uid3", "uid4"],
      },
      {
        uid: "5",
        text: "AmericanFootball",
        description:
          "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ducimus commodi sed fugiat tempore quidem!",
        questionsAsked: ["uid1", "uid2", "uid3", "uid4"],
      },
      {
        uid: "6",
        text: "AmericanFootball",
        description:
          "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ducimus commodi sed fugiat tempore quidem!",
        questionsAsked: ["uid1", "uid2", "uid3", "uid4"],
      },
    ];
  };
  const handleResults = () => {
    const currentQuery = topicInputRef.current.value;

    // if no query user is not typing
    if (!currentQuery) {
      setIsTyping(false);
      setTopicQuery("");
      setTopicResults([]);
    } else {
      setTopicResults(getTopics(currentQuery));
      setIsTyping(true);
      setTopicQuery(currentQuery);
    }
  };

  // 2) set currentTopic to null (null is the default of my feed)
  const resetCurrentTopic = () => {
    // Clear topic input field
    // BUG: Value not getting cleared on my feed btn click
    topicInputRef.current.value = "";
    console.log("topicInputRef.current.value");
    // Reset topic to null (null is default for My Feed)
    dispatch(globalActions.setSelectedTopic(null));
  };

  const hideResults = () => {
    setIsTyping(false);
  };
  return (
    <div className={classes["feed-control-bar"]}>
      <div className={classes["input-wrapper"]}>
        <SearchIcon />
        <input type="text" placeholder="Search..." />
      </div>

      <div className={classes.topics}>
        <div className={classes["input-wrapper"]}>
          <HashIcon />
          <input
            ref={topicInputRef}
            onChange={handleResults}
            type="text"
            placeholder="Topics..."
            // Two way binding loads initialized topicQuery in case one was returned by getStaticProps in the page component
            value={topicQuery}
          />
          {selectedTopic && (
            <PrimaryButton
              className={classes["my-feed-button"]}
              onClick={resetCurrentTopic}
            >
              <FeedIcon />
              My feed
            </PrimaryButton>
          )}
        </div>
        {isTyping && (
          <TopicResults
            topics={topicResults}
            query={topicQuery}
            onSelect={hideResults}
          />
        )}
      </div>
    </div>
  );
};

export default FeedControlBar;
