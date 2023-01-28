import React from "react";
import classes from "./ReplyForm.module.scss";
import TextareaAutosize from "react-textarea-autosize";
import PrimaryButton from "../../buttons/PrimaryButton";

const ReplyForm = function ({ unmounter, placeholder }) {
  // [ ]TODO: Make full controlled

  return (
    <form className={classes.container}>
      <TextareaAutosize
        minRows={3}
        className={classes.textarea}
        placeholder={placeholder}
      />
      <div>
        <PrimaryButton
          onClick={(e) => {
            e.preventDefault();
            unmounter();
          }}
        >
          Cancel
        </PrimaryButton>
        <PrimaryButton>Post</PrimaryButton>
      </div>
    </form>
  );
};

export default ReplyForm;
