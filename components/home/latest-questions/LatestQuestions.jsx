import React from "react";
import classes from "./LatestQuestions.module.scss";

import QuestionGroup from "../../questions-group/QuestionsGroup";
const questions = [
  {
    id: "1",
    username: "john234",
    image:
      "https://media.istockphoto.com/id/1372641621/photo/portrait-of-a-businessman-on-gray-background.jpg?s=612x612&w=is&k=20&c=I3K5XdgQpzPWui8j9CcvTa3f3gfifxZfetZd-h4a4BM=",
    question: {
      text: "Welcome to NJSQuestions. If you are a curious person or if you like to help others with their questions about things you know, then this is the place where you can be yourself. Feel free to ask and answer any questions you'd like. You can select your favorite topic, vote for your favorite questions and answers, and comment on the answers.",
      date: +new Date(),
    },
    link: "https://www.google.com",
  },
  {
    id: "2",
    username: "john234",
    image:
      "https://media.istockphoto.com/id/1372641621/photo/portrait-of-a-businessman-on-gray-background.jpg?s=612x612&w=is&k=20&c=I3K5XdgQpzPWui8j9CcvTa3f3gfifxZfetZd-h4a4BM=",
    question: {
      text: 'Why is american football called " football" if it\'s not played with the feet, like soccer?',
      date: +new Date(),
    },
    link: "https://www.google.com",
  },
  {
    id: "3",
    username: "john234",
    image:
      "https://media.istockphoto.com/id/1372641621/photo/portrait-of-a-businessman-on-gray-background.jpg?s=612x612&w=is&k=20&c=I3K5XdgQpzPWui8j9CcvTa3f3gfifxZfetZd-h4a4BM=",
    question: {
      text: 'Why is american football called " football" if it\'s not played with the feet, like soccer?',
      date: +new Date(),
    },
    link: "https://www.google.com",
  },
  {
    id: "4",
    username: "john234",
    image:
      "https://media.istockphoto.com/id/1372641621/photo/portrait-of-a-businessman-on-gray-background.jpg?s=612x612&w=is&k=20&c=I3K5XdgQpzPWui8j9CcvTa3f3gfifxZfetZd-h4a4BM=",
    question: {
      text: 'Why is american football called " football" if it\'s not played with the feet, like soccer?',
      date: +new Date(),
    },
    link: "https://www.google.com",
  },
  {
    id: "5",
    username: "john234",
    image:
      "https://media.istockphoto.com/id/1372641621/photo/portrait-of-a-businessman-on-gray-background.jpg?s=612x612&w=is&k=20&c=I3K5XdgQpzPWui8j9CcvTa3f3gfifxZfetZd-h4a4BM=",
    question: {
      text: 'Why is american football called " football" if it\'s not played with the feet, like soccer?',
      date: +new Date(),
    },
    link: "https://www.google.com",
  },
];

const LatestQuestions = function () {
  return (
    <div className={classes.container}>
      <h2>Latest questions</h2>
      <QuestionGroup questions={questions} />
    </div>
  );
};

export default LatestQuestions;
