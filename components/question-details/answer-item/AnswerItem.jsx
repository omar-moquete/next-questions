import React from "react";
import classes from "./AnswerItem.module.scss";
import Chevron from "../../UI/svg/chevron";
import ReplyItem from "./ReplyItem";
import { useSelector } from "react-redux";
import LikeButton from "../../question-item/LikeButton";
import useReplyForm from "../../../hooks/useReplyForm";
import { timeAgoFormatter } from "../../../utils";
import Link from "next/link";
import TimeAgo from "react-timeago";
import { useState } from "react";
import { likeAnswer } from "../../../db";
import { useEffect } from "react";
import AvatarIllustration from "../../UI/svg/AvatarIllustration";
import { useRef } from "react";
import { DELETED_USER_USERNAME } from "../../../app-config";
import { useRouter } from "next/router";

const AnswerItem = function ({
  answerReplies = [],
  answerUid,
  questionUid,
  answeredBy,
  date,
  text,
  imageUrl,
  likes = [],
}) {
  // The difference between <QuestionDetails/> displaying <AnswerItem/> and <AnswerItem/> displaying <ReplyItem/> is:
  // From <QuestionDetails/> to <AnswerItem/>, the Answer rendered list is passed in the following order: getStaticProps() -> <QuestionPage/> -> <QuestionItem/> -> answers.map => <AnswerItem/>.
  // And
  // From getStaticProps() -> <QuestionPage/> -> <QuestionItem/> -> answers.map => <AnswerItem/> -> answer.replies.map => <ReplyItem/>

  // Side note: questionsAnswers is never undefined in questionDetails because a value is always received from getStaticProps even if a question answer does not have a reply object, in which case an empty array is returned. In the case of adding a reply to an answer, when the reply is posted it's automatycally added to the DOM because our page is hydrated and react will take over. This means that when react tries to render <AnswerItem/> answerReplies will be undefined because getStaticProps is not passing this argument. This is why a default value of an empty array is assigned to it on component load. If left unhandled, app will crash on answer addition.
  const [repliesState, setRepliesState] = useState(answerReplies);
  const { ReplyFormAnchor, show } = useReplyForm();

  // Likes
  const [likesAmount, setLikesAmount] = useState(likes.length);
  const [likedByUser, setLikedByUser] = useState(null);
  const user = useSelector((slices) => slices.auth.user);
  const [showReplies, setShowReplies] = useState(false);
  const scrollRef = useRef();
  const router = useRouter();

  useEffect(() => {
    // Wait to see if user data loads. Sets liked class on liked button
    if (user)
      setLikedByUser(likes.some((like) => like.likedBy === user.username));
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

    await likeAnswer(answerUid);
  };

  const answerActionHandler = () => {
    !user && router.push("/login");
    user && show();
  };

  // Scrolls to the last element added in the replies array.
  useEffect(() => {
    const lastAddedReply = scrollRef?.current?.lastElementChild;
    if (!lastAddedReply) return;
    lastAddedReply.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });

    lastAddedReply.classList.add(classes.childHighlight);
    setTimeout(() => {
      lastAddedReply.classList.remove(classes.childHighlight);
    }, 1500);
  }, [repliesState.length]);

  return (
    <li className={classes.container}>
      <div className={classes["user-container"]}>
        <div className={classes.user}>
          {imageUrl && <img src={imageUrl} alt="user image" />}
          {!imageUrl && (
            <AvatarIllustration className={classes.avatarIllustration} />
          )}

          <div className={classes["username-and-datetime"]}>
            {answeredBy === DELETED_USER_USERNAME ? (
              <p className={classes.deletedAccount}>
                <i>{DELETED_USER_USERNAME}</i>
              </p>
            ) : (
              <Link href={`/${answeredBy}`}>{answeredBy}</Link>
            )}

            <span>•</span>
            <p>
              <TimeAgo
                date={date}
                formatter={timeAgoFormatter}
                minPeriod={60}
              />
            </p>
          </div>
        </div>
      </div>
      <p className={classes.text}>{text}</p>
      <div className={classes.icons}>
        <label className={classes.reply} onClick={answerActionHandler}>
          Reply
        </label>
        <LikeButton
          wrapperClass={likedByUser ? classes.liked : ""}
          onClick={likeHandler}
          likes={likesAmount}
        />
      </div>

      {/* ANCHOR */}
      <ReplyFormAnchor
        questionUid={questionUid}
        answerUid={answerUid}
        dataState={[repliesState, setRepliesState]}
        placeholder="Enter your reply"
        mention={answeredBy}
        showReplies={() => {
          setShowReplies(true);
        }}
      />

      {repliesState.length > 0 && showReplies && (
        <ul className={classes.replies} ref={scrollRef}>
          {/* The order of the replies is last reply, last place. */}
          {repliesState.map((reply) => (
            <ReplyItem
              key={reply.uid}
              repliedBy={reply.repliedBy}
              imageUrl={reply.replyAuthorData.imageUrl}
              text={reply.text}
              // Needed to post to reply to /answers/answerUid/replies in db
              mention={reply.mention}
              questionUid={questionUid}
              answerUid={answerUid}
              replyUid={reply.uid}
              date={reply.date}
              likes={reply.likes}
              dataState={[repliesState, setRepliesState]}
            />
          ))}
        </ul>
      )}
      {repliesState.length > 0 && (
        <div
          className={`${classes.showReplies} ${
            showReplies && classes.showRepliesActive
          }`}
          onClick={() => {
            setShowReplies((prev) => !prev);
          }}
        >
          <Chevron />
          <p>
            {showReplies ? "Hide" : "Show"} {repliesState.length} repl
            {repliesState.length > 1 ? "ies" : "y"}
          </p>
        </div>
      )}
    </li>
  );
};

export default AnswerItem;
