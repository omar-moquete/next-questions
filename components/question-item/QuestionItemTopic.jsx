import React from "react";
import classes from "./QuestionItemTopic.module.scss";

const QuestionItemTopic = function (props) {
  return (
    <div className={classes.topic}>
      <p>#{props.text}</p>
    </div>
  );
};

export default QuestionItemTopic;
