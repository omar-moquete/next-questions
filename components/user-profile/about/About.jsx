import { initializeApp } from "firebase/app";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import React, { useRef, useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import ReactTextareaAutosize from "react-textarea-autosize";
import { firebaseConfig } from "../../../api/firebaseApp";
import SecondaryButton from "../../UI/buttons/SecondaryButton";
import EditIcon from "../../UI/svg/EditIcon";
import classes from "./About.module.scss";

const About = function (props) {
  const [isEditing, setIsEditing] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const inputareaRef = useRef();
  const [text, setText] = useState(props.text);
  const visitedUser = useSelector((state) => state.global.visitedUser);

  const handleCancelEdit = () => setIsEditing(false);

  const handleSave = async () => {
    // Update about for user in db
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    const docRef = doc(db, `/users/${user.userId}`);
    await setDoc(
      docRef,
      { about: inputareaRef.current.value },
      { merge: true }
    );
    // Will locally update the text so that no more db fetches are needed.
    setText(inputareaRef.current.value);
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

      {!isEditing && <pre>{text}</pre>}
      {isEditing && user?.username === visitedUser && (
        <>
          <ReactTextareaAutosize
            className={classes.autosize}
            ref={inputareaRef}
            maxLength={500}
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
