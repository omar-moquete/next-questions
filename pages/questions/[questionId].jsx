import { useRouter } from "next/router";
import React from "react";
import Loading from "../../components/loading/Loading";
import QuestionDetails from "../../components/question-details/QuestionDetails";
import {
  getAllQuestions,
  getQuestionWithUid,
  getUserImageUrlWithUsername,
} from "../../_TEST_DATA";

const QuestionDetailsPage = function ({ questionData, imageUrl, username }) {
  const router = useRouter();

  // During the first time this page is requested:
  // 1) router.isFallback will be true
  // 2) This component is ran on the server and returns <Loading/>.
  // 4) A server rendered page with <Loading/> is served.
  // 5) NextJS will run getStaticProps in the server.
  // 6) After it finishes running, the component is ran again serverside, but this time with the data returned from getStaticProps (fetched data) and router.isFallback set to false.
  // 7) The new pre-rendered page is then served to the browser.

  if (router.isFallback) {
    return <Loading />;
  }
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
  // If no questions were found with context.params.questionId, an object with a notFound property set to true is returned. This will ensure that the 404 error page is shown. This is necessary when using on demand static page generation (fallback: true without static paths).
  if (questionData.length < 1)
    return {
      notFound: true,
    };

  const imageUrl = getUserImageUrlWithUsername(questionData.askedBy);
  const username = questionData.askedBy;

  // NOTE: questionData, imageUrl and questionUid are sent through component props from: getStaticProps -> QuestionDetailsPage -> QuestionDetails -> QuestionItem

  return {
    props: { questionData, imageUrl, username },
  };
};

export const getStaticPaths = function () {
  return {
    paths: [],
    // Pages are pre-rendered on request while a spinner loader is shown.
    // getStaticProps runs in the background when using fallback: true
    fallback: true,
  };
};
