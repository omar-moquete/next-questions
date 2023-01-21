import React from "react";
import classes from "./LatestQuestions.module.scss";

import QuestionGroup from "../../questions-group/QuestionsGroup";
import { questions } from "../../../_TEST_DATA";

const LatestQuestions = function () {
  return (
    <div className={classes.container}>
      <h2>Latest questions</h2>
      <QuestionGroup
        className={classes["latest-questions"]}
        questions={questions}
      />
    </div>
  );
};

export default LatestQuestions;
