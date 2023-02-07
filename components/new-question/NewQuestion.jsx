import React, { useState } from "react";
import classes from "./NewQuestion.module.scss";
import SecondaryButton from "../UI/buttons/SecondaryButton";
import TopicFinder from "../topic-finder/TopicFinder";
import { useRef } from "react";
import { useSelector } from "react-redux";
import CustomField2 from "../UI/custom-fields/CustomField2";
import { useRouter } from "next/router";
import useDatabase from "../../hooks/useDatabase";
import { useEffect } from "react";

const NewQuestion = function () {
  // 1) user types topic. Topics result shows
  // if user selects an existing topic
  // set existing topic to state

  // if user selects a new topic
  // show topic description box

  // 2) user fills Title or Summary
  // unlock submit button

  // 3) user clicks submit
  // if submit a question in an existing topic
  //add question to db, then add questionUid to that existing topic in db
  // if submit a question with new topic
  // add question to db, then add topic to topics in db
  // lastly route imperatively to questionDetails
  const topicDescriptionRef = useRef();
  const titleRef = useRef();
  const detailsRef = useRef();
  const [blocked, setBlocked] = useState(true);

  const user = useSelector((state) => state.auth.user);
  const [isNewTopic, setIsNewTopic] = useState(false);
  // topic data
  const [newTopicText, setNewTopicText] = useState("");

  const onNewTopic = (text) => {
    setIsNewTopic(true);
    setNewTopicText(text);
    setBlocked(false);
  };

  // if existing topic
  const [existingTopicUid, setExistingTopicUid] = useState("");
  const onExistingTopicSelection = (topicUid) => {
    setIsNewTopic(false);
    setExistingTopicUid(topicUid);
    setBlocked(false);
  };

  const router = useRouter();
  const cancelHandler = (e) => {
    e.preventDefault();
    router.back();
  };

  const database = useDatabase();
  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      // Ensures only one request is sent
      setBlocked(true);
      const title = titleRef.current.value;
      const details = detailsRef.current.value;
      const currentTopic = { uid: existingTopicUid };

      if (isNewTopic) {
        const description = topicDescriptionRef.current.value;

        //1) create topic in db
        const topicData = {
          title: newTopicText,
          description,
          author: user.username,
        };

        currentTopic.uid = await database.createTopic(topicData);
      }

      const questionData = {
        title,
        description: details,
        topic: currentTopic,
      };

      const questionUid = await database.createQuestion(questionData);

      router.replace(`/questions/${questionUid}`);
    } catch (e) {
      console.error(e);
      setBlocked(false);
    }
  };

  const onChange = () => {
    // If user changes topic after selection, reset block
    if (isNewTopic) setIsNewTopic(false);
    if (!blocked) setBlocked(true);
  };

  useEffect(() => {
    if (!router.query.query) return;
    setNewTopicText(router.query.query);
    setIsNewTopic(true);
    setBlocked(false);
  }, []);

  return (
    <div className={classes.container}>
      <form onSubmit={onSubmit}>
        <h2>New question</h2>
        <div className={classes["topic-finder"]}>
          <label>Topic name</label>
          <TopicFinder
            className={classes.topic}
            onSelect={onExistingTopicSelection}
            placeholder="Select or create a new topic"
            onNewTopic={onNewTopic}
            required
            onChange={onChange}
          />
        </div>

        {isNewTopic && (
          <CustomField2
            className={`${classes.field} ${blocked ? classes.inactive : ""}`}
            label="What is this topic about?"
            name="topic-description"
            placeholder="This topic is about..."
            ref={topicDescriptionRef}
            required
          />
        )}

        <CustomField2
          className={`${classes.field} ${blocked ? classes.inactive : ""}`}
          label="Title or summary"
          name="question"
          placeholder="What is the..."
          ref={titleRef}
          required
          disabled={blocked}
        />

        <CustomField2
          className={`${classes.field} ${blocked ? classes.inactive : ""}`}
          afterRenderClass={blocked ? classes.inactive : ""}
          label="Details (optional)"
          name="details"
          minRows={3}
          placeholder="I'm asking this question because I was wondering..."
          ref={detailsRef}
          disabled={blocked}
        />
        <div className={classes.controls}>
          <SecondaryButton onClick={cancelHandler}>Cancel</SecondaryButton>
          <SecondaryButton
            className={`${classes.submit} ${blocked ? classes.inactive : ""}`}
            disabled={blocked}
          >
            Submit
          </SecondaryButton>
        </div>
      </form>
    </div>
  );
};

export default NewQuestion;

// <div className={classes.container}>
// <form>
//   <div className={`${classes.step2} ${classes.active}`}>
//     <h2 className={classes["main-title"]}>Question</h2>

//     <label className={classes.label} htmlFor="title">
//       Title or summary
//     </label>
//     <ReactTextareaAutosize
//       minRows={1}
//       type="text"
//       name="title"
//       placeholder="What is the...?"
//       className={classes.title}
//       // value={title}
//       onChange={(e) => setTitle(e.target.value)}
//       // disabled={currentStep === 2 ? false : true}
//       // ref={titleRef}
//       required
//     />

//     <label className={classes.label} htmlFor="details">
//       Details (optional)
//     </label>
//     <ReactTextareaAutosize
//       minRows={5}
//       name="details"
//       placeholder="For the past few days I've been wondering..."
//       // ref={detailsRef}
//       // disabled={currentStep === 2 ? false : true}
//     />
//   </div>

//   <div className={classes.controls}>
//     <SecondaryButton
//     //  onClick={cancelHandler}
//     >
//       Cancel
//     </SecondaryButton>

//     <SecondaryButton
//       className={`${classes["submit-btn"]} ${classes.active}`}
//       // onClick={handleSubmit}
//     >
//       Submit
//     </SecondaryButton>
//   </div>
// </form>
// </div>
