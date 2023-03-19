import { initializeApp } from "firebase/app";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import React, { useRef, useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import ReactTextareaAutosize from "react-textarea-autosize";
import { firebaseConfig } from "../../../api/firebaseApp";
import { saveAboutUser } from "../../../db";
import SecondaryButton from "../../UI/buttons/SecondaryButton";
import EditIcon from "../../UI/svg/EditIcon";
import classes from "./About.module.scss";

const About = function ({
  initialText,
  editingPlaceholder = "",
  notEditingPlaceholder = "",
}) {
  const [isEditing, setIsEditing] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const inputareaRef = useRef();
  const [text, setText] = useState(initialText);
  const visitedUser = useSelector((state) => state.global.visitedUser);

  const handleCancelEdit = () => setIsEditing(false);

  const handleSave = () => {
    // Update about for user in db
    const text = inputareaRef.current.value;
    saveAboutUser(text);
    // Will locally update the text so that no more db fetches are needed.
    setText(text);
    setIsEditing(false);
  };

  const handleIconClick = () => {
    setIsEditing(true);
  };

  useEffect(() => {
    if (isEditing) inputareaRef.current.value = text;
  }, [isEditing]);

  return (
    <div className={classes.about}>
      <div className={classes["label-and-icon"]}>
        <label htmlFor="about">About me</label>
        {!isEditing && user && <EditIcon onClick={handleIconClick} />}
      </div>

      {/* The <pre> component will be rendered if there is text and if the visited user is the logged in user (handled in <UserProfile>)*/}
      {!isEditing && (
        <pre>
          {text || (
            <p className={classes.notEditingPlaceholder}>
              {notEditingPlaceholder}
            </p>
          )}
        </pre>
      )}
      {isEditing && user?.username === visitedUser && (
        <>
          <ReactTextareaAutosize
            className={classes.autosize}
            ref={inputareaRef}
            maxLength={500}
            placeholder={editingPlaceholder}
          />

          <div className={classes.controls}>
            <SecondaryButton onClick={handleCancelEdit}>Cancel</SecondaryButton>
            <SecondaryButton onClick={handleSave}>Save</SecondaryButton>
          </div>
        </>
      )}
    </div>
  );
};

export default About;
