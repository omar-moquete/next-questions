import React, { useEffect, useState } from "react";
import classes from "./UserProfile.module.scss";
import SecondaryButton from "../UI/buttons/SecondaryButton";
import QuestionIcon from "../UI/svg/QuestionIcon";
import ReplyIcon from "../UI/svg/ReplyIcon";
import AvatarIllustration from "../UI/svg/AvatarIllustration";
import { useDispatch, useSelector } from "react-redux";
import About from "./about/About";
import { useRouter } from "next/router";
import { globalActions } from "../../redux-store/globalSlice";
import MyFeedInfo from "../my-feed-info/MyFeedInfo";
import { getUserFollowedTopics } from "../../db";
import QuestionItem from "../question-item/QuestionItem";

// import MyFeedInfo from "../";

const UserProfile = function ({ publicUserData }) {
  const router = useRouter();
  const visitedUser = router.asPath.split("/")[1];
  const dispatch = useDispatch();
  const [userTopics, setUserTopics] = useState([]);
  const user = useSelector((state) => state.auth.user);
  const intl = new Intl.DateTimeFormat("en-US", { dateStyle: "medium" });
  const { questionsAsked, questionsAnswered } = publicUserData;

  useEffect(() => {
    if (!user) return;
    (async () => {
      const userTopics = await getUserFollowedTopics(user.userId);

      setUserTopics(userTopics);
    })();
  }, [user]);

  // When <UserProfile> mounts the visited user will be saved to state, and when <UserProfile> unmounts the visited user will be null
  useEffect(() => {
    dispatch(globalActions.setVisitedUser(visitedUser));
    return () => {
      dispatch(globalActions.setVisitedUser(null));
    };
  }, []);

  const changePasswordHandler = () => {
    router.push("/change-password");
  };

  const deleteAccountHandler = () => {};

  return (
    <div className={classes.container}>
      <div className={classes["user-information"]}>
        <div className={classes.picture}>
          <div className={classes["user-image"]}>
            {publicUserData.imageUrl && (
              <img src={publicUserData.imageUrl} alt="User picture" />
            )}
            {!publicUserData.imageUrl && (
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
          Member since {intl.format(new Date(publicUserData.memberSince))}
        </p>
      </div>

      <div className={classes.sub}>
        {user && (
          <MyFeedInfo
            className={classes.feedInfo}
            userTopicsState={[userTopics, setUserTopics]}
            topicWrapperClass={classes.topicWrapper}
            moreWrapperClass={classes.moreWrapper}
          />
        )}

        {/* user questions */}
        <div className={classes.userQuestions}>
          <div className={classes.info}>
            <h3>{user ? "My questions" : "Questions"}</h3>
            <div className={classes.stats}>
              <div className={classes.stat}>
                <QuestionIcon />
                {questionsAsked.length}
              </div>
            </div>
          </div>

          {questionsAsked.length === 0 && (
            <div className={classes.nothing}>
              <h2>No questions</h2>
              <p>
                {" "}
                {user
                  ? "You have not posted any questions yet."
                  : `${publicUserData.username} has not asked any questions yet.`}
              </p>
            </div>
          )}

          {questionsAsked.length > 0 &&
            questionsAsked.map((questionAsked) => (
              <QuestionItem
                key={questionAsked.uid}
                className={classes.questionItemOverride}
                questionData={questionAsked}
              />
            ))}
        </div>

        {/* user answers */}
        <div className={classes.userAnswers}>
          <div className={classes.info}>
            <h3>{user ? "My answered questions" : `Answered questions`}</h3>

            <div className={classes.stats}>
              <div className={classes.stat}>
                <ReplyIcon />
                {questionsAnswered.length}
              </div>
            </div>
          </div>

          {questionsAnswered.length === 0 && (
            <div className={classes.nothing}>
              <h2>No answers</h2>
              <p>
                {" "}
                {user
                  ? "You have not posted any answers yet."
                  : `${publicUserData.username} has not answered any questions yet.`}
              </p>
            </div>
          )}

          {questionsAnswered.length > 0 &&
            questionsAnswered.map((questionAnswered) => (
              <QuestionItem
                key={questionAnswered.uid}
                className={classes.questionItemOverride}
                questionData={questionAnswered}
              />
            ))}
        </div>

        {user && (
          <div className={classes.btns}>
            <SecondaryButton onClick={changePasswordHandler}>
              Change password
            </SecondaryButton>
            <SecondaryButton
              className={classes.deleteAccount}
              onClick={deleteAccountHandler}
            >
              Delete account
            </SecondaryButton>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
