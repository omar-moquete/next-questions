import React, { useEffect, useRef, useState } from "react";
import classes from "./UserProfile.module.scss";
import SecondaryButton from "../UI/buttons/SecondaryButton";
import QuestionIcon from "../UI/svg/QuestionIcon";
import ReplyIcon from "../UI/svg/ReplyIcon";
import { useDispatch, useSelector } from "react-redux";
import About from "./about/About";
import { useRouter } from "next/router";
import { globalActions } from "../../redux-store/globalSlice";
import MyFeedInfo from "../my-feed-info/MyFeedInfo";
import {
  deleteProfileImage,
  getUserAnsweredQuestions,
  getUserAskedQuestions,
  getUserFollowedTopics,
  uploadProfileImage,
} from "../../db";
import QuestionItem from "../question-item/QuestionItem";
import CameraIcon from "../UI/svg/CameraIcon";
import Portal from "../UI/Portal";
import Modal1 from "../UI/modals/Modal1";
import SelectedImageNameDisplayer from "./SelectedImageNameDisplayer";
import InlineSpinner from "../UI/inline-spinner/InlineSpinner";
import { authActions } from "../../redux-store/authSlice";
import DeleteAccountButton from "../UI/buttons/DeleteAccountButton";
import UserImage from "./UserImage";

const UserProfile = function ({ publicUserData }) {
  const router = useRouter();
  const visitedUser = router.asPath.split("/")[1];
  const dispatch = useDispatch();
  const [userTopics, setUserTopics] = useState(null);
  const user = useSelector((state) => state.auth.user);
  const intl = new Intl.DateTimeFormat("en-US", { dateStyle: "medium" });
  // Questions asked start being fetch after initial profile UI is loaded. Improves user experience
  const [questionsAsked, setQuestionsAsked] = useState(null);
  const [questionsAnswered, setQuestionsAnswered] = useState(null);

  const fileInputRef = useRef();

  useEffect(() => {
    if (!user) return;
    // Three async functions IFEE's will ensure each component receives data when it arrives and is updated accordingly.
    (async () => {
      const userTopics = await getUserFollowedTopics(user.userId);
      setUserTopics(userTopics);
    })();
    (async () => {
      const questionsAsked = await getUserAskedQuestions(publicUserData.userId);
      setQuestionsAsked(questionsAsked);
    })();

    (async () => {
      const questionsAnswered = await getUserAnsweredQuestions(
        publicUserData.userId
      );

      // // The initial value is "new Map()", which initially we get as the accumulator in the first iteration of questionsAnswered. On each iteration we call map.set(key, value) where key is the current question uid and the value is the question itself.

      // // The set() method of the map prototype ADDS or UPDATES an entry in a Map object with a specified key and a value. If we add a value to the map that was already there, it will be replaced and not added again.

      // // .reduce returns the result of the operation which will be the last value of the accumulator. In this case it will be the last state of the Map after questionsAnswered is fully iterrated..

      // // Before the result of calling .reduce is stored in questionsAnsweredFiltered, we call Map.values() on the this result. The values() method returns a new iterator object (of type [Map iterator]) that contains the values for each element in the Map object in insertion order. This map iterator is then converted to an array with the help of the spread operator.

      const questionsAnsweredFiltered = [
        ...questionsAnswered
          .reduce(
            (map, currentItem) => map.set(currentItem.uid, currentItem),
            new Map()
          )
          .values(),
      ];

      setQuestionsAnswered(questionsAnsweredFiltered);
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
  const [deletingImage, setDeletingImage] = useState(false);

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

  const deleteImageHandler = async () => {
    setDeletingImage(true);
    await deleteProfileImage(user.userId);
    // set user.imageUrl to null so UI is updated
    dispatch(authActions.setImageUrl(null));
    setDeletingImage(false);
    setShowImageUploadModal(false);
  };

  const changePasswordHandler = () => {
    router.push("/change-password");
  };

  const deleteAccountHandler = async () => {
    router.push(`/${user.username}/delete-account`);
  };

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

            <UserImage imageUrl={publicUserData.imageUrl} />
          </div>

          <Portal show={showImageUploadModal}>
            <input
              type="file"
              ref={fileInputRef}
              onChange={imageSelectionHandler}
              accept="image/png, image/gif, image/jpeg"
              style={{ display: "none" }}
            />
            <Modal1 title="My profile image">
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

                <SecondaryButton onClick={deleteImageHandler}>
                  {deletingImage && (
                    <div className={classes.initialSpinner}>
                      <InlineSpinner height={24} color="#005c97" />
                    </div>
                  )}

                  {!deletingImage && "Delete profile image"}
                </SecondaryButton>
                <SecondaryButton
                  className={`${
                    !selectedFileName || loadingNewImage
                      ? classes.uploadBtnDisabled
                      : ""
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
              <p>{questionsAsked?.length || "..."}</p>
            </div>
            <div>
              <ReplyIcon className={classes["answer-icon"]} />
              <p>{questionsAnswered?.length || "..."}</p>
            </div>
          </div>
        </div>

        {/* If visited user is current user, show about section even if empty, so that it can be modified by the user. */}

        {/* If there is about or the user is the logged in user */}
        {publicUserData.about ||
        user?.username === router.asPath.split("/")[1] ? (
          <About
            initialText={publicUserData.about}
            notEditingPlaceholder="Add a short description about yourself."
            editingPlaceholder="Start typing..."
          />
        ) : (
          ""
        )}

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
                {questionsAsked?.length || "..."}
              </div>
            </div>
          </div>
          {questionsAsked === null && (
            <div className={classes.initialSpinner}>
              <InlineSpinner height={32} color="#fff" />
            </div>
          )}
          {questionsAsked !== null && (
            <>
              {questionsAsked.length === 0 && (
                <div className={classes.nothing}>
                  <h2>No questions</h2>
                  <p>
                    {" "}
                    {isViewedUserTheLoggedInUser() ? (
                      "You have not posted any questions yet."
                    ) : (
                      <span>
                        <em className={classes.bold}>
                          {publicUserData.username}
                        </em>{" "}
                        has not asked any questions yet.
                      </span>
                    )}
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
            </>
          )}
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
                {questionsAnswered?.length || "..."}
              </div>
            </div>
          </div>

          {questionsAnswered === null && (
            <div className={classes.initialSpinner}>
              <InlineSpinner height={32} color="#fff" />
            </div>
          )}
          {questionsAnswered !== null && (
            <>
              {questionsAnswered.length === 0 && (
                <div className={classes.nothing}>
                  <h2>No answers</h2>
                  <p>
                    {" "}
                    {isViewedUserTheLoggedInUser() ? (
                      "You have not posted any answers yet."
                    ) : (
                      <span>
                        <em className={classes.bold}>
                          {publicUserData.username}
                        </em>{" "}
                        has not answered any questions yet.
                      </span>
                    )}
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
            </>
          )}
        </div>

        {isViewedUserTheLoggedInUser() && (
          <div className={classes.btns}>
            <SecondaryButton onClick={changePasswordHandler}>
              Change password
            </SecondaryButton>
            <DeleteAccountButton onClick={deleteAccountHandler} />
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
