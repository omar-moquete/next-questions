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
      const improvedTopicData = {
        ...topicData,
        author: user.username,
        date: serverTimestamp(),
      };
      const topicsCollectionRef = collection(db, "/topics");
      const docRef = await addDoc(topicsCollectionRef, improvedTopicData);
      return docRef.id;
    } catch (error) {
      console.error(`useDatabase@createTopic()🚨${error}`);
    }
  }

  async function createQuestion(questionData) {
    const improvedQuestionData = {
      ...questionData,
      askedBy: user.username,
      date: serverTimestamp(),
    };

    try {
      // 1) get a collection reference to /questions
      const questionsCollectionRef = collection(db, "/questions");

      // 2) add document to collection
      const questionDocRef = await addDoc(
        questionsCollectionRef,
        improvedQuestionData
      );

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
        collection(
          db,
          `/topics/${improvedQuestionData.topic.uid}/questionsAsked`
        ),
        { uid: questionDocRef.id }
      );

      // Allows for imperative navigation to questions/questionId
      return questionDocRef.id;
    } catch (error) {
      console.error(`useDatabase@createQuestion()🚨${error}`);
    }
  }

  // TODO: Move get functions to getStaticProps
  async function getQuestionDetails(questionUid) {
    // const questionDetails = {
    //   authorData: {
    //     imageUrl: "",
    //   },
    //   questionData: {
    //     title: "",
    //     description: "",
    //     topic: { uid: "" },
    //     timestamp: {},
    //     askedBy: "",
    //     likes: undefined,
    //     answers: undefined,
    //   },
    // };

    // 1) find the question data with the uid
    const questionDocumentRef = await getDoc(
      doc(db, `/questions/${questionUid}`)
    );

    const questionData = questionDocumentRef.data();
    // 2) find the user that asked the question and get the imageUrl
    const authorData = await getUserDataWithUsername(questionData.askedBy);

    const questionDetails = {
      authorData: { imageUrl: authorData.imageUrl },
      questionData,
    };

    return questionDetails;
  }

  async function getUserDataWithUsername(username) {
    // [ ]TODO: reuse collection refs
    const usersCollectionRef = collection(db, "/users");
    // find where usernames field in /users === username argument
    const queryRef = query(
      usersCollectionRef,
      where("username", "==", username)
    );
    const querySnapshot = await getDocs(queryRef);
    const match = [];
    querySnapshot.forEach((user) => match.push(user.data()));
    const [userData] = match;
    return userData;
  }

  async function getTopicInfoWithTopicUid(topicUid) {
    const topicDocRef = await getDoc(db, `/topics/${topicUid}`);
    return topicDocRef.data();
  }

  async function answer(text, questionUid) {
    const data = {
      answeredBy: user.username,
      text,
      date: serverTimestamp(),
    };

    const answerRef = await addDoc(collection(db, `/answers`), data);

    // Add answer to questionUid.answers[] collection. This way it can be retrieved using the questionUid only.
    const questionsCollection = collection(
      db,
      `/questions/${questionUid}/answers/`
    );
    addDoc(questionsCollection, { uid: answerRef.id });

    return { ...data, date: new Date().toISOString(), uid: answerRef.id };
  }

  // questionUid -> answers[
  // answer1,
  // answer2: [
  // replies: [answerRef2] <- keep ref to answer
  // ],
  // ]

  async function reply(text, answerUid) {
    const data = {
      answer: answerUid,
      repliedBy: user.username,
      text,
      date: serverTimestamp(),
    };

    const docRef = await addDoc(
      collection(db, `/answers/${answerUid}/replies`),
      data
    );

    return { ...data, uid: docRef.uid, date: new Date().toISOString() };
  }
  return {
    createTopic,
    createQuestion,
    getQuestionDetails,
    getUserDataWithUsername,
    getTopicInfoWithTopicUid,
    answer,
    reply,
  };
};

export default useDatabase;
