import React from "react";
import classes from "./ReplyButton.module.scss";
import ReplyIcon from "../UI/svg/ReplyIcon";

const ReplyButton = function ({ answers, onClick }) {
  const handler = (e) => {
    if (onClick) onClick(e);
  };
  return (
    <div className={classes.icon}>
      <ReplyIcon onClick={handler} />
      <p>{answers}</p>
    </div>
  );
};

export default ReplyButton;
