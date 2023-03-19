import React from "react";
import classes from "./ReplyForm.module.scss";
import TextareaAutosize from "react-textarea-autosize";
import SecondaryButton from "../../buttons/SecondaryButton";
import { useRef } from "react";
import { useState } from "react";
import { answer, reply } from "../../../../db";
import { useEffect } from "react";
import InlineSpinner2 from "../../inline-spinner/InlineSpinner2";

const ReplyForm = function ({
  unmounter,
  placeholder,
  dataState,
  questionUid = null,
  answerUid = null,
  mention,
  updateAnswersQuantity,
  showReplies, // Show replies updates the UI when an answer reply is posted. This causes all the replies for the answer get displayed including the just posted reply.
}) {
  const inputRef = useRef();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef();

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const text = inputRef.current.value;
    const [data, setData] = dataState;

    // If answerUid is not passed but questionUid is, this means that the replyForm is opened in an answer and it's going to post an answer. The logic is that only questionUid needed to post an answer.
    if (questionUid && !answerUid) {
      const postedAnswer = await answer(text, questionUid);

      setData([postedAnswer, ...data]);
      unmounter();
      updateAnswersQuantity();
    }

    // If questionUid is not passed but answerUid is, this means that the replyForm is opened in an answer and it's going to post an answer. The logic is that only answerUid needed to post an answer, because answers is a separate collection in the db
    if (questionUid && answerUid) {
      const text = inputRef.current.value;
      // post a new reply to questions/questionUid/answers/answerUid/replies

      const postedReply = await reply(text, answerUid, mention);
      const newPostedReply = [...data, postedReply];
      setData(newPostedReply); // Set new data state which allows the UI to update with the old replies plus the just posted reply. Prevents the need to fetch data after posted to the DB.
      showReplies && showReplies(); // Show all replies
      unmounter(); // unmount form
    }
  };

  useEffect(() => {
    if (!formRef) return;
    formRef.current.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
    inputRef && inputRef.current.focus();
  }, []);

  const onCancel = (e) => {
    e.preventDefault();
    unmounter();
  };
  return (
    <form className={classes.container} onSubmit={onSubmit} ref={formRef}>
      <TextareaAutosize
        minRows={3}
        className={classes.textarea}
        placeholder={placeholder}
        ref={inputRef}
        required
      />
      <div className={classes.controls}>
        {isSubmitting && (
          <InlineSpinner2
            width="32px"
            color="#005c97"
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
