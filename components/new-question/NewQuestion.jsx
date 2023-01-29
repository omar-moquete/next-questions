import React from "react";
import classes from "./NewQuestion.module.scss";
import TextareaAutosize from "react-textarea-autosize";
import SecondaryButton from "../UI/buttons/SecondaryButton";
import TopicFinder from "../topic-finder/TopicFinder";
import { useState } from "react";
import { useRef } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useEffect } from "react";

const NewQuestion = function (props) {
  // topic structure
  // question.topic: {
  //   uid: "t1",
  //   authorUsername: "coco_809",
  //   text: "CarRepairs",
  //   description: "Explore car repair questions.",
  //   questionsAsked: [{ uid: "q1" }],
  // },

  // question structure
  // {
  //   uid: "q1", // get from firebase
  //   title: "Title...", // get from input
  //   text: "Text...", // get from input
  //   topic: { uid: "t1" }, // if new save to firebase, if current set current
  //   timeStamp: { seconds: 1674361910 }, // server timestamp
  //   askedBy: "the_connoisseur77", // get from auth state
  //   likes: 23, // don't pass, generate on event
  //   answers: 5, // don't pass , generate on event
  // }

  const topicRef = useRef();
  const titleRef = useRef();
  const detailsRef = useRef();
  const router = useRouter();

  const cancelHandler = (e) => {
    e.preventDefault();
    router.back();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const title = titleRef.current.value;
    const details = detailsRef.current.value;

    const question = {
      topic: "",
      title,
      details,
    };
  };

  return (
    <div className={classes.container}>
      <form onSubmit={handleSubmit}>
        <h2 className={classes["main-title"]}>New question</h2>

        <div className={classes["topic-wrapper"]}>
          <TopicFinder
            className={classes.topic}
            onSelect={() => {}}
            placeholder="Select or create a topic"
          />
        </div>
        <label htmlFor="title">Title</label>
        <TextareaAutosize
          minRows={1}
          type="text"
          name="title"
          placeholder="What is the...?"
          className={classes.title}
        />

        <label htmlFor="details">Details</label>
        <TextareaAutosize
          minRows={5}
          name="details"
          placeholder="I've been wondering..."
        />

        <div className={classes.controls}>
          <SecondaryButton onClick={cancelHandler}>Cancel</SecondaryButton>
          <SecondaryButton>Submit</SecondaryButton>
        </div>
      </form>
    </div>
  );
};

export default NewQuestion;
