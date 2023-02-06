import Link from "next/link";
import React, { useEffect, useState } from "react";
import classes from "./QuestionItem.module.scss";
import TimeAgo from "react-timeago";
import Topic from "../topic/Topic";
import LikeButton from "./LikeButton";
import ReplyButton from "./ReplyButton";
import useReplyForm from "../../hooks/useReplyForm";
import { useRouter } from "next/router";
import { timeAgoFormatter } from "../../utils";
import useDatabase from "../../hooks/useDatabase";
import { useSelector } from "react-redux";
import Portal from "../UI/Portal";
import Modal1 from "../UI/modals/Modal1";
import LikesList from "./LikesList";

const QuestionItem = function ({
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

  // Controls likes
  const database = useDatabase();
  const user = useSelector((slices) => slices.auth.user);
  const [likesAmount, setLikesAmount] = useState(questionData.likes.length);
  const [questionLikes, setQuestionLikes] = useState(questionData.likes);
  const [likedByUser, setLikedByUser] = useState(null);

  useEffect(() => {
    // Wait to see if user data loads
    if (user)
      setLikedByUser(
        questionData.likes.some((like) => like.likedBy === user.username)
      );
  }, [user]);

  const likeHandler = async () => {
    // This function does not wait for the like to be posted to the database. Instead it updates the like in the UI and then posts the new data to the database.

    if (!user) {
      router.push("/login");
      return;
    }
    if (likedByUser) {
      setLikesAmount((likesAmount) => likesAmount - 1);
      setLikedByUser(false);
    } else {
      setLikesAmount((likesAmount) => likesAmount + 1);
      setLikedByUser(true);
    }

    const likes = await database.like(questionData.uid);
    setQuestionLikes(likes);
  };

  // controls modal
  const [modalVisible, setModalVisible] = useState(false);
  const [likedByText, setLikedByText] = useState(``);

  useEffect(() => {
    if (!user) {
      // liked by username.
      if (questionLikes.length === 1) {
        setLikedByText(
          <p>
            Liked by{" "}
            <Link href={`/${questionLikes[0].likedBy}`}>
              {questionLikes[0].likedBy}
            </Link>
            .
          </p>
        );
        return;
      }

      // liked by username and username.
      if (questionLikes.length === 2) {
        const byUsernames = questionLikes.map((like) => questionLikes.likedBy);
        setLikedByText(
          <p>
            Liked by <Link href={`/${byUsernames[0]}`}>{byUsernames[0]}</Link>{" "}
            and <Link href={`/${byUsernames[1]}`}>{byUsernames[1]}</Link>
          </p>
        );
        return;
      }
      // liked by username, username and n others
      if (questionLikes.length === 3) {
        const byUsernames = questionLikes.map((like) => like.likedBy);
        setLikedByText(
          <p>
            Liked by <Link href={`/${byUsernames[0]}`}>{byUsernames[0]}</Link>,{" "}
            <Link href={`/${byUsernames[1]}`}>{byUsernames[1]}</Link> and{" "}
            <Link href={`/${byUsernames[2]}`}>{byUsernames[2]}</Link>
          </p>
        );
        return;
      }

      // Liked by n people.
      if (questionLikes.length > 3) {
        setLikedByText(
          <p>
            Liked by {questionLikes.length}{" "}
            <span onClick={() => setModalVisible(true)}>people</span>.
          </p>
        );
        return;
      }
    }

    if (user) {
      // if likes length is 1 and is user
      // Liked by me.
      if (
        questionLikes.length === 1 &&
        questionLikes[0].likedBy === user.username
      ) {
        setLikedByText(<p>Liked by me.</p>);
        return;
      }

      // if likes length is 1 and is NOT user
      // Liked by username.
      if (
        questionLikes.length === 1 &&
        questionLikes[0].likedBy !== user.username
      ) {
        setLikedByText(
          <p>
            Liked by{" "}
            <Link href={`/${likes[0].likedBy}`}>{likes[0].likedBy}</Link>.
          </p>
        );
        return;
      }

      // if likes length is 2 and one is the user
      // Liked by username and me.
      if (
        questionLikes.length === 2 &&
        questionLikes.some((like) => like.likedBy === user.username)
      ) {
        const byUsername = questionLikes.find(
          (like) => like.likedBy !== user.username
        ).likedBy;
        setLikedByText(
          <p>
            Liked by
            <Link href={`/${byUsername}`}>{byUsername}</Link>
            and me.
          </p>
        );
        return;
      }

      // If likes.length is 2 and neither are the user's name
      // Liked by username and username.
      if (
        questionLikes.length === 2 &&
        questionLikes.some((like) => like.likedBy !== user.username)
      ) {
        const byUsernames = questionLikes.map((like) => like.likedBy);
        setLikedByText(
          <p>
            Liked by <Link href={`/${byUsernames[0]}`}>{byUsernames[0]}</Link>{" "}
            and <Link href={`/${byUsernames[1]}`}>{byUsernames[1]}</Link>
          </p>
        );
        return;
      }

      // if likes length is 3 and one is the user
      // Liked by username, username and me
      if (
        questionLikes.length === 3 &&
        questionLikes.some((like) => like.likedBy === user.username)
      ) {
        const byUsernames = questionLikes
          .filter((like) => like.likedBy !== user.username)
          .map((like) => like.likedBy);

        setLikedByText(
          <p>
            Liked by <Link href={`/${byUsernames[0]}`}>{byUsernames[0]}</Link>
            {", "}
            <Link href={`/${byUsernames[1]}`}>{byUsernames[1]}</Link> and me
          </p>
        );
        return;
      }

      // should go first
      // If likes > 3 and user is one of them
      // Liked by me and n others
      if (
        questionLikes.length > 3 &&
        questionLikes.some((like) => like.likedBy === user.username)
      ) {
        setLikedByText(
          <p>
            Liked by me and {questionLikes.length - 1}{" "}
            <span onClick={() => setModalVisible(true)}>others</span>.
          </p>
        );
        return;
      }

      // If likes > 3 and user is NOT one of them
      // Liked by n people.
      if (
        questionLikes.length >= 3 &&
        questionLikes.some((like) => like.likedBy !== user.username)
      ) {
        setLikedByText(
          <p>
            Liked by {questionLikes.length}{" "}
            <span onClick={() => setModalVisible(true)}>people</span>.
          </p>
        );
        return;
      }
    }
  }, [user, questionLikes]);

  return (
    <li className={`${classes.container} ${className || ""}`}>
      <div className={classes.info}>
        {/* [ ]TODO: Implement avatar if no imageUrl */}
        <img src={questionData.questionAuthorData.imageUrl} alt="User image" />
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
        <Portal show={modalVisible}>
          <Modal1
            title="Likes"
            buttons={[
              {
                text: "Close",
                onClick: () => {
                  setModalVisible(false);
                },
              },
            ]}
          >
            <LikesList data={questionLikes} />
          </Modal1>
        </Portal>
        <div className={classes["controls-wrapper"]}>
          {likedByText}

          <div className={classes.icons}>
            <LikeButton
              likes={likesAmount}
              onClick={likeHandler}
              wrapperClass={likedByUser ? classes.liked : ""}
            />
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
