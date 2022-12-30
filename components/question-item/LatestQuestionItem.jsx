import Link from "next/link";
import React from "react";
import LikeIcon from "../UI/svg/LikeIcon";
import AnswerIcon from "../UI/svg/AnswerIcon";
import classes from "./LatestQuestionItem.module.scss";

const LatestQuestionItem = function (props) {
  const { image, username, question, link } = props;
  console.log(image);

  const goToQuestionHandler = () => {
    // Implement imperative navigation
  };

  return (
    <li className={classes["question-item"]} onClick={goToQuestionHandler}>
      <div className={classes.user}>
        <img src={image} />
        <Link href="/user-id" className={classes.username}>
          {username}
        </Link>
        <p className={classes["question-date"]}>10/10/1000</p>
      </div>

      <p className={classes["question-text"]}>{question.text}</p>

      <div className={classes.stats}>
        <div className={classes["stats-group"]}>
          <LikeIcon />
          <p className={classes["likes-count"]}>{34}</p>
        </div>
        <div className={classes["stats-group"]}>
          <AnswerIcon />
          <p className={classes["answers-count"]}>{5}</p>
        </div>
      </div>
    </li>
  );
};

export default LatestQuestionItem;
