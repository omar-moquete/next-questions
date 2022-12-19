import React from "react";
import classes from "./Introduction.module.scss";
import PrimaryButton from "../../UI/buttons/PrimaryButton";

const Introduction = function () {
  return (
    <div className={classes.introduction}>
      <div className={classes.text}>
        <h2>Welcome!</h2>
        <p>
          Welcome to NJSQuestions. If you are a curious person or if you like to
          help others with their questions about things you know, then this is
          the place where you can be yourself.
        </p>
        <p>
          Feel free to ask and answer any questions you'd like. You can select
          your favorite topic, vote for your favorite questions and answers, and
          comment on the answers.
        </p>
      </div>
      <PrimaryButton className={classes.button}>Get started</PrimaryButton>
    </div>
  );
};

export default Introduction;
