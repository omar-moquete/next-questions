import React from "react";
import classes from "./LatestQuestions.module.scss";
import QuestionGroup from "../../questions-group/QuestionsGroup";
import QuestionItem from "../../question-item/QuestionItem";

const LatestQuestions = function ({ latestQuestionsData }) {
  return (
    <div className={classes.container}>
      <h2>See what's new</h2>

      <div className={classes.wrapper}>
        {latestQuestionsData.map((question) => (
          <QuestionItem
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
