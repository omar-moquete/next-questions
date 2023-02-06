import React, { useEffect, useState } from "react";
import QuestionItem from "../question-item/QuestionItem";
import AnswerItem from "./answer-item/AnswerItem";
import classes from "./QuestionDetails.module.scss";

// 1) ON PAGE LOAD: The data gets fetched in the server and gets returned through props.
const QuestionDetails = function ({ questionData, questionAnswers }) {
  // hasNoAnswers will be false if questionAnswers is empty.
  const [hasAnswers, setHasAnswers] = useState(
    questionAnswers.length > 0 ? true : false
  );

  // 2) ON PAGE LOAD: answers is initialized with the data received from props. This allows for the question answers to be loaded server-side. See step 4.
  const [answersState, setAnswersState] = useState(questionAnswers);

  useEffect(() => {
    if (answersState.length > 0) setHasAnswers(true);
    else setHasAnswers(false);
  }, [answersState]);
  return (
    <div className={classes.container}>
      <div className={classes.border}>
        {/* 3) ON PAGE LOAD: QuestionItem is rendered with the information received from props */}
        <QuestionItem
          className={classes["question-item-override"]}
          questionData={questionData}
          initWithForm={!hasAnswers}
          // A) ON ReplyForm Submission: The answersState passed to questionItem gets set by QuestionItem>ReplyForm internally to the data ReplyForm collects from the user. When this data is set, QuestionDetails re-evaluates and outputs a new list of answers.

          // This is helpful because it prevents the use of a database listener, preventing unnecessary reads when we already know the data that will be posted to the database since we send it. The reply time on post is calculated by returning the current date from Date constructor.

          answersState={[answersState, setAnswersState]}
        />
        {/* Show a message if the question has no answers. */}
        <ul className={classes["answers-container"]}>
          {!hasAnswers && (
            <div className={classes.nothing}>
              <h2>No answers yet</h2>
              <p>Start the conversation</p>
            </div>
          )}

          {/* 4) A list of answers is generated using the answers state (step 2) which is loaded by getStaticProps for the questionUid in the path*/}
          {answersState.map((answer) => (
            <AnswerItem
              key={answer.uid}
              answeredBy={answer.answeredBy}
              date={answer.date}
              text={answer.text}
              answerUid={answer.uid}
              questionUid={questionData.uid}
              // Each answer hold its own replies data.
              answerReplies={answer.replies}
            />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default QuestionDetails;
