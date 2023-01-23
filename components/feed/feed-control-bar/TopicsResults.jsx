import React, { useState } from "react";
import classes from "./TopicsResults.module.scss";
import QuestionIcon from "../../UI/svg/QuestionIcon";
import { bindArgs } from "../../../utils";
import { useDispatch } from "react-redux";
import { globalActions } from "../../../redux-store/globalSlice";

const TopicResults = function (props) {
  // 1) set selected topic to state
  const dispatch = useDispatch();
  const handleSelectedTopic = (topicUid) => {
    dispatch(globalActions.setSelectedTopic(topicUid));

    // Dismount this element after a selection was made
    props.onSelect();
  };
  return (
    <ul className={classes.results}>
      {props.topics.map((topic) => (
        // on list item click save currentTopic on state
        <li key={topic.uid} onClick={bindArgs(handleSelectedTopic, topic.uid)}>
          <div className={classes.text}>
            <h3>
              <span>#</span>
              {topic.text}
            </h3>
            <p>{topic.description}</p>
          </div>
          <div className={classes["total-questions-wrapper"]}>
            <div className={classes["total-questions"]}>
              <QuestionIcon /> {topic.questionsAsked.length}
            </div>
          </div>
        </li>
      ))}

      {props.topics.length < 1 && (
        <h2 className={classes["no-topics"]}>
          No questions found in "{"#" + props.query}".
        </h2>
      )}
    </ul>
  );
};

export default TopicResults;
