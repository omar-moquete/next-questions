import Link from "next/link";
import React, { useEffect } from "react";
import classes from "./QuestionItem.module.scss";
import TimeAgo from "react-timeago";
import Topic from "../topic/Topic";
import LikeButton from "./LikeButton";
import ReplyButton from "./ReplyButton";
import useReplyForm from "../../hooks/useReplyForm";
import { useRouter } from "next/router";
import { timeAgoFormatter } from "../../utils";

const QuestionItem = function ({
  imageUrl,
  questionData,
  className,
  initWithForm = false,
  answersState,
}) {
  // [x] Add question title
  // [x] Redirect to user profile page on user click
  // [ ] Add time ago instead of date if short time
  // [ ] Redirect to question detail page on question click
  // [x] Add topic for question
  // [ ]TODO: create a get topic function that takes a topic uid and returns the topic data from the db, maybe a custom hook

  const { ReplyFormAnchor, show } = useReplyForm();

  const router = useRouter();

  const redirectToQuestion = () => {
    router.push("/questions/" + questionData.uid);
  };

  useEffect(() => {
    initWithForm && show();
  }, []);

  return (
    <li className={`${classes.container} ${className || ""}`}>
      <div className={classes.info}>
        {/* [ ]TODO: Implement avatar if no imageUrl */}
        <img src={imageUrl} alt="User image" />
        <div className={classes["username-time-topic"]}>
          <div className={classes["username-time"]}>
            <Link
              className={classes.username}
              href={`/${questionData.askedBy}`}
            >
              {questionData.askedBy}
            </Link>
            <div className={classes["dot-time"]}>
              <p>
                <TimeAgo
                  date={questionData.date}
                  formatter={timeAgoFormatter}
                  minPeriod={60}
                />
              </p>
            </div>
          </div>
          <Topic
            className={classes["topic-style-override"]}
            uid={questionData.topic.uid}
            title={questionData.topic.title}
          />
        </div>
      </div>

      <div className={classes.text}>
        <h3>{questionData.title}</h3>
        <p>{questionData.description}</p>
      </div>
      <div className={classes.controls}>
        <div className={classes.icons}>
          <LikeButton likes={questionData.likes || 0} />
          <ReplyButton
            answers={questionData.answers || 0}
            onClick={
              router.asPath.split("?")[0] === "/questions/" + questionData.uid
                ? show
                : redirectToQuestion
            }
          />
        </div>
      </div>
      {/* ANCHOR */}
      <ReplyFormAnchor
        questionUid={questionData.uid}
        dataState={answersState}
      />
    </li>
  );
};

export default QuestionItem;
