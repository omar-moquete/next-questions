import React from "react";
import QuestionDetails from "../../components/question-details/QuestionDetails";
import {
  getQuestionWithUid,
  getUserImageUrlWithUsername,
} from "../../_TEST_DATA";

const QuestionDetailsPage = function ({ questionData, imageUrl, username }) {
  return (
    <QuestionDetails
      questionData={questionData}
      imageUrl={imageUrl}
      username={username}
    />
  );
};

export default QuestionDetailsPage;

export const getStaticProps = function (context) {
  const questionUid = context.params.questionId;
  const questionData = getQuestionWithUid(questionUid);
  const imageUrl = getUserImageUrlWithUsername(questionData.askedBy);
  const username = questionData.askedBy;

  // NOTE: questionData, imageUrl and questionUid are sent through component props from: getStaticProps -> QuestionDetailsPage -> QuestionDetails -> QuestionItem
  return {
    props: { questionData, imageUrl, username },
  };
};

export const getStaticPaths = function () {
  return {
    paths: [{ params: { questionId: "q1" } }, { params: { questionId: "q2" } }],
    fallback: false,
  };
};
