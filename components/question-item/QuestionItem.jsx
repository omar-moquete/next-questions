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
import { useSelector } from "react-redux";
import Portal from "../UI/Portal";
import Modal1 from "../UI/modals/Modal1";
import LikesList from "./LikesList";
import { likeQuestion } from "../../db";
import AvatarIllustration from "../UI/svg/AvatarIllustration";
import { DELETED_USER_USERNAME } from "../../app-config";

const QuestionItem = function ({
  questionData,
  className,
  initWithForm = false,
  answersState,
}) {
  const { ReplyFormAnchor, show } = useReplyForm();

  const router = useRouter();

  const redirectToQuestion = () => {
    router.push("/questions/" + questionData.uid);
  };

  useEffect(() => {
    initWithForm && show();
  }, []);

  // Controls likes
  const user = useSelector((slices) => slices.auth.user);
  const [likesAmount, setLikesAmount] = useState(questionData.likes.length);
  const [questionLikes, setQuestionLikes] = useState(questionData.likes);
  const [likedByUser, setLikedByUser] = useState(null);
  const [questionAnswersQuantity, setQuestionAnswersQuantity] = useState(
    questionData.questionAnswers.length
  );

  useEffect(() => {
    // Wait to see if user data loads. Sets liked class on liked button
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

    const likes = await likeQuestion(questionData.uid);
    setQuestionLikes(likes);
  };

  // controls modal
  const [modalVisible, setModalVisible] = useState(false);
  const [likedByText, setLikedByText] = useState(``);

  useEffect(() => {
    if (questionLikes.length === 0) {
      setLikedByText("");
      return;
    }
    if (!user) {
      // liked by username.
      if (questionLikes.length === 1) {
        const username1 = questionLikes[0].likedBy;

        setLikedByText(
          <p>
            Liked by{" "}
            {username1 === DELETED_USER_USERNAME ? (
              <i>{DELETED_USER_USERNAME}</i>
            ) : (
              <Link href={`/${username1}`}>{username1}</Link>
            )}
            .
          </p>
        );
        return;
      }

      // liked by username and username.
      if (questionLikes.length === 2) {
        const [username1, username2] = questionLikes.map(
          (like) => like.likedBy
        );
        setLikedByText(
          <p>
            Liked by{" "}
            {username1 === DELETED_USER_USERNAME ? (
              <i>{DELETED_USER_USERNAME}</i>
            ) : (
              <Link href={`/${username1}`}>{username1}</Link>
            )}{" "}
            and{" "}
            {username2 === DELETED_USER_USERNAME ? (
              <i>{DELETED_USER_USERNAME}</i>
            ) : (
              <Link href={`/${username2}`}>{username2}</Link>
            )}
          </p>
        );
        return;
      }

      // liked by username, username and username
      if (questionLikes.length === 3) {
        const [username1, username2, username3] = questionLikes.map(
          (like) => like.likedBy
        );
        setLikedByText(
          <p>
            Liked by{" "}
            {username1 === DELETED_USER_USERNAME ? (
              <i>{DELETED_USER_USERNAME}</i>
            ) : (
              <Link href={`/${username1}`}>{username1}</Link>
            )}
            ,{" "}
            {username2 === DELETED_USER_USERNAME ? (
              <i>{DELETED_USER_USERNAME}</i>
            ) : (
              <Link href={`/${username2}`}>{username2}</Link>
            )}{" "}
            and{" "}
            {username3 === DELETED_USER_USERNAME ? (
              <i>{DELETED_USER_USERNAME}</i>
            ) : (
              <Link href={`/${username3}`}>{username3}</Link>
            )}
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
        const username = questionLikes[0].likedBy;

        setLikedByText(
          <p>
            Liked by{" "}
            {username === DELETED_USER_USERNAME ? (
              <i>{DELETED_USER_USERNAME}</i>
            ) : (
              <Link href={`/${username}`}>{username}</Link>
            )}
            .
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
        const username = questionLikes.find(
          (like) => like.likedBy !== user.username
        ).likedBy;

        setLikedByText(
          <p>
            Liked by{" "}
            {username === DELETED_USER_USERNAME ? (
              <i>{DELETED_USER_USERNAME}</i>
            ) : (
              <Link href={`/${username}`}>{username}</Link>
            )}{" "}
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
        const [username1, username2] = questionLikes.map(
          (like) => like.likedBy
        );

        setLikedByText(
          <p>
            Liked by{" "}
            {username1 === DELETED_USER_USERNAME ? (
              <i>{DELETED_USER_USERNAME}</i>
            ) : (
              <Link href={`/${username1}`}>{username1}</Link>
            )}{" "}
            and{" "}
            {username2 === DELETED_USER_USERNAME ? (
              <i>{DELETED_USER_USERNAME}</i>
            ) : (
              <Link href={`/${username2}`}>{username2}</Link>
            )}
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
        const [username1, username2] = questionLikes
          .filter((like) => like.likedBy !== user.username)
          .map((like) => like.likedBy);

        setLikedByText(
          <p>
            Liked by{" "}
            {username1 === DELETED_USER_USERNAME ? (
              <i>{DELETED_USER_USERNAME}</i>
            ) : (
              <Link href={`/${username1}`}>{username1}</Link>
            )}
            {", "}
            {username2 === DELETED_USER_USERNAME ? (
              <i>{DELETED_USER_USERNAME}</i>
            ) : (
              <Link href={`/${username2}`}>{username2}</Link>
            )}{" "}
            and me
          </p>
        );
        return;
      }

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

  const [questionUserImage, setQuestionUserImage] = useState(
    questionData.questionAuthorData.imageUrl
  );

  // Dynamically set the image displayed for this component to a state if the question author name is the same as the logged in username
  useEffect(() => {
    if (!user) return;
    if (user.username === questionData.askedBy) {
      setQuestionUserImage(user.imageUrl);
    }
  }, [user]);

  return (
    <li className={`${classes.container} ${className || ""}`}>
      <div className={classes.info}>
        {questionUserImage && <img src={questionUserImage} alt="User image" />}

        {!questionUserImage && (
          <AvatarIllustration className={classes.avatarIllustration} />
        )}
        <div className={classes["username-time-topic"]}>
          <div className={classes["username-time"]}>
            {questionData.askedBy === DELETED_USER_USERNAME ? (
              <p className={classes.deletedAccount}>
                <i>{DELETED_USER_USERNAME}</i>
              </p>
            ) : (
              <Link
                className={classes.username}
                href={`/${questionData.askedBy}`}
              >
                {questionData.askedBy}
              </Link>
            )}
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
            topicUid={questionData.topic.uid}
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
              answers={questionAnswersQuantity}
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
        updateAnswersQuantity={() => {
          setQuestionAnswersQuantity((prevState) => prevState + 1);
        }}
      />
    </li>
  );
};

export default QuestionItem;
