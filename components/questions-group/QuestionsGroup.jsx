import React from "react";
import classes from "./QuestionGroup.module.scss";
import QuestionItem from "../question-item/QuestionItem";

const QuestionGroup = function ({ questions, className }) {
  return (
    <ul className={`${classes["question-group"]} ${className || ""}`}>
      {questions.map((question) => (
        <QuestionItem key={question.uid} questionData={question} />
      ))}
    </ul>
  );
};

export default QuestionGroup;
