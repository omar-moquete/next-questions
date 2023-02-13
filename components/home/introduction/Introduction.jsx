import React from "react";
import classes from "./Introduction.module.scss";
import PrimaryButton from "../../UI/buttons/PrimaryButton";

const Introduction = function () {
  return (
    <div className={classes.introduction}>
      <h2>Welcome!</h2>
      <p>
        Are you a curious person? Do you like helping others with their
        questions about things you know? If your answer is yes, then this is the
        place!
      </p>
      <p>
        Here you can ask and answer any questions, follow and create topics,
        like your favorite questions and answers and much more.
      </p>

      <PrimaryButton href="/feed">Get started</PrimaryButton>
    </div>
  );
};

export default Introduction;
