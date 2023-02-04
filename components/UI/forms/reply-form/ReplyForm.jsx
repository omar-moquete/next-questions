import React from "react";
import classes from "./ReplyForm.module.scss";
import TextareaAutosize from "react-textarea-autosize";
import SecondaryButton from "../../buttons/SecondaryButton";
import useDatabase from "../../../../hooks/useDatabase";
import { useRef } from "react";
import { useState } from "react";
import InlineSpinner from "../../inline-spinner/InlineSpinner";

const ReplyForm = function ({
  unmounter,
  placeholder,
  dataState,
  questionUid = null,
  answerUid = null,
}) {
  const inputRef = useRef();
  const database = useDatabase();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const text = inputRef.current.value;
    const [data, setData] = dataState;

    // If answerUid is not passed but questionUid is, this means that the replyForm is opened in an answer and it's going to post an answer. The logic is that only questionUid needed to post an answer.
    if (questionUid && !answerUid) {
      const postedAnswer = await database.answer(text, questionUid);
      setData([postedAnswer, ...data]);
      unmounter();
    }

    // If questionUid is not passed but answerUid is, this means that the replyForm is opened in an answer and it's going to post an answer. The logic is that only answerUid needed to post an answer, because answers is a separate collection in the db
    if (questionUid && answerUid) {
      const text = inputRef.current.value;
      // post a new reply to questions/questionUid/answers/answerUid/replies
      const postedReply = await database.reply(text, answerUid);
      setData([postedReply, ...data]);
      unmounter();
    }
  };

  const onCancel = (e) => {
    e.preventDefault();
    unmounter();
  };
  return (
    <form className={classes.container} onSubmit={onSubmit}>
      <TextareaAutosize
        minRows={3}
        className={classes.textarea}
        placeholder={placeholder}
        ref={inputRef}
        required
      />
      <div className={classes.controls}>
        {isSubmitting && (
          <InlineSpinner
            color="#005c97"
            height="32px"
            width="32px"
            className={classes.spinner}
          />
        )}
        {!isSubmitting && (
          <>
            <SecondaryButton onClick={onCancel}>Cancel</SecondaryButton>
            <SecondaryButton>Post</SecondaryButton>
          </>
        )}
      </div>
    </form>
  );
};

export default ReplyForm;