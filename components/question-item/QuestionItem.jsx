import Link from "next/link";
import React, { useEffect, useState } from "react";
import classes from "./QuestionItem.module.scss";
import TimeAgo from "react-timeago";
import {
  getTopicInfoWithTopicUid,
  getTopicNameWithTopicUid,
} from "../../_TEST_DATA";
import Topic from "../topic/Topic";
import LikeButton from "./LikeButton";
import ReplyButton from "./ReplyButton";
import { globalActions } from "../../redux-store/globalSlice";
import { useDispatch, useSelector } from "react-redux";
import useReplyForm from "../../hooks/useReplyForm";
import ReplyForm from "../UI/forms/reply-form/ReplyForm";

const QuestionItem = function (props) {
  const { imageUrl, username, question } = props;
  // [x] Add question title
  // [x] Redirect to user profile page on user click
  // [ ] Add time ago instead of date if short time
  // [ ] Redirect to question detail page on question click
  // [x] Add topic for question
  // [ ]TODO: create a get topic function that takes a topic uid and returns the topic data from the db, maybe a custom hook

  [props.isQuestionDetail];
  const goToQuestionHandler = () => {
    // [ ]TODO: Go to question detail page.
  };

  // NOTE: TimeAgo-------------------------------
  const timeAgoFormatter = (value, unit, suffix) => {
    const pluralize = (word) => word + "s";
    if (value < 60 && unit === "second") return "just now";
    return `${value}  ${value > 1 ? pluralize(unit) : unit} ${suffix}`;
  };
  const topicInfo = getTopicInfoWithTopicUid(question.topic.uid);
  // NOTE: End TimeAgo-----------------------------

  const { ReplyFormAnchor, show } = useReplyForm();

  return (
    <li
      className={`${classes.container} ${props.className || ""}`}
      onClick={goToQuestionHandler}
    >
      <div className={classes.info}>
        <img src={imageUrl} alt="User image" />
        <div className={classes["username-time-topic"]}>
          <div className={classes["username-time"]}>
            <Link className={classes.username} href={`/${username}`}>
              {username}
            </Link>
            <div className={classes["dot-time"]}>
              <p>
                <TimeAgo
                  date={question.timeStamp.seconds}
                  formatter={timeAgoFormatter}
                  minPeriod={60}
                />
                {/* [x]TODO: Fix formatter */}
              </p>
            </div>
          </div>

          <Topic
            className={classes["topic-style-override"]}
            uid={topicInfo.uid}
            text={topicInfo.text}
          />
        </div>
      </div>

      <div className={classes.text}>
        <h3>{question.title}</h3>
        <p>{question.text}</p>
      </div>

      <div className={classes.controls}>
        <div className={classes.icons}>
          <LikeButton likes={question.likes} />
          <ReplyButton answers={question.answers} onClick={show} />
        </div>
      </div>
      {/* ANCHOR */}
      <ReplyFormAnchor />
    </li>
  );
};

export default QuestionItem;
