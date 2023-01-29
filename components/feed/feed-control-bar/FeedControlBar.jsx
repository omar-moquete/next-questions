import React from "react";
import SearchIcon from "../../UI/svg/SearchIcon";
import classes from "./FeedControlBar.module.scss";
import TopicFinder from "../../topic-finder/TopicFinder";
import { useDispatch } from "react-redux";
import { globalActions } from "../../../redux-store/globalSlice";

const FeedControlBar = function () {
  const dispatch = useDispatch();
  // Handles what happens when a topic is selected and automatically receives the selected topicUid. Setting the topicUid will cause <Feed/> to render the results under that topicUid.
  const topicHandler = (topicUid) => {
    dispatch(globalActions.setSelectedTopic(topicUid));
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
