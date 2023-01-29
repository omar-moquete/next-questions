import React from "react";
import classes from "./FloatingActionButton.module.scss";
import QuestionIcon from "../../svg/QuestionIcon";
import { useRouter } from "next/router";

const FloatingActionButton = function () {
  const router = useRouter();
  return (
    <button
      className={classes.fab}
      onClick={() => {
        router.push("/new-question");
      }}
    >
      <div className={classes.filter}>
        <QuestionIcon />
      </div>
      <span>New question</span>
    </button>
  );
};

export default FloatingActionButton;
