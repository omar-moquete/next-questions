import { initializeApp } from "firebase/app";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  limit,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { firebaseConfig } from "./api/firebaseApp";
import store from "./redux-store/store";

// NOTE: These functions control database requests.
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const createTopic = async function (topicData) {
  try {
    const user = store.getState().auth.user;
    const improvedTopicData = {
      ...topicData,
      author: user.username,
      date: serverTimestamp(),
    };
    const topicsCollectionRef = collection(db, "/topics");
    const docRef = await addDoc(topicsCollectionRef, improvedTopicData);
    return docRef.id;
  } catch (error) {
    console.error(`@createTopic()🚨${error}`);
  }
};

export const createQuestion = async function (questionData) {
  try {
    const user = store.getState().auth.user;
    const improvedQuestionData = {
      ...questionData,
      askedBy: user.username,
      date: serverTimestamp(),
      unixTimestamp: +new Date(),
    };

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
    console.error(`@createQuestion()🚨${error}`);
  }
};

export const getUserDataWithUsername = async function (username) {
  try {
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
  } catch (error) {
    console.error(`@getUserDataWithUsername()🚨${error}`);
  }
};

export const getTopicInfoWithTopicUid = async function (topicUid) {
  try {
    const topicDocRef = await getDoc(doc(db, `/topics/${topicUid}`));
    const topicDocRefData = topicDocRef.data();

    // Add questionsAsked
    const questionsAskedQueryRef = query(
      collection(db, `/topics/${topicUid}/questionsAsked`)
    );

    const questionsAsked = [];
    (await getDocs(questionsAskedQueryRef)).forEach((docRef) =>
      questionsAsked.push(docRef.data())
    );

    return {
      ...topicDocRefData,
      uid: topicDocRef.id,
      date: new Date(topicDocRefData.date.toDate()).toISOString(),
      questionsAsked,
    };
  } catch (error) {
    console.error(`@getTopicInfoWithTopicUid()🚨${error}`);
  }
};

export const getTopicInfoWithTopicUidLite = async (topicUid) => {
  try {
    // Returns a lighter version of the topic
    const topicDocRef = await getDoc(doc(db, `/topics/${topicUid}`));
    const topicData = { ...topicDocRef.data(), uid: topicDocRef.id };
    return topicData;
  } catch (error) {
    console.error(`@getTopicInfoWithTopicUidLite()🚨${error}`);
  }
};

export const answer = async function (text, questionUid) {
  try {
    const user = store.getState().auth.user;

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

    return {
      ...data,
      answerAuthorData: { imageUrl: store.getState().auth.user.imageUrl },
      date: new Date().toISOString(),
      uid: answerRef.id,
    };
  } catch (error) {
    console.error(`@answer()🚨${error}`);
  }
};

export const reply = async function (text, answerUid, mention) {
  try {
    const user = store.getState().auth.user;

    const data = {
      answer: answerUid,
      repliedBy: user.username,
      text,
      mention,
      date: serverTimestamp(),
    };

    const docRef = await addDoc(
      collection(db, `/answers/${answerUid}/replies`),
      data
    );
    return {
      ...data,
      uid: docRef.uid,
      date: new Date().toISOString(),
      replyAuthorData: { imageUrl: store.getState().auth.user.imageUrl },
    };
  } catch (error) {
    console.error(`@reply()🚨${error}`);
  }
};

export const likeQuestion = async function (questionUid) {
  try {
    const user = store.getState().auth.user;
    // 1) To like a question the user must be logged in. If user is not logged in, redirect to login page.
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

    const updatedLikes = await getQuestionLikes(questionUid);
    // Convert Firebase timestamp to date object
    updatedLikes.forEach(
      (like) => (like.date = new Date(like.date.toDate()).toISOString())
    );
    return updatedLikes;
  } catch (error) {
    console.error(`@likeQuestion()🚨${error}`);
  }
};

export const getAnswerLikes = async function (answerUid) {
  try {
    const likesCollectionRef = collection(db, `/answers/${answerUid}/likes`);

    const docsRef = await getDocs(likesCollectionRef);
    const docsData = [];
    docsRef.forEach((docRef) => docsData.push(docRef.data()));
    return docsData;
  } catch (error) {
    console.error(`@getAnswerLikes()🚨${error}`);
  }
};

export const likeAnswer = async function (answerUid) {
  try {
    const user = store.getState().auth.user;
    // 1) Get collection reference
    const likesCollectionRef = collection(db, `/answers/${answerUid}/likes`);
    // 2) Get likes for the answer
    const likesDocRefs = await getDocs(likesCollectionRef);

    const likes = [];
    const currentUserLikeForAnswer = {
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
        currentUserLikeForAnswer.likedByUser = true;
        currentUserLikeForAnswer.likeUid = like.id;
        currentUserLikeForAnswer.data = likeData;
      }
      likes.push(likeData);
    });

    // 3) Like question if user has not liked
    if (!currentUserLikeForAnswer.likedByUser) {
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
          `/answers/${answerUid}/likes/${currentUserLikeForAnswer.likeUid}`
        )
      );
    }

    const updatedLikes = await getAnswerLikes(answerUid);
    // Convert Firebase timestamp to date object
    updatedLikes.forEach(
      (like) => (like.date = new Date(like.date.toDate()).toISOString())
    );
    return updatedLikes;
  } catch (error) {
    console.error(`@likeAnswer()🚨${error}`);
  }
};

export const getQuestionLikes = async function (questionUid) {
  try {
    const likesCollectionRef = collection(
      db,
      `/questions/${questionUid}/likes`
    );

    const docsRef = await getDocs(likesCollectionRef);
    const docsData = [];
    docsRef.forEach((docRef) => docsData.push(docRef.data()));
    return docsData;
  } catch (error) {
    console.error(`@getQuestionLikes()🚨${error}`);
  }
};

export const getTopicsWithQuery = async function (query) {
  try {
    if (!query) return [];
    const topicsCollectionRef = collection(db, "/topics");
    const topicsDocsRef = await getDocs(topicsCollectionRef);
    const topics = [];
    topicsDocsRef.forEach((docRef) => {
      const docRefData = docRef.data();
      if (
        docRefData.title
          .trim()
          .toLowerCase()
          .startsWith(query.trim().toLowerCase())
      ) {
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
  } catch (error) {
    console.error(`@getTopicsWithQuery()🚨${error}`);
  }
};

export const getQuestionDetails = async function (questionUid) {
  try {
    const questionDocumentRef = await getDoc(
      doc(db, `/questions/${questionUid}`)
    );

    const questionData = questionDocumentRef.data();
    // 2) find the user that asked the question and get the imageUrl
    const questionAuthor = await getUserDataWithUsername(questionData.askedBy);

    const questionDetails = {
      ...questionData,
      questionAuthorData: { imageUrl: questionAuthor.imageUrl },
      uid: questionUid,
      date: new Date(questionData.date.toDate()).toISOString(),
    };

    // add topic data
    const topicData = await getTopicInfoWithTopicUidLite(
      questionDetails.topic.uid
    );

    topicData.date = new Date(topicData.date.toDate()).toISOString();

    // add answers data
    const questionAnswers = await getQuestionAnswers(questionUid);

    // get likes for question
    const questionLikes = await getQuestionLikes(questionUid);
    questionLikes.forEach(
      (like) => (like.date = new Date(like.date.toDate()).toISOString())
    );

    // get likes and imageUrl for answers
    for (let i = 0; i < questionAnswers.length; i++) {
      const answerLikes = await getAnswerLikes(questionAnswers[i].uid);
      answerLikes.forEach(
        (like) => (like.date = new Date(like.date.toDate()).toISOString())
      );

      // add imageUrl
      const answerAuthorData = await getUserDataWithUsername(
        questionAnswers[i].answeredBy
      );
      questionAnswers[i].answerAuthorData = {
        imageUrl: answerAuthorData.imageUrl,
      };
      questionAnswers[i].likes = answerLikes;
    }

    const preparedData = {
      ...questionDetails,
      topic: topicData,
      questionAnswers,
      likes: questionLikes,
    };

    // Sort first by likes, then by posted time.
    const questionAnswersWithLikes = preparedData.questionAnswers.filter(
      (answer) => answer.likes.length > 0
    );

    questionAnswersWithLikes.sort((a, b) => {
      if (a.likes.length > b.likes.length) return -1;
      else if (a.likes.length < b.likes.length) return 1;
      else return 0;
    });

    const questionAnswersWithoutLikes = preparedData.questionAnswers.filter(
      (answer) => answer.likes.length === 0
    );

    questionAnswersWithoutLikes.sort((a, b) => {
      if (+new Date(a.date) > +new Date(b.date)) return 1;
      else if (+new Date(a.date) < +new Date(b.date)) return -1;
      else return 0;
    });

    const sortedAnswers = [
      ...questionAnswersWithLikes,
      ...questionAnswersWithoutLikes,
    ];

    preparedData.questionAnswers = sortedAnswers;

    // NOTE: Needs work. Enable replies to get likes.
    // for (let i = 0; i < sortedAnswers.length; i++) {
    //   console.log("sortedAnswers[i].replies", sortedAnswers[i].replies);
    //   const repliesWithLikes = sortedAnswers[i].replies.filter(
    //     (reply) => reply.likes?.length > 0
    //   );

    // const repliesWithoutLikes = sortedAnswers[i].replies.filter(
    //   (reply) => reply.likes?.length === 0
    // );

    // repliesWithLikes.sort((a, b) => {
    //   if (a.likes.length > b.likes.length) return -1;
    //   else if (a.likes.length < b.likes.length) return 1;
    //   else return 0;
    // });

    // repliesWithoutLikes.sort((a, b) => {
    //   if (+new Date(a.date) > +new Date(b.date)) return 1;
    //   else if (+new Date(a.date) < +new Date(b.date)) return -1;
    //   else return 0;
    // });

    // const sortedReplies = [...repliesWithLikes, ...repliesWithoutLikes];

    // preparedData.questionAnswers[i].replies = sortedReplies;
    // }

    return preparedData;
  } catch (error) {
    console.error(`@getQuestionDetails()🚨${error}`);
  }
};

export const getLatestQuestions = async function (daysAgo, resultsLimit = 15) {
  const secondsInOneDay = 86_400;
  const daysAgoInSeconds = secondsInOneDay * daysAgo;
  const daysAgoInNanoSeconds = daysAgoInSeconds * 1000;
  try {
    const queryRef = query(
      collection(db, "/questions"),
      where("unixTimestamp", ">=", Date.now() - daysAgoInNanoSeconds),
      limit(resultsLimit)
    );

    const querySnapshot = await getDocs(queryRef);
    const latestQuestionsData = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      latestQuestionsData.push({
        ...data,
        uid: doc.id,
        date: new Date(data.date.toDate()).toISOString(),
      });
    });

    for (let i = 0; i < latestQuestionsData.length; i++) {
      // add topic
      const topicRef = await getDoc(
        doc(db, `/topics/${latestQuestionsData[i].topic.uid}`)
      );
      const topicRefData = topicRef.data();
      latestQuestionsData[i].topic = topicRefData;
      latestQuestionsData[i].topic.uid = topicRef.id;
      latestQuestionsData[i].topic.date = new Date(
        latestQuestionsData[i].topic.date.toDate()
      ).toISOString();

      // add questionAuthorData
      const userDataQuerySnapshot = await getDocs(
        query(
          collection(db, `/users`),
          where("username", "==", latestQuestionsData[i].askedBy)
        )
      );

      // add imageUrl. Only 1 result returns from querySnapshot.forEach
      userDataQuerySnapshot.forEach((docRef) => {
        latestQuestionsData[i].questionAuthorData = {
          imageUrl: docRef.data().imageUrl || null,
        };
      });

      // add answers (light version. Only QuestionDetails page needs the full version)
      const queryRef = query(
        collection(db, `/questions/${latestQuestionsData[i].uid}/answers`)
      );

      const querySnapshot = await getDocs(queryRef);
      const answers = [];
      querySnapshot.forEach((docRef) => answers.push(docRef.data()));
      latestQuestionsData[i].questionAnswers = answers;

      // add likes
      const likes = [];
      const likesDocsRef = await getDocs(
        collection(db, `/questions/${latestQuestionsData[i].uid}/likes`)
      );

      likesDocsRef.forEach((likeDocRef) => {
        const likesDocRefData = likeDocRef.data();
        const likeData = {
          ...likesDocRefData,
          date: (likesDocRefData.date = new Date(
            likesDocRefData.date.toDate()
          ).toISOString()),
        };

        likes.push(likeData);
      });

      latestQuestionsData[i].likes = likes;
    }

    return latestQuestionsData;
  } catch (error) {
    console.error(`@getLatestQuestions()🚨${error}`);
  }
};

// export const getQuestionAnswers = async function (questionUid) {
//   // 1) Get all data in questions/questionUid/answers (list of uids of all the answers listed under the question)
//   const answersQuerySnapshot = await getDocs(
//     collection(db, `/questions/${questionUid}/answers`)
//   );

//   const questionAnswers = [];
//   answersQuerySnapshot.forEach((document) =>
//     questionAnswers.push({ ...document.data() })
//   );

//   // This is an array of promises because array.map does not await its callback function..
//   const allQuestionAnswersRefsPromises = questionAnswers.map(async (answer) => {
//     // Get /answers/answerUid for each answerUid
//     const answerDocRef = await getDoc(doc(db, `/answers/${answer.uid}`));

//     // Get /answers/answerUid/replies for each answerUid
//     const repliesDocRefs = await getDocs(
//       collection(db, `/answers/${answer.uid}/replies`)
//     );

//     return {
//       answerDocRef,
//       repliesDocRefs,
//     };
//   });

//   const allQuestionAnswersRefs = await Promise.all(
//     allQuestionAnswersRefsPromises
//   );

//   const docsData = allQuestionAnswersRefs.map(
//     ({ answerDocRef, repliesDocRefs }) => {
//       const answersDocRefData = answerDocRef.data();
//       const repliesDocRefsData = [];

//       repliesDocRefs.forEach((repliesDocRef) => {
//         repliesDocRefsData.push(repliesDocRef.data());
//       });

//       // Convert to date string each firebase timestamp for current answer
//       answersDocRefData.date = new Date(
//         answersDocRefData.date.toDate()
//       ).toISOString();
//       // Must add answerUid in order to post a reply to it.
//       answersDocRefData.uid = answerDocRef.id;

//       repliesDocRefsData.forEach(
//         (replyDocRefData) =>
//           (replyDocRefData.date = new Date(
//             replyDocRefData.date.toDate()
//           ).toISOString())
//       );

//       const result = {
//         ...answersDocRefData,
//         replies: repliesDocRefsData,
//       };

//       return result;
//     }
//   );

//   return docsData;
// };

export const getQuestionsWithTopicUid = async function (topicUid) {
  try {
    const queryRef = query(
      collection(db, `/questions`),
      where("topic.uid", "==", topicUid)
    );

    const querySnapshot = await getDocs(queryRef);
    const questions = [];
    querySnapshot.forEach((docRef) => {
      const docRefData = docRef.data();
      const question = {
        ...docRefData,
        uid: docRef.id,
        date: new Date(docRefData.date.toDate()).toISOString(),
      };
      questions.push(question);
    });

    for (let i = 0; i < questions.length; i++) {
      // Add likes
      const likes = await getQuestionLikes(questions[i].uid);
      questions[i].likes = likes;

      // Add author information
      const askedByUserData = await getUserDataWithUsername(
        questions[i].askedBy
      );
      questions[i].questionAuthorData = {
        imageUrl: askedByUserData.imageUrl,
      };
      // add answers (light version. Only QuestionDetails page needs the full version)
      const queryRef = query(
        collection(db, `/questions/${questions[i].uid}/answers`)
      );

      const querySnapshot = await getDocs(queryRef);
      const answers = [];
      querySnapshot.forEach((docRef) => answers.push(docRef.data()));
      questions[i].questionAnswers = answers;

      // Add topic information
      const newTopicData = await getTopicInfoWithTopicUid(
        questions[i].topic.uid
      );

      questions[i].topic = newTopicData;
    }
    return questions;
  } catch (error) {
    console.error(`@getQuestionsWithTopicUid()🚨${error}`);
  }
};

export const getQuestionsWithTopicUids = async function (topicUids) {
  try {
    const results = [];
    for (let i = 0; i < topicUids.length; i++) {
      const questions = await getQuestionsWithTopicUid(topicUids[i]);
      results.push(questions);
      return results.flat();
    }
  } catch (error) {
    console.error(`@getQuestionsWithTopicUids()🚨${error}`);
  }
};

export const getUserFollowedTopics = async function (userId) {
  try {
    const followedTopicsRef = await getDocs(
      collection(db, `/users/${userId}/followedTopics`)
    );

    const followedTopicsRefsData = [];
    followedTopicsRef.forEach((docRef) =>
      followedTopicsRefsData.push(docRef.data())
    );

    if (followedTopicsRefsData.length === 0) return [];

    const followedTopicsData = [];
    for (let i = 0; i < followedTopicsRefsData.length; i++) {
      const followedTopicData = await getTopicInfoWithTopicUid(
        followedTopicsRefsData[i].uid
      );

      followedTopicsData.push(followedTopicData);
    }
    return followedTopicsData;
  } catch (error) {
    console.error(`@getUserFollowedTopics()🚨${error}`);
  }
};

export const getAllQuestions = async function () {
  try {
    const queryRef = query(collection(db, `/questions`));
    const querySnapshot = await getDocs(queryRef);
    const questions = [];

    querySnapshot.forEach((docRef) => {
      const docRefData = docRef.data();
      const questionData = {
        ...docRefData,
        uid: docRef.id,
        date: new Date(docRefData.date.toDate()).toISOString(),
      };
      questions.push(questionData);
    });

    for (let i = 0; i < questions.length; i++) {
      // Add user data
      const userData = await getUserDataWithUsername(questions[i].askedBy);
      const questionAuthorData = {
        imageUrl: userData.imageUrl,
      };

      // add answers (light version. Only QuestionDetails page needs the full version)
      for (let i = 0; i < questions.length; i++) {
        const queryRef = query(
          collection(db, `/questions/${questions[i].uid}/answers`)
        );

        const querySnapshot = await getDocs(queryRef);
        const answers = [];
        querySnapshot.forEach((docRef) => answers.push(docRef.data()));
        questions[i].questionAnswers = answers;
      }

      // Add topic data
      const topic = await getTopicInfoWithTopicUid(questions[i].topic.uid);

      // add likes
      const likes = await getQuestionLikes(questions[i].uid);

      questions[i].questionAuthorData = questionAuthorData;
      questions[i].topic = topic;
      questions[i].likes = likes;
    }

    return questions;
  } catch (error) {
    console.error(`@getAllQuestions()🚨${error}`);
  }
};

export const getQuestionAnswers = async (questionUid) => {
  try {
    // 1) Get all data in questions/questionUid/answers (list of uids of all the answers listed under the question)
    const answersQuerySnapshot = await getDocs(
      collection(db, `/questions/${questionUid}/answers`)
    );

    const questionAnswers = [];
    // questionAnswers = [
    //   { uid: "abc" },
    //   { uid: "xyz" },
    // ];
    answersQuerySnapshot.forEach((docRef) =>
      questionAnswers.push({ ...docRef.data() })
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
          replies: repliesDocRefsData,
        };

        return result;
      }
    );

    // For loops iterate faster.
    // Add imageUrl to each reply item in docsData[n].replies
    for (let i1 = 0; i1 < docsData.length; i1++) {
      for (let i2 = 0; i2 < docsData[i1].replies.length; i2++) {
        const replyAuthorData = await getUserDataWithUsername(
          docsData[i1].replies[i2].repliedBy
        );
        docsData[i1].replies[i2].replyAuthorData = {
          imageUrl: replyAuthorData.imageUrl,
        };
      }
    }

    docsData.sort((a, b) => {
      if (+new Date(a.date) <= +new Date(b.date)) return 1;
      else return -1;
    });

    docsData.forEach((docData) => {
      docData.replies.sort((a, b) => {
        if (+new Date(a.date) >= +new Date(b.date)) return 1; // sort a after b
        else return -1; // sort b after a
      });
    });

    return docsData;
  } catch (error) {
    console.error(`@getQuestionAnswers()🚨${error}`);
  }
};

export const uploadProfilePicture = async function () {
  try {
  } catch (error) {
    console.error(`@uploadProfilePicture()🚨${error}`);
  }
};

export const getQuestionsWithSearchParam = async function (searchParam) {
  const allQuestions = await getAllQuestions();
  const results = allQuestions.filter((question) =>
    question.title
      .trim()
      .toLowerCase()
      .includes(searchParam.trim().toLowerCase())
  );

  return results;
};

export const isUserFollowngTopic = async function (topicUid) {
  try {
    if (!topicUid) throw new Error("Invalid topic uid.");
    const user = store.getState().auth.user;
    if (!user) throw new Error("No user found in state");

    const queryRef = query(
      collection(db, `/users/${user.userId}/followedTopics`),
      where("uid", "==", topicUid)
    );

    const querySnapshot = await getDocs(queryRef);
    console.log("querySnapshot.empty", querySnapshot.empty);
    return !querySnapshot.empty;
  } catch (error) {
    console.error(`@isUserFollowingTopic()🚨${error}`);
  }
};

export const followTopic = async function (topicUid) {
  try {
    const user = store.getState().auth.user;
    if (!user) throw new Error("No user found in state");
    // TODO: Work on this function
  } catch (error) {
    console.error(`@followTopic()🚨${error}`);
  }
};

export const unfollowTopic = async function (topicUid) {
  try {
    // TODO: Work on this function
    const user = store.getState().auth.user;
    if (!user) throw new Error("No user found in state");
  } catch (error) {
    console.error(`@unfollowTopic()🚨${error}`);
  }
};
