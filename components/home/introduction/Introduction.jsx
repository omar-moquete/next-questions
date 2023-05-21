import React from "react";
import classes from "./Introduction.module.scss";
import PrimaryButton from "../../UI/buttons/PrimaryButton";
import { useSelector } from "react-redux";

const Introduction = function () {
  const { user } = useSelector((slices) => slices.auth);

  return (
    <div className={classes.introduction}>
      {user ? (
        <div className={classes.welcomeUser}>
          <h2>Welcome&nbsp;</h2>
          <span translate="no">{user.username}</span>
          <h2>!</h2>
        </div>
      ) : (
        <h2>Welcome!</h2>
      )}

      {!user && (
        <>
          <p>
            Are you a curious person? Do you like helping others with their
            questions about things you know? If your answer is yes, then this is
            the place!
          </p>
          <p>
            Here you can ask and answer any questions, follow and create topics,
            like your favorite questions and answers and much more.
          </p>
          <PrimaryButton href="/login">Get started</PrimaryButton>
        </>
      )}

      {user && (
        <>
          <p>
            We're thrilled to have you with us. To get started, take a moment to
            explore the latest questions below or head to your feed for updates
            on the topics you follow.
          </p>
          <p>Let's dive in and discover what's new! 🥳</p>
          <PrimaryButton href="/feed">Take me to my feed</PrimaryButton>
        </>
      )}
    </div>
  );
};

export default Introduction;
