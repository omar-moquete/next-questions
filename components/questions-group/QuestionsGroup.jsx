import React from "react";
import classes from "./QuestionGroup.module.scss";
import QuestionItem from "../question-item/QuestionItem";

const QuestionGroup = function ({ questions, className }) {
  // [ ]TODO: Limit results on small screens. (set home to 500px to test why)

  return (
    <ul className={`${classes["question-group"]} ${className || ""}`}>
      {questions.map((question) => (
        <QuestionItem key={question.uid} questionData={question} />
      ))}
    </ul>
  );
};

export default QuestionGroup;
