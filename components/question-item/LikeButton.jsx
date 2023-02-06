import React from "react";
import classes from "./LikeButton.module.scss";
import LikeIcon from "../UI/svg/LikeIcon";
import HeartIcon from "../UI/svg/HeartIcon";

const LikeButton = function ({ likes, onClick, wrapperClass, iconClass }) {
  const handler = (e) => {
    if (onClick) onClick(e);
  };
  return (
    <div className={`${classes.wrapper} ${wrapperClass}`}>
      {/* Default color is white. Set iconClass prop to override. */}
      <HeartIcon onClick={handler} className={`${classes.icon} ${iconClass}`} />
      <p>{likes}</p>
    </div>
  );
};

export default LikeButton;
