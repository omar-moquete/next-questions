import { initializeApp } from "firebase/app";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  limit,
  query,
  where,
} from "firebase/firestore";
import React from "react";
import { firebaseConfig } from "../api/firebaseApp";
import Home from "../components/home/Home";
import { getLatestQuestions } from "../db";

const HomePage = function ({ latestQuestions }) {
  return <Home latestQuestionsData={latestQuestions} />;
};

export default HomePage;

export const getStaticProps = async function () {
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  const latestQuestions = await getLatestQuestions(5);
  const props = {
    latestQuestions,
  };

  return {
    props,
  };
};
