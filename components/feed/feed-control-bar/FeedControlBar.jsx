import React, { useEffect, useState } from "react";
import classes from "./FeedControlBar.module.scss";
import TopicFinder from "../../topic-finder/TopicFinder";
import { useDispatch, useSelector } from "react-redux";
import { globalActions } from "../../../redux-store/globalSlice";
import QuestionFinder from "../question-finder/QuestionFinder";

const FeedControlBar = function ({ onSelect }) {
  const dispatch = useDispatch();
  const [searchBarInputValue, setSearchBarInputValue] = useState("");
  const topicHandler = (topicUid, topicTitle) => {
    dispatch(globalActions.setSelectedTopic(topicUid));
    onSelect && onSelect(topicUid, topicTitle);
  };

  return (
    <div className={classes["feed-control-bar"]}>
      <QuestionFinder
        searchBarValueState={[searchBarInputValue, setSearchBarInputValue]}
      />
      <TopicFinder
        onSelect={topicHandler}
        placeholder="Topics..."
        resetSearchBar={() => {
          setSearchBarInputValue("");
        }}
      />
    </div>
  );
};

export default FeedControlBar;
