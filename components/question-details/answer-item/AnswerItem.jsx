import React from "react";
import { getUserImageUrlWithUsername } from "../../../_TEST_DATA";
import classes from "./AnswerItem.module.scss";
import LikeIcon from "../../UI/svg/LikeIcon";
import ReplyItem from "./ReplyItem";

// [ ] TODO: ------> MAKE AnswerItemITEM
const AnswerItem = function () {
  /////
  const imageUrl = getUserImageUrlWithUsername();
  ////
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
        <div className={classes.reply}>
          <label>Reply</label>
        </div>
        <div className={classes.icon}>
          <LikeIcon />
          <p>1</p>
        </div>
      </div>

      <ul className={classes.replies}>
        {/* Return list item per reply */}
        <ReplyItem />
        <ReplyItem />
        <ReplyItem />
      </ul>
    </li>
  );
};

export default AnswerItem;
