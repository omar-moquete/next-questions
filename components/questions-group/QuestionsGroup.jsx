import React from "react";
import classes from "./QuestionGroup.module.scss";
import QuestionItem from "../question-item/LatestQuestionItem";

const QuestionGroup = function (props) {
  return (
    <ul className={`${classes["question-group"]} ${props.className}`}>
      {props.questions.map((questionItem) => (
        <QuestionItem
          key={questionItem.id}
          username={questionItem.username}
          image={questionItem.image}
          link={questionItem.link}
          question={questionItem.question}
        />
      ))}
    </ul>
  );
};

export default QuestionGroup;
