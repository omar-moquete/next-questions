import React from "react";
import classes from "./LatestQuestions.module.scss";
import QuestionItem from "../../question-item/QuestionItem";
import InlineSpinner2 from "../../UI/inline-spinner/InlineSpinner2";

const LatestQuestions = function ({ latestQuestionsData }) {
  return (
    <div className={classes.container}>
      <h2>See what's new</h2>
      <div className={classes.wrapper}>
        {latestQuestionsData && latestQuestionsData.length === 0 && (
          <div className={classes.nothing}>
            <h2>No questions yet</h2>
            <p>Ask the first question!</p>
          </div>
        )}
        {!latestQuestionsData && (
          <InlineSpinner2 color="#005c97" height="1rem" />
        )}
        {latestQuestionsData &&
          latestQuestionsData.map((question) => (
            <QuestionItem
              key={question.uid}
              className={classes.question}
              questionData={question}
              imageUrl={question.questionAuthorData.imageUrl}
            />
          ))}
      </div>
    </div>
  );
};

export default LatestQuestions;
