import React from "react";
import classes from "./UserProfile.module.scss";
import PrimaryForm from "../UI/forms/PrimaryForm";
import SecondaryButton from "../UI/buttons/SecondaryButton";
import QuestionGroup from "../questions-group/QuestionsGroup";

const UserProfile = function (props) {
  console.log(props.userData);
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

  return (
    <div className={classes.container}>
      <div className={classes["user-information"]}>
        <div className={classes.picture}>
          <img src={props.userData.profilePictureUrl} alt="User picture" />
          <h2>testuser123</h2>
        </div>

        <div className={classes.name}>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            name="name"
            id="name"
            readOnly
            defaultValue="Chris Martin"
          />
        </div>

        <div className={classes.about}>
          <label htmlFor="about">About</label>
          <p>Hi! I'm a developer at Google.</p>
        </div>

        <p className={classes.member}>Member since 00/00/000</p>
      </div>

      <div className={classes.qa}>
        <div>
          <h2>My questions</h2>
          <QuestionGroup
            className={classes["profile-questions"]}
            questions={questions}
          />
        </div>
        <div>
          <h2>My answers</h2>

          <QuestionGroup
            className={classes["profile-questions"]}
            questions={questions}
          />
        </div>
        <div className={classes.btns}>
          <SecondaryButton>Change password</SecondaryButton>
          <SecondaryButton className={classes["delete-account"]}>
            Delete account
          </SecondaryButton>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
