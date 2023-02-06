import { initializeApp } from "firebase/app";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  where,
  orderBy,
} from "firebase/firestore";

import { useRouter } from "next/router";
import React from "react";
import { firebaseConfig } from "../../api/firebaseApp";
import Loading from "../../components/loading/Loading";
import QuestionDetails from "../../components/question-details/QuestionDetails";

const QuestionDetailsPage = function ({
  questionAuthorData,
  questionData,
  questionAnswers,
}) {
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
      questionAnswers={questionAnswers}
    />
  );
};

export default QuestionDetailsPage;

export const getStaticProps = async function (context) {
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const questionUidRequested = context.params.questionId;

  const getUserDataWithUsername = async (username) => {
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
  };

  const getQuestionDetails = async (questionUid) => {
    const questionDocumentRef = await getDoc(
      doc(db, `/questions/${questionUid}`)
    );

    const questionData = questionDocumentRef.data();
    // 2) find the user that asked the question and get the imageUrl
    const questionAuthor = await getUserDataWithUsername(questionData.askedBy);

    const questionDetails = {
      questionAuthorData: { imageUrl: questionAuthor.imageUrl },
      questionData,
    };

    return questionDetails;
  };

  const getTopicInfoWithTopicUid = async (topicUid) => {
    const topicDocRef = await getDoc(doc(db, `/topics/${topicUid}`));
    const topicData = { ...topicDocRef.data(), uid: topicDocRef.id };
    return topicData;
  };

  const getLikes = async (questionUid) => {
    const likesCollectionRef = collection(
      db,
      `/questions/${questionUid}/likes`
    );

    const docsRef = await getDocs(likesCollectionRef);
    const docsData = [];
    docsRef.forEach((docRef) => docsData.push(docRef.data()));
    return docsData;
  };

  const getQuestionAnswers = async (questionUid) => {
    // 1) Get all data in questions/questionUid/answers (list of uids of all the answers listed under the question)
    const answersQuerySnapshot = await getDocs(
      collection(db, `/questions/${questionUid}/answers`)
    );

    const questionAnswers = [];
    answersQuerySnapshot.forEach((document) =>
      questionAnswers.push({ ...document.data() })
    );

    // This is an array of promises because array.map does not await its callback function..
    const allQuestionAnswersRefsPromises = questionAnswers.map(
      async (answer) => {
        // Get /answers/answerUid for each answerUid
        const answerDocRef = await getDoc(doc(db, `/answers/${answer.uid}`));

        // Get /answers/answerUid/replies for each answerUid
        const repliesDocRefs = await getDocs(
          collection(db, `/answers/${answer.uid}/replies`)
        );

        return {
          answerDocRef,
          repliesDocRefs,
        };
      }
    );

    const allQuestionAnswersRefs = await Promise.all(
      allQuestionAnswersRefsPromises
    );

    const docsData = allQuestionAnswersRefs.map(
      ({ answerDocRef, repliesDocRefs }) => {
        const answersDocRefData = answerDocRef.data();
        const repliesDocRefsData = [];

        repliesDocRefs.forEach((repliesDocRef) => {
          repliesDocRefsData.push(repliesDocRef.data());
        });

        // Convert to date string each firebase timestamp for current answer
        answersDocRefData.date = new Date(
          answersDocRefData.date.toDate()
        ).toISOString();
        // Must add answerUid in order to post a reply to it.
        answersDocRefData.uid = answerDocRef.id;

        // Convert to date string each firebase timestamp for replies in current answer
        repliesDocRefsData.forEach(
          (replyDocRefData) =>
            (replyDocRefData.date = new Date(
              replyDocRefData.date.toDate()
            ).toISOString())
        );

        const result = {
          ...answersDocRefData,
          replies: repliesDocRefsData.reverse(),
        };

        return result;
      }
    );

    return docsData;
  };

  // question data
  const questionDetails = await getQuestionDetails(questionUidRequested);

  questionDetails.questionData.date = new Date(
    questionDetails.questionData.date.toDate()
  ).toISOString();

  // topic data
  const topicData = await getTopicInfoWithTopicUid(
    questionDetails.questionData.topic.uid
  );

  // question answers
  const questionAnswers = await getQuestionAnswers(questionUidRequested);

  // question likes
  const likes = await getLikes(questionUidRequested);

  likes.forEach(
    (like) => (like.date = new Date(like.date.toDate()).toISOString())
  );

  // questionAnswers.map(async (questionAnswer) => {
  //   // const replies = await getAnswerReplies(questionAnswer.uid);
  //   //Get replies

  //   const date = new Date(questionAnswer.date.toDate()).toISOString();

  //   return { ...questionAnswer, replies, date };
  // });

  // If no questions were found with context.params.questionId, an object with a notFound property set to true is returned. This will ensure that the 404 error page is shown. This is necessary when using on demand static page generation (fallback: true without static paths).
  if (!questionDetails)
    return {
      notFound: true,
    };

  // NOTE: questionData, imageUrl and questionUid are sent through component props from: getStaticProps -> QuestionDetailsPage -> QuestionDetails -> QuestionItem

  const props = {
    // Add uid to question data. Used in component.
    questionData: {
      ...questionDetails.questionData,
      uid: context.params.questionId,
      topic: { uid: topicData.uid, title: topicData.title },
      // Extract imageUrl only.
      questionAuthorData: {
        imageUrl: questionDetails.questionAuthorData.imageUrl,
      },

      likes,
    },

    // An array containing all the answers for the questionUid in path. Each question in the array has an array of replies.
    questionAnswers,
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
