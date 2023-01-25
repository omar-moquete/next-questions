import React from "react";
import QuestionItem from "../question-item/QuestionItem";
import AnswerItem from "./answer-item/AnswerItem";
import classes from "./QuestionDetails.module.scss";
import PrimaryButton from "../UI/buttons/PrimaryButton";
import { useState } from "react";
import { useRef } from "react";
import { setInputHeight } from "../../utils";

const QuestionDetails = function ({ questionData, imageUrl, username }) {
  const [isQuestionDetail, setIsQuestionDetail] = useState(true);
  const [value, setValue] = useState("");
  const test = (element) => {
    element.style.height = element.style.scrollHeight;
    console.log(element.style.height);
  };

  return (
    <div className={classes.container}>
      <ul className={classes.border}>
        <QuestionItem
          question={questionData}
          imageUrl={imageUrl}
          username={username}
          className={classes["question-item-override"]}
          isQuestionDetails={isQuestionDetail}
        />
        <ul className={classes["answers-container"]}>
          <form className={classes["input-wrapper"]}>
            <textarea
              type="text"
              placeholder="Enter an answer"
              onChange={(e) => test(e.target)}
            />
            <PrimaryButton>Post</PrimaryButton>
          </form>
          <AnswerItem />
          <AnswerItem />
          <AnswerItem />
        </ul>
      </ul>
    </div>
  );
};

export default QuestionDetails;
