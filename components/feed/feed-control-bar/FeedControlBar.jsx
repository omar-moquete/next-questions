import React from "react";
import SearchIcon from "../../UI/svg/SearchIcon";
import classes from "./FeedControlBar.module.scss";
import TopicFinder from "../../topic-finder/TopicFinder";
import { useDispatch } from "react-redux";
import { globalActions } from "../../../redux-store/globalSlice";

const FeedControlBar = function ({ onSelect }) {
  const dispatch = useDispatch();
  // Handles what happens when a topic is selected and automatically receives the selected topicUid. Setting the topicUid will cause <Feed/> to render the results under that topicUid.

  // If using <FeedControlBar>, it will pass an onSelect handler to <TopicFinder/> This way selectedTopic is set. If using <TopicFinder/>, it will not set selectedTopic by default, instead it will execute the function we pass to it.

  const topicHandler = (topicUid, topicTitle) => {
    dispatch(globalActions.setSelectedTopic(topicUid));
    onSelect && onSelect(topicUid, topicTitle);
  };

  return (
    <div className={classes["feed-control-bar"]}>
      <div className={classes["input-wrapper"]}>
        <SearchIcon />
        <input type="text" placeholder="Search..." />
      </div>
      <TopicFinder onSelect={topicHandler} placeholder="Topics..." />
    </div>
  );
};

export default FeedControlBar;
