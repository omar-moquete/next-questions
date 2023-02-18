import React from "react";
import Home from "../components/home/Home";
import { getLatestQuestions } from "../db";

const HomePage = function ({ latestQuestions }) {
  return <Home latestQuestionsData={latestQuestions} />;
};

export default HomePage;

export const getStaticProps = async function () {
  const latestQuestions = await getLatestQuestions(7);
  const props = {
    latestQuestions,
  };

  return {
    props,
  };
};
