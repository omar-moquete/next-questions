import React from "react";
import classes from "./Introduction.module.scss";
import PrimaryButton from "../../UI/buttons/PrimaryButton";

const Introduction = function () {
  return (
    <div className={classes.introduction}>
      <div className={classes.text}>
        <h2>Welcome!</h2>
        <p>
          Are you a curious person? Do you like helping others with their
          questions about things you know? If your answer is yes, then this is
          the place where you can be yourself.
        </p>
        <p>
          Ask and answer any questions you'd like, select your favorite topics,
          vote for your favorite questions and answers and more.
        </p>
      </div>

      <PrimaryButton className={classes.button}>Get started</PrimaryButton>
    </div>
  );
};

export default Introduction;
