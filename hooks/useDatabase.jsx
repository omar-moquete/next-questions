import { useState } from "react";
import { initializeApp } from "firebase/app";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { useCallback } from "react";
import { useSelector } from "react-redux";
import { firebaseConfig } from "../api/firebaseApp";

const useDatabase = function () {
  // Memoize db
  const init = useCallback(() => {
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    return db;
  }, []);

  const db = init();

  const user = useSelector((state) => state.auth.user);

  // apis
  async function createTopic(topicData) {
    try {
      topicData.author = user.username;
      topicData.timestamp = serverTimestamp();

      const topicsCollectionRef = collection(db, "/topics");

      const docRef = await addDoc(topicsCollectionRef, topicData);

      console.log("added data: ", (await getDoc(docRef)).data());

      return docRef.id;
    } catch (error) {
      console.error(`useDatabase@createTopic()🚨${error}`);
    }
  }

  async function createQuestion(questionData) {
    questionData.askedBy = user.username;
    questionData.timestamp = serverTimestamp();
    try {
      // 1) get a collection reference to /questions
      const questionsCollectionRef = collection(db, "/questions");

      // 2) add document to collection
      const questionDocRef = await addDoc(questionsCollectionRef, questionData);

      // 3) get a collection reference to /users/loggedInUserId/questionsAsked
      const userQuestionsCollectioRef = collection(
        db,
        `/users/${user.userId}/questionsAsked`
      );

      // 4) add a database reference for the user: {uid: questionUid} to the previous reference
      await addDoc(userQuestionsCollectioRef, {
        uid: questionDocRef.id,
      });

      // 5) add a questionUid reference: {uid: questionUid} to the question topic in /topics
      await addDoc(
        collection(db, `/topics/${questionData.topic.uid}/questionsAsked`),
        { uid: questionDocRef.id }
      );

      // Allows for imperative navigation to questions/questionId
      return questionDocRef.id;
    } catch (error) {
      console.error(`useDatabase@createQuestion()🚨${error}`);
    }
  }

  return {
    createTopic,
    createQuestion,
  };
};

export default useDatabase;
