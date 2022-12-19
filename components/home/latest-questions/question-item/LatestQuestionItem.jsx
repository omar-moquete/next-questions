import Link from "next/link";
import React from "react";
import classes from "./LatestQuestionItem.module.scss";

const LatestQuestionItem = function (props) {
  const { image, username, question, link } = props;
  console.log(image);

  const goToQuestionHandler = () => {
    // Implement imperative navigation
  };

  return (
    <li className={classes["question-item"]} onClick={goToQuestionHandler}>
      {/* div > image + username */}
      <div className={classes["image-and-username"]}>
        <img className={classes["user-image"]} src={image} />
        <Link href="/user-id" className={classes.username}>
          {username}
        </Link>
      </div>

      <div className={classes["question-bubble"]}>
        <p className={classes["question-text"]}>{question.text}</p>
        <p className={classes["question-date"]}></p>
      </div>
    </li>
  );
};

export default LatestQuestionItem;
