import React from "react";
import QuestionItem from "../question-item/QuestionItem";
import AnswerItem from "./answer-item/AnswerItem";
import classes from "./QuestionDetails.module.scss";
import PrimaryButton from "../UI/buttons/PrimaryButton";
import { useState } from "react";
import { useRef } from "react";
import { setInputHeight } from "../../utils";
import { useSelector } from "react-redux";

const QuestionDetails = function ({ questionData, imageUrl, username }) {
  return (
    <div className={classes.container}>
      <ul className={classes.border}>
        <QuestionItem
          question={questionData}
          imageUrl={imageUrl}
          username={username}
          className={classes["question-item-override"]}
        />
        <ul className={classes["answers-container"]}>
          <AnswerItem />
          <AnswerItem />
          <AnswerItem />
        </ul>
      </ul>
    </div>
  );
};

export default QuestionDetails;
