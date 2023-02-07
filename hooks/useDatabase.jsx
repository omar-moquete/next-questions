import { initializeApp } from "firebase/app";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { firebaseConfig } from "../api/firebaseApp";

// NOTE: This custom hook controls database POST requests.
const useDatabase = function () {
  const router = useRouter();
  const user = useSelector((state) => state.auth.user);
  // Memoize db
  const init = useCallback(() => {
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    return db;
  }, []);
  const db = init();

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
      unixTimestamp: +new Date(),
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

  // [x]TODO: Move get functions to getStaticProps
  // async function getQuestionDetails(questionUid) {
  //   // const questionDetails = {
  //   //   authorData: {
  //   //     imageUrl: "",
  //   //   },
  //   //   questionData: {
  //   //     title: "",
  //   //     description: "",
  //   //     topic: { uid: "" },
  //   //     timestamp: {},
  //   //     askedBy: "",
  //   //     likes: undefined,
  //   //     answers: undefined,
  //   //   },
  //   // };

  //   // 1) find the question data with the uid
  //   const questionDocumentRef = await getDoc(
  //     doc(db, `/questions/${questionUid}`)
  //   );

  //   const questionData = questionDocumentRef.data();
  //   // 2) find the user that asked the question and get the imageUrl
  //   const authorData = await getUserDataWithUsername(questionData.askedBy);

  //   const questionDetails = {
  //     authorData: { imageUrl: authorData.imageUrl },
  //     questionData,
  //   };

  //   return questionDetails;
  // }

  // async function getUserDataWithUsername(username) {
  //   // [ ]TODO: reuse collection refs
  //   const usersCollectionRef = collection(db, "/users");
  //   // find where usernames field in /users === username argument
  //   const queryRef = query(
  //     usersCollectionRef,
  //     where("username", "==", username)
  //   );
  //   const querySnapshot = await getDocs(queryRef);
  //   const match = [];
  //   querySnapshot.forEach((user) => match.push(user.data()));
  //   const [userData] = match;
  //   return userData;
  // }

  // async function getTopicInfoWithTopicUid(topicUid) {
  //   const topicDocRef = await getDoc(db, `/topics/${topicUid}`);
  //   return topicDocRef.data();
  // }

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

  async function like(questionUid) {
    // 1) To like a question the user must be logged in. If user is not logged in, redirect to login page.

    if (!user) {
      router.push("/login");
      return;
    }
    const likesCollectionRef = collection(
      db,
      `/questions/${questionUid}/likes`
    );
    // 2) Get likes for the question
    const likesDocRefs = await getDocs(likesCollectionRef);

    const likes = [];
    const currentUserLikeForQuestion = {
      likedByUser: false,
      likeUid: "",
      data: null, // used to update the current doc in db.
    };

    likesDocRefs.forEach((like) => {
      const docRefData = like.data();
      const likeData = {
        ...docRefData,
        date: (docRefData.date = new Date(
          docRefData.date.toDate()
        ).toISOString()),
      };
      // 3) Check if user already liked (if username is contained in any of the likes docs).
      if (likeData.likedBy === user.username) {
        currentUserLikeForQuestion.likedByUser = true;
        currentUserLikeForQuestion.likeUid = like.id;
        currentUserLikeForQuestion.data = likeData;
      }
      likes.push(likeData);
    });

    // 3) Like question if user has not liked
    if (!currentUserLikeForQuestion.likedByUser) {
      // If not liked by user, add like
      await addDoc(likesCollectionRef, {
        date: serverTimestamp(),
        likedBy: user.username,
      });
    } else {
      // if liked by user remove like
      await deleteDoc(
        doc(
          db,
          `/questions/${questionUid}/likes/${currentUserLikeForQuestion.likeUid}`
        )
      );
    }

    const updatedLikes = await getLikes(questionUid);
    // Convert Firebase timestamp to date object
    updatedLikes.forEach(
      (like) => (like.date = new Date(like.date.toDate()).toISOString())
    );
    return updatedLikes;
  }

  async function getLikes(questionUid) {
    const likesCollectionRef = collection(
      db,
      `/questions/${questionUid}/likes`
    );

    const docsRef = await getDocs(likesCollectionRef);
    const docsData = [];
    docsRef.forEach((docRef) => docsData.push(docRef.data()));
    return docsData;
  }

  async function getTopicsWithQuery(query) {
    if (!query) return [];
    const topicsCollectionRef = collection(db, "/topics");
    const topicsDocsRef = await getDocs(topicsCollectionRef);
    const topics = [];
    topicsDocsRef.forEach((docRef) => {
      const docRefData = docRef.data();
      if (docRefData.title.toLowerCase().startsWith(query.toLowerCase())) {
        // add uid
        docRefData.uid = docRef.id;
        docRefData.date = new Date(docRefData.date.toDate()).toISOString();
        topics.push(docRefData);
      }
    });

    // add questionsAsked
    for (let i = 0; i < topics.length; i++) {
      // add questionsAsked
      const questionsAsked = [];
      const questionsAskedQueryRef = await getDocs(
        collection(db, `/topics/${topics[i].uid}/questionsAsked`)
      );
      questionsAskedQueryRef.forEach((docRef) =>
        questionsAsked.push(docRef.data())
      );
      topics[i].questionsAsked = questionsAsked;
    }

    return topics;
  }
  return {
    createTopic,
    createQuestion,
    answer,
    reply,
    like,
    getLikes,
    getTopicsWithQuery,
  };
};

export default useDatabase;
