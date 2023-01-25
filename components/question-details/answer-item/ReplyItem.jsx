import React from "react";
import { getUserImageUrlWithUsername } from "../../../_TEST_DATA";
import classes from "./ReplyItem.module.scss";
import LikeIcon from "../../UI/svg/LikeIcon";

const AnswerItem = function () {
  const imageUrl = getUserImageUrlWithUsername();
  return (
    <li className={classes.container}>
      <div className={classes["user-container"]}>
        {/* Flex 100% ,  */}
        <div className={classes.user}>
          <img src={imageUrl} alt="user image" />

          <div className={classes["username-and-datetime"]}>
            <a>Username</a>
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
        <div className={classes.icon}>
          <LikeIcon />
          <p>1</p>
        </div>
      </div>
    </li>
  );
};

export default AnswerItem;
