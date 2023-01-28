import React from "react";
import classes from "./LikeButton.module.scss";
import LikeIcon from "../UI/svg/LikeIcon";

const LikeButton = function ({ likes, onClick }) {
  const handler = (e) => {
    if (onClick) onClick(e);
  };
  return (
    <div className={classes.icon}>
      <LikeIcon onClick={handler} />
      <p>{likes}</p>
    </div>
  );
};

export default LikeButton;
