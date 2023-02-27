import React, { useEffect, useRef, useState } from "react";
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
import { getUserFollowedTopics, uploadProfileImage } from "../../db";
import QuestionItem from "../question-item/QuestionItem";
import CameraIcon from "../UI/svg/CameraIcon";
import Portal from "../UI/Portal";
import Modal1 from "../UI/modals/Modal1";
import SelectedImageNameDisplayer from "./SelectedImageNameDisplayer";
import InlineSpinner from "../UI/inline-spinner/InlineSpinner";
import { authActions } from "../../redux-store/authSlice";

const UserProfile = function ({ publicUserData }) {
  const router = useRouter();
  const visitedUser = router.asPath.split("/")[1];
  const dispatch = useDispatch();
  const [userTopics, setUserTopics] = useState([]);
  const user = useSelector((state) => state.auth.user);
  const intl = new Intl.DateTimeFormat("en-US", { dateStyle: "medium" });
  const { questionsAsked, questionsAnswered } = publicUserData;

  const fileInputRef = useRef();

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

  const [imageChangeActive, setImageChangeActive] = useState(false);
  const [showImageUploadModal, setShowImageUploadModal] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [loadingNewImage, setLoadingNewImage] = useState(false);

  const imageSelectionHandler = async () => {
    const [file] = fileInputRef.current.files;
    setSelectedFileName(file.name);
  };

  const imageUploadHandler = async () => {
    try {
      setLoadingNewImage(true);
      const [file] = fileInputRef.current.files;
      const imageUrl = await uploadProfileImage(file);
      dispatch(authActions.setImageUrl(imageUrl));
      setLoadingNewImage(false);
      setShowImageUploadModal(false);
    } catch (error) {
      console.error(error);
    }
  };

  const changePasswordHandler = () => {
    router.push("/change-password");
  };

  const deleteAccountHandler = () => {};

  const isViewedUserTheLoggedInUser = () => {
    return user !== null && user.username === publicUserData.username;
  };
  return (
    <div className={classes.container}>
      <div className={classes["user-information"]}>
        <div className={classes.picture}>
          <div className={classes["user-image"]}>
            {user !== null && router.asPath.split("/")[1] === user.username && (
              <div
                className={`${classes.newImageOverlay} ${
                  imageChangeActive
                    ? classes.newImageOverlayActive
                    : classes.newImageOverlayInactive
                }`}
                onMouseEnter={() => {
                  setImageChangeActive(true);
                }}
                onMouseLeave={() => {
                  setImageChangeActive(false);
                }}
                onClick={() => {
                  imageChangeActive && setShowImageUploadModal(true);
                }}
              >
                <CameraIcon />
              </div>
            )}

            {/* If no user, the img is not tied to a state. Allowing the image to be viewed by anyone. */}
            {publicUserData.imageUrl && user === null && (
              <img src={publicUserData.imageUrl} alt="User picture" />
            )}

            {/* If user and viewing user's profile page, the image will be tied to a state in case it changes. */}
            {user !== null &&
              router.asPath.split("/")[1] === user.username &&
              user.imageUrl && <img src={user.imageUrl} alt="User picture" />}
            {!publicUserData.imageUrl && user === null && (
              <AvatarIllustration className={classes.avatar} />
            )}
            {!publicUserData.imageUrl && user && !user.imageUrl && (
              <AvatarIllustration className={classes.avatar} />
            )}
          </div>

          <Portal show={showImageUploadModal}>
            <input
              type="file"
              ref={fileInputRef}
              onChange={imageSelectionHandler}
              accept="image/png, image/gif, image/jpeg"
              style={{ display: "none" }}
            />
            <Modal1 title="Upload image">
              <div
                className={`${classes.chooseImage} ${
                  selectedFileName
                    ? classes.chooseImageActive
                    : classes.chooseImageInactive
                }`}
              >
                <SecondaryButton
                  onClick={() => {
                    // This allows the change handler of the input file to execute. This is needed to allow for a styled "Choose image" button
                    fileInputRef.current.click();
                  }}
                >
                  Choose image
                </SecondaryButton>
                <SelectedImageNameDisplayer
                  fileName={selectedFileName}
                  onUnmount={() => {
                    setSelectedFileName("");
                  }}
                />
              </div>

              <div className={classes.controls}>
                <SecondaryButton
                  onClick={() => {
                    setShowImageUploadModal(false);
                  }}
                >
                  Cancel
                </SecondaryButton>
                <SecondaryButton
                  className={`${classes.uploadBtn} ${
                    loadingNewImage ? classes.uploadBtnDisabled : ""
                  }`}
                  onClick={() => {
                    imageUploadHandler();
                  }}
                  disabled={loadingNewImage}
                >
                  {loadingNewImage && (
                    <InlineSpinner height={24} color="#005c97" />
                  )}
                  {!loadingNewImage && "Upload"}
                </SecondaryButton>
              </div>
            </Modal1>
          </Portal>
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
        {isViewedUserTheLoggedInUser() && (
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
            <h3>
              {isViewedUserTheLoggedInUser() ? "My questions" : "Questions"}
            </h3>
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
                {isViewedUserTheLoggedInUser()
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
            <h3>
              {isViewedUserTheLoggedInUser()
                ? "My answered questions"
                : `Answered questions`}
            </h3>

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
                {isViewedUserTheLoggedInUser()
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

        {isViewedUserTheLoggedInUser() && (
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
