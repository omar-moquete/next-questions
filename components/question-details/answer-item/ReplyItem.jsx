import React from "react";
import classes from "./ReplyItem.module.scss";
import MentionIcon from "../../UI/svg/MentionIcon";
import { useSelector } from "react-redux";
import LikeButton from "../../question-item/LikeButton";
import useReplyForm from "../../../hooks/useReplyForm";

const ReplyItem = function ({ imageUrl, username, question }) {
  const { show, ReplyFormAnchor } = useReplyForm();

  return (
    <li className={classes.container}>
      <div className={classes["user-container"]}>
        {/* Flex 100% ,  */}
        <div className={classes.user}>
          <img src={imageUrl} alt="user image" />

          <div className={classes["username-and-datetime"]}>
            <a>Username</a>
            <span>•</span>
            <div className={classes.username}>
              <p>user</p>
              <MentionIcon className={classes["mention-icon"]} />
            </div>
            <span>•</span>
            <p>just now</p>
          </div>
        </div>
      </div>
      <p className={classes.text}>
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Neque ipsam
        delectus nesciunt optio magnam quisquam reiciendis recusandae nostrum.
        Cum similique repudiandae mollitia laudantium rem corporis vero. Ducimus
        eaque eos facilis?
      </p>
      <div className={classes.icons}>
        <div className={classes.reply} onClick={show}>
          <label>Mention</label>
          <MentionIcon className={classes["mention-icon"]} />
        </div>
        <LikeButton likes={2} />
      </div>

      {/* ANCHOR */}
      {/* [ ]NOTE: Implement @username in mention */}
      {/* [ ]NOTE: When question is posted, show user that's being replied to*/}
      <ReplyFormAnchor placeholder={"@username"} />
    </li>
  );
};

export default ReplyItem;
