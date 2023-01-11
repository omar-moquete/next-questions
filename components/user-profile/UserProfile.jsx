import React, { useEffect, useState } from "react";
import classes from "./UserProfile.module.scss";
import SecondaryButton from "../UI/buttons/SecondaryButton";
import QuestionGroup from "../questions-group/QuestionsGroup";
import QuestionIcon from "../UI/svg/QuestionIcon";
import AnswerIcon from "../UI/svg/AnswerIcon";
import AvatarIllustration from "../UI/svg/AvatarIllustration";
import { convertDate } from "../../utils";
import { useSelector } from "react-redux";
import useAuth from "../../hooks/useAuth";

const UserProfile = function (props) {
  useAuth();
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

  const authState = useSelector((state) => state.auth);
  // Fix
  const [canEdit, setCanEdit] = useState();
  console.log(canEdit);

  const authenticatedUser = useSelector((state) => state.auth.user);
  console.log("authenticatedUser", authenticatedUser);
  return (
    <div className={classes.container}>
      <div className={classes["user-information"]}>
        <div className={classes.picture}>
          <div className={classes["user-image"]}>
            {props.publicUserData.imageUrl ? (
              <img
                src={props.publicUserData.profilePictureUrl}
                alt="User picture"
              />
            ) : (
              <AvatarIllustration className={classes.avatar} />
            )}
          </div>

          <h2>{props.publicUserData.username}</h2>

          <div className={classes["user-stats"]}>
            <div>
              <QuestionIcon className={classes["question-icon"]} />
              <p>{props.publicUserData.questionsAsked.length}</p>
            </div>
            <div>
              <AnswerIcon className={classes["answer-icon"]} />
              <p>{props.publicUserData.questionsAnswered.length}</p>
            </div>
          </div>
        </div>

        {/* If about is present, if not "" */}
        {props.publicUserData.about ? (
          <div className={classes.about}>
            <label htmlFor="about">About me</label>
            <p>{props.publicUserData.about}</p>
          </div>
        ) : (
          ""
        )}

        <p className={classes.member}>
          Member since{" "}
          {convertDate(props.publicUserData.memberSince.seconds, {
            dateStyle: "medium",
          })}
        </p>
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
