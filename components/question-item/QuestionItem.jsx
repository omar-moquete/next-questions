import Link from "next/link";
import React, { useEffect, useState } from "react";
import LikeIcon from "../UI/svg/LikeIcon";
import ReplyIcon from "../UI/svg/ReplyIcon";
import classes from "./QuestionItem.module.scss";
import TimeAgo from "react-timeago";

const QuestionItem = function (props) {
  const { image, username, question } = props;
  // [x] Add question title
  // [x] Redirect to user profile page on user click
  // [ ] Add time ago instead of date if short time
  // [ ] Redirect to question detail page on question click
  // [x] Add topic for question
  // [ ]TODO: create a get topic function that takes a topic uid and returns the topic data from the db, maybe a custom hook

  const goToQuestionHandler = () => {
    // [ ]TODO: Go to question detail page.
  };

  return (
    <li
      className={`${classes.container} ${props.className}`}
      onClick={goToQuestionHandler}
    >
      <div className={classes.info}>
        <img src={image} alt="User image" />
        <div className={classes["username-time-topic"]}>
          <div className={classes["username-time"]}>
            <Link className={classes.username} href={`/${username}`}>
              {username}
            </Link>
            <p className={classes.time}>
              <TimeAgo date={question.timeStamp.seconds} />
            </p>
          </div>
          <p className={classes.topic}>#question.topic.text</p>
        </div>
      </div>

      <div className={classes.text}>
        <h3>{question.title}</h3>
        <p>{question.text}</p>
      </div>

      <div className={classes.controls}>
        <div className={classes.icons}>
          <div className={classes.icon}>
            <LikeIcon />
            <p>{question.likes}</p>
          </div>
          <div className={classes.icon}>
            <ReplyIcon />
            <p>{question.replies}</p>
          </div>
        </div>
      </div>
    </li>
  );
};

export default QuestionItem;
