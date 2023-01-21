import Link from "next/link";
import React from "react";
import LikeIcon from "../UI/svg/LikeIcon";
import AnswerIcon from "../UI/svg/AnswerIcon";
import classes from "./QuestionItem.module.scss";
import HashIcon from "../UI/svg/HashIcon";

const QuestionItem = function (props) {
  const { image, username, question } = props;
  // [x] Add question title
  // [x] Redirect to user profile page on user click
  // [ ] Add time ago instead of date if short time
  // [ ] Redirect to question detail page on question click
  // [x] Add topic for question
  // [ ]TODO: create a get topic function that takes a topic uid and returns the topic data from the db, maybe a custom hook

  const goToQuestionHandler = () => {
    // Implement imperative navigation
  };

  return (
    <li
      className={`${classes.container} ${props.className}`}
      onClick={goToQuestionHandler}
    >
      {/* info */}
      <div className={classes.info}>
        <div className={classes["user-and-date"]}>
          <img src={image} />
          <div className={classes["username-and-date"]}>
            <Link href={`/${username}`} className={classes.username}>
              {username}
            </Link>

            <p className={classes["question-date"]}>10/10/1000</p>
          </div>
        </div>
        <p className={classes.topic}>#DominicanRepublicEmbassy</p>
      </div>

      {/* text */}
      <div className={classes.text}>
        <h3>{question.title}</h3>
        <p>{question.text}</p>
      </div>

      {/* controls */}
      <div className={classes.controls}>
        <div className={classes.subgroup}>
          <LikeIcon className={classes["like-icon"]} />
          <p>{34}</p>
        </div>
        <div className={classes.subgroup}>
          <AnswerIcon className={classes["answer-icon"]} />
          <p>{5}</p>
        </div>
      </div>

      {/* <div className={classes.user}>
    

       
      </div>

  




      </div> */}
    </li>
  );
};

export default QuestionItem;
