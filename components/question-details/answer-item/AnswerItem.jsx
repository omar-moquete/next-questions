import React from "react";
import { getUserImageUrlWithUsername } from "../../../_TEST_DATA";
import classes from "./AnswerItem.module.scss";
import LikeIcon from "../../UI/svg/LikeIcon";
import ReplyItem from "./ReplyItem";
import { useSelector } from "react-redux";
import LikeButton from "../../question-item/LikeButton";
import useReplyForm from "../../../hooks/useReplyForm";
import ReplyButton from "../../question-item/ReplyButton";
import { timeAgoFormatter } from "../../../utils";
import Link from "next/link";
import TimeAgo from "react-timeago";
import { useState } from "react";
import InlineSpinner from "../../UI/inline-spinner/InlineSpinner";
import { likeAnswer } from "../../../db";
import { useEffect } from "react";
import AvatarIllustration from "../../UI/svg/AvatarIllustration";

// [ ] TODO: ------> MAKE AnswerItemITEM
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

  // useEffect(() => {
  //   getUserDataWithUsername(answeredBy).then((userData) =>
  //     setImageUrl(userData.imageUrl)
  //   );
  // });

  const { ReplyFormAnchor, show } = useReplyForm();

  // Likes
  const [likesAmount, setLikesAmount] = useState(likes.length);
  const [likedByUser, setLikedByUser] = useState(null);
  const user = useSelector((slices) => slices.auth.user);

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
  return (
    <li className={classes.container}>
      <div className={classes["user-container"]}>
        <div className={classes.user}>
          {imageUrl && <img src={imageUrl} alt="user image" />}
          {!imageUrl && (
            <AvatarIllustration className={classes.avatarIllustration} />
          )}

          <div className={classes["username-and-datetime"]}>
            <Link href={`/${answeredBy}`}>{answeredBy}</Link>
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
        <label className={classes.reply} onClick={show}>
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
      />

      {repliesState.length > 0 && (
        <ul className={classes.replies}>
          {/* The order of the replies is last reply, last place. */}
          {repliesState.map((reply) => (
            <ReplyItem
              // Using date as key. Cannot use answerUid since it's the same uid for all replies under the same answer.
              key={reply.date}
              repliedBy={reply.repliedBy}
              imageUrl={reply.replyAuthorData.imageUrl}
              text={reply.text}
              // Needed to post to reply to /answers/answerUid/replies in db
              mention={reply.mention}
              answerUid={answerUid}
              questionUid={questionUid}
              date={reply.date}
              likes={reply.likes}
              dataState={[repliesState, setRepliesState]}
            />
          ))}
        </ul>
      )}
    </li>
  );
};

export default AnswerItem;
