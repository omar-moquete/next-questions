import React from "react";
import { getUserImageUrlWithUsername } from "../../../_TEST_DATA";
import classes from "./AnswerItem.module.scss";
import LikeIcon from "../../UI/svg/LikeIcon";
import ReplyItem from "./ReplyItem";
import { useSelector } from "react-redux";
import LikeButton from "../../question-item/LikeButton";
import useReplyForm from "../../../hooks/useReplyForm";
import ReplyButton from "../../question-item/ReplyButton";

// [ ] TODO: ------> MAKE AnswerItemITEM
const AnswerItem = function () {
  const imageUrl = getUserImageUrlWithUsername();

  const { ReplyFormAnchor, show } = useReplyForm();

  return (
    <li className={classes.container}>
      <div className={classes["user-container"]}>
        {/* Flex 100% ,  */}
        <div className={classes.user}>
          <img src={imageUrl} alt="user image" />

          <div className={classes["username-and-datetime"]}>
            <a href="">Username</a>
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
        <label className={classes.reply} onClick={show}>
          Reply
        </label>
        <LikeButton likes={10} />
      </div>

      {/* ANCHOR */}
      <ReplyFormAnchor placeholder="Enter your answer" />

      <ul className={classes.replies}>
        {/* Return list item per reply */}
        <ReplyItem imageUrl={getUserImageUrlWithUsername()} />
        <ReplyItem imageUrl={getUserImageUrlWithUsername()} />
        <ReplyItem imageUrl={getUserImageUrlWithUsername()} />
      </ul>
    </li>
  );
};

export default AnswerItem;
