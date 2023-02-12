import React, { useState } from "react";
import classes from "./ReplyItem.module.scss";
import MentionIcon from "../../UI/svg/MentionIcon";
import { useDispatch, useSelector } from "react-redux";
import LikeButton from "../../question-item/LikeButton";
import useReplyForm from "../../../hooks/useReplyForm";
import Link from "next/link";
import TimeAgo from "react-timeago";
import { timeAgoFormatter } from "../../../utils";
import AvatarIllustration from "../../UI/svg/AvatarIllustration";

const ReplyItem = function ({
  repliedBy,
  text,
  answerUid,
  questionUid,
  date,
  likes = 0,
  dataState,
  mention,
  imageUrl,
}) {
  const { show, ReplyFormAnchor } = useReplyForm();
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
            <Link href={`/${repliedBy}`}>{repliedBy}</Link>
            <span>•</span>
            <div className={classes.username}>
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
        <LikeButton likes={likes} />
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
