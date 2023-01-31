import React from "react";
import classes from "./QuestionGroup.module.scss";
import QuestionItem from "../question-item/QuestionItem";
import { getUserImageUrlWithUsername } from "../../_TEST_DATA";

const QuestionGroup = function (props) {
  // [ ]TODO: Limit results on small screens. (set home to 500px to test why)
  return (
    <ul className={`${classes["question-group"]} ${props.className || ""}`}>
      {props.questions.map((question) => (
        <QuestionItem
          key={question.uid}
          username={question.askedBy}
          imageUrl={getUserImageUrlWithUsername(question.askedBy)}
          question={question}
        />
      ))}
    </ul>
  );
};

export default QuestionGroup;
