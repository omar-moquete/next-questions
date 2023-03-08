import React, { useEffect, useState } from "react";
import classes from "./ReplyItem.module.scss";
import MentionIcon from "../../UI/svg/MentionIcon";
import { useDispatch, useSelector } from "react-redux";
import LikeButton from "../../question-item/LikeButton";
import useReplyForm from "../../../hooks/useReplyForm";
import Link from "next/link";
import TimeAgo from "react-timeago";
import { timeAgoFormatter } from "../../../utils";
import AvatarIllustration from "../../UI/svg/AvatarIllustration";
import { useRouter } from "next/router";
import { likeReply } from "../../../db";

const ReplyItem = function ({
  repliedBy,
  text,
  questionUid,
  answerUid,
  replyUid,
  date,
  likes,
  dataState,
  mention,
  imageUrl,
}) {
  const { show, ReplyFormAnchor } = useReplyForm();
  const router = useRouter();

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

    await likeReply(answerUid, replyUid);
  };

  return (
    <li className={classes.container}>
      <div className={classes["user-container"]}>
        {/* Flex 100% ,  */}
        <div className={classes.user}>
          {imageUrl && <img src={imageUrl} alt="user image" />}

          {!imageUrl && (
            <AvatarIllustration className={classes.avatarIllustration} />
          )}
          <div className={classes["username-and-datetime"]}>
            <Link href={`/${repliedBy}`} className={classes.username}>
              {repliedBy}
            </Link>
            <span>•</span>
            <div className={classes.mention}>
              <Link href={mention}>{mention}</Link>
              <MentionIcon className={classes["mention-icon"]} />
            </div>
            <span>•</span>
            <TimeAgo date={date} minPeriod={60} formatter={timeAgoFormatter} />
          </div>
        </div>
      </div>
      <p className={classes.text}>{text}</p>
      <div className={classes.icons}>
        <div className={classes.reply} onClick={show}>
          <label>Mention</label>
          <MentionIcon className={classes["mention-icon"]} />
        </div>
        <LikeButton
          wrapperClass={likedByUser ? classes.liked : ""}
          likes={likesAmount}
          onClick={likeHandler}
        />
      </div>

      {/* ANCHOR */}
      <ReplyFormAnchor
        questionUid={questionUid}
        answerUid={answerUid}
        dataState={dataState}
        placeholder={`@${repliedBy}`}
        mention={repliedBy}
        postReversed
      />
    </li>
  );
};

export default ReplyItem;
