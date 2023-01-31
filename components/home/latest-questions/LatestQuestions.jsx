import React from "react";
import classes from "./LatestQuestions.module.scss";
import { QUESTIONS_TEST_DATA } from "../../../_TEST_DATA";
import QuestionGroup from "../../questions-group/QuestionsGroup";

const LatestQuestions = function ({ className }) {
  return (
    <div className={classes.container}>
      <h2>Latest questions</h2>
      <QuestionGroup
        className={`${classes["latest-questions"]} ${className}`}
        questions={QUESTIONS_TEST_DATA}
      />
    </div>
  );
};

export default LatestQuestions;
