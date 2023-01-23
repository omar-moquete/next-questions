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
import useAuth from "../../hooks/useAuth";
const UserProfile = function (props) {
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
            {props.publicUserData.imageUrl ? (
              <img src={props.publicUserData.imageUrl} alt="User picture" />
            ) : (
              <AvatarIllustration className={classes.avatar} />
            )}
          </div>

          <h2>{props.publicUserData.username}</h2>

          <div className={classes["user-stats"]}>
            <div>
              <QuestionIcon className={classes["question-icon"]} />
              <p>{props.publicUserData.questionsAsked.length}</p>
            </div>
            <div>
              <ReplyIcon className={classes["answer-icon"]} />
              <p>{props.publicUserData.questionsAnswered.length}</p>
            </div>
          </div>
        </div>

        {/* If about is present */}
        {props.publicUserData.about && (
          <About text={props.publicUserData.about} />
        )}

        <p className={classes.member}>
          Member since{" "}
          {convertDate(props.publicUserData.memberSince.seconds, {
            dateStyle: "medium",
          })}
        </p>
      </div>

      <div className={classes.qa}>
        <div>
          <h2>My questions</h2>
          <QuestionGroup
            className={classes["profile-questions"]}
            questions={questions}
          />
        </div>
        <div>
          <h2>My answers</h2>

          <QuestionGroup
            className={classes["profile-questions"]}
            questions={questions}
          />
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
      </div>
    </div>
  );
};

export default UserProfile;
