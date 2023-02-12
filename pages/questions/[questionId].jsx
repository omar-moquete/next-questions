import { useRouter } from "next/router";
import React from "react";
import Loading from "../../components/loading/Loading";
import QuestionDetails from "../../components/question-details/QuestionDetails";
import {
  getLikes,
  getQuestionAnswers,
  getQuestionDetails,
  getTopicInfoWithTopicUidLite,
} from "../../db";

const QuestionDetailsPage = function ({ questionData }) {
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

  return <QuestionDetails questionData={questionData} />;
};

export default QuestionDetailsPage;

export const getStaticProps = async function (context) {
  const questionUidRequested = context.params.questionId;
  // question data
  const questionData = await getQuestionDetails(questionUidRequested);

  // If no questions were found with context.params.questionId, an object with a notFound property set to true is returned. This will ensure that the 404 error page is shown. This is necessary when using on demand static page generation (fallback: true without static paths).
  if (!questionData)
    return {
      notFound: true,
    };

  // NOTE: questionData, imageUrl and questionUid are sent through component props from: getStaticProps -> QuestionDetailsPage -> QuestionDetails -> QuestionItem

  const props = {
    // Add uid to question data. Used in component.
    questionData,
  };

  return {
    props,
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
