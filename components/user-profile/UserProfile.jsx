import React, { useEffect, useState } from "react";
import classes from "./UserProfile.module.scss";
import SecondaryButton from "../UI/buttons/SecondaryButton";
import QuestionGroup from "../questions-group/QuestionsGroup";
import QuestionIcon from "../UI/svg/QuestionIcon";
import ReplyIcon from "../UI/svg/ReplyIcon";
import AvatarIllustration from "../UI/svg/AvatarIllustration";
import { convertDate } from "../../utils";
import { useDispatch, useSelector } from "react-redux";
import About from "./about/About";
import { useRouter } from "next/router";
import { globalActions } from "../../redux-store/globalSlice";
import { getAllQuestions } from "../../_TEST_DATA";
const UserProfile = function ({ publicUserData }) {
  // [ ]Todo: Update view and add followed topics with the hability to unfollow.
  const router = useRouter();
  const visitedUser = router.asPath.split("/")[1];
  const dispatch = useDispatch();
  // When <UserProfile> mounts the visited user will be saved to state, and when <UserProfile> unmounts the visited user will be null
  useEffect(() => {
    dispatch(globalActions.setVisitedUser(visitedUser));
    return () => {
      dispatch(globalActions.setVisitedUser(null));
    };
  }, []);

  const user = useSelector((state) => state.auth.user);

  const changePasswordHandler = () => {
    router.push("/change-password");
  };

  return (
    <div className={classes.container}>
      <div className={classes["user-information"]}>
        <div className={classes.picture}>
          <div className={classes["user-image"]}>
            {publicUserData.imageUrl ? (
              <img src={publicUserData.imageUrl} alt="User picture" />
            ) : (
              <AvatarIllustration className={classes.avatar} />
            )}
          </div>

          <h2>{publicUserData.username}</h2>

          <div className={classes["user-stats"]}>
            <div>
              <QuestionIcon className={classes["question-icon"]} />
              <p>{publicUserData.questionsAsked.length}</p>
            </div>
            <div>
              <ReplyIcon className={classes["answer-icon"]} />
              <p>{publicUserData.questionsAnswered.length}</p>
            </div>
          </div>
        </div>

        {/* If about is present */}
        {publicUserData.about && <About text={publicUserData.about} />}

        <p className={classes.member}>
          Member since{" "}
          {convertDate(publicUserData.memberSince.seconds, {
            dateStyle: "medium",
          })}
        </p>
      </div>

      {true && (
        <>
          <div className={classes.q}>
            <h2 className={classes.h2}>
              {user ? "My questions" : "Questions"}
            </h2>
            {/* <QuestionGroup
              className={classes["profile-questions"]}
              questions={getAllQuestions()}
            /> */}
          </div>

          <div className={classes.a}>
            <h2 className={classes.h2}>
              {user ? "My answered questions" : "Answered questions"}
            </h2>
            {/* <QuestionGroup
              className={classes["profile-questions"]}
              questions={getAllQuestions()}
            /> */}
          </div>

          {/* If user logged in is the same as the user being visited */}
          {user?.username === visitedUser && (
            <div className={classes.btns}>
              <SecondaryButton onClick={changePasswordHandler}>
                Change password
              </SecondaryButton>
              <SecondaryButton className={classes["delete-account"]}>
                Delete account
              </SecondaryButton>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default UserProfile;
