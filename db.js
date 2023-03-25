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
  updateDoc,
  where,
} from "firebase/firestore";

import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
} from "firebase/storage";
import { firebaseConfig } from "./api/firebaseApp";
import { DELETED_USER_USERNAME } from "./app-config";
import store from "./redux-store/store";

// NOTE: These functions control database requests.
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

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

    await Promise.all([
      // 4) add a database reference for the user: {uid: questionUid} to the previous reference
      addDoc(userQuestionsCollectioRef, {
        uid: questionDocRef.id,
      }),
      // 5) add a questionUid reference: {uid: questionUid} to the question topic in /topics
      addDoc(
        collection(
          db,
          `/topics/${improvedQuestionData.topic.uid}/questionsAsked`
        ),
        { uid: questionDocRef.id }
      ),
    ]);

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
    if (querySnapshot.empty)
      return { username: DELETED_USER_USERNAME, imageUrl: null };

    let userData = null;
    querySnapshot.forEach((user) => (userData = user.data()));
    return userData;
  } catch (error) {
    console.error(`@getUserDataWithUsername()🚨${error}`);
  }
};

export const getTopicInfoWithTopicUid = async function (topicUid) {
  try {
    const [topicDocRef, questionsAskedQuerySnapshot] = await Promise.all([
      getDoc(doc(db, `/topics/${topicUid}`)),
      getDocs(collection(db, `/topics/${topicUid}/questionsAsked`)),
    ]);

    const topicDocRefData = topicDocRef.data();
    const questionsAsked = [];
    questionsAskedQuerySnapshot.forEach((docRef) =>
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
    const questionsCollectionRef = collection(
      db,
      `/questions/${questionUid}/answers/`
    );

    addDoc(questionsCollectionRef, {
      uid: answerRef.id,
    });

    // Add question to user answered questions
    const questionsAnsweredCollectionRef = collection(
      db,
      `/users/${user.userId}/questionsAnswered`
    );

    addDoc(questionsAnsweredCollectionRef, { uid: questionUid });
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
    if (!user) throw new Error("No user found in state");
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
    // This returned data is used to display the new reply. The reply state will be set to this. This function (reply()) is called on ReplyForm submission for a reply.

    const postedReply = {
      ...data,
      replyAuthorData: { imageUrl: user.imageUrl, username: user.username },
      uid: docRef.id,
      date: new Date().toISOString(),
      likes: [],
      answers: [],
    };

    return postedReply;
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

    // Get total likes
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

export const likeReply = async function (answerUid, replyUid) {
  try {
    const user = store.getState().auth.user;
    // 1) Get collection reference
    const likesCollectionRef = collection(
      db,
      `/answers/${answerUid}/replies/${replyUid}/likes`
    );
    // 2) Get likes for the reply
    const likesDocRefs = await getDocs(likesCollectionRef);

    const likes = [];
    const currentUserLikeForReply = {
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
        currentUserLikeForReply.likedByUser = true;
        currentUserLikeForReply.likeUid = like.id;
        currentUserLikeForReply.data = likeData;
      }
      likes.push(likeData);
    });

    // 3) Like question if user has not liked
    if (!currentUserLikeForReply.likedByUser) {
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
          `/answers/${answerUid}/replies/${replyUid}/likes/${currentUserLikeForReply.likeUid}`
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
    console.error(`@likeReply()🚨${error}`);
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

export const getAnswerLikes = async function (answerUid) {
  try {
    const likesCollectionRef = collection(db, `/answers/${answerUid}/likes`);
    const docsRef = await getDocs(likesCollectionRef);
    const docsData = [];
    docsRef.forEach((docRef) => {
      const data = docRef.data();
      docsData.push({ ...data, uid: docRef.id });
    });
    return docsData;
  } catch (error) {
    console.error(`@getAnswerLikes()🚨${error}`);
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

    // Running promises in parallel
    const [topicData, questionAnswers, questionLikes] = await Promise.all([
      // * To add topic data
      getTopicInfoWithTopicUidLite(questionDetails.topic.uid),
      // ** To add answers data
      getQuestionAnswers(questionUid),
      // ***To get likes for question
      getQuestionLikes(questionUid),
    ]);

    // *
    topicData.date = new Date(topicData.date.toDate()).toISOString();

    // **
    // get likes and imageUrl for answers
    for (let i = 0; i < questionAnswers.length; i++) {
      const [answerLikes, answerAuthorData] = await Promise.all([
        getAnswerLikes(questionAnswers[i].uid),
        getUserDataWithUsername(questionAnswers[i].answeredBy),
      ]);

      answerLikes.forEach(
        (like) => (like.date = new Date(like.date.toDate()).toISOString())
      );

      // add imageUrl
      questionAnswers[i].answerAuthorData = {
        imageUrl: answerAuthorData.imageUrl,
      };
      questionAnswers[i].likes = answerLikes;
    }
    // ***
    questionLikes.forEach(
      (like) => (like.date = new Date(like.date.toDate()).toISOString())
    );

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

    // get replies likes
    for (let i1 = 0; i1 < preparedData.questionAnswers.length; i1++) {
      for (
        let i2 = 0;
        i2 < preparedData.questionAnswers[i1].replies.length;
        i2++
      ) {
        const replyLikeRefs = await getDocs(
          collection(
            db,
            `/answers/${preparedData.questionAnswers[i1].uid}/replies/${preparedData.questionAnswers[i1].replies[i2].uid}/likes`
          )
        );

        const replyLikesRefData = [];
        replyLikeRefs.forEach((docRef) => {
          const data = docRef.data();
          replyLikesRefData.push({
            ...data,
            date: new Date(data.date.toDate()).toISOString(),
          });
        });

        preparedData.questionAnswers[i1].replies[i2].likes = replyLikesRefData;
      }

      // Sort by posted time.
      preparedData.questionAnswers[i1].replies.sort((a, b) => {
        if (+new Date(a.date) > +new Date(b.date)) return 1;
        else if (+new Date(a.date) < +new Date(b.date)) return -1;
        else return 0;
      });
    }

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
      const [
        topicRef,
        userDataQuerySnapshot,
        answersQuerySnapshot,
        likesDocsRef,
      ] = await Promise.all([
        getDoc(doc(db, `/topics/${latestQuestionsData[i].topic.uid}`)),
        getDocs(
          query(
            collection(db, `/users`),
            where("username", "==", latestQuestionsData[i].askedBy)
          )
        ),

        getDocs(
          collection(db, `/questions/${latestQuestionsData[i].uid}/answers`)
        ),
        getDocs(
          collection(db, `/questions/${latestQuestionsData[i].uid}/likes`)
        ),
      ]);

      // 1)
      const topicRefData = topicRef.data();
      latestQuestionsData[i].topic = topicRefData;
      latestQuestionsData[i].topic.uid = topicRef.id;
      latestQuestionsData[i].topic.date = new Date(
        latestQuestionsData[i].topic.date.toDate()
      ).toISOString();

      // 2)
      // add imageUrl. Only 1 result returns from querySnapshot.forEach. If no result, add {imageUrl: null}. This will automatically be set to the avatar image for each question.
      if (!userDataQuerySnapshot.empty)
        userDataQuerySnapshot.forEach((docRef) => {
          latestQuestionsData[i].questionAuthorData = {
            imageUrl: docRef.data().imageUrl,
          };
        });
      else
        latestQuestionsData[i].questionAuthorData = {
          imageUrl: null,
        };

      // 3)
      const answers = [];
      answersQuerySnapshot.forEach((docRef) => answers.push(docRef.data()));
      latestQuestionsData[i].questionAnswers = answers;

      // 4)
      const likes = [];
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
      const [likes, askedByUserData, answersQuerySnapshot, newTopicData] =
        await Promise.all([
          // 1) Add likes
          getQuestionLikes(questions[i].uid),

          // 2) Add author information
          getUserDataWithUsername(questions[i].askedBy),

          // 3) add answers (light version. Only QuestionDetails page needs the full version)
          getDocs(collection(db, `/questions/${questions[i].uid}/answers`)),

          // 4) Add topic information
          getTopicInfoWithTopicUid(questions[i].topic.uid),
        ]);
      // 1)
      questions[i].likes = likes;

      // 2)
      questions[i].questionAuthorData = {
        imageUrl: askedByUserData.imageUrl,
      };

      // 3)
      const answers = [];
      answersQuerySnapshot.forEach((docRef) => answers.push(docRef.data()));
      questions[i].questionAnswers = answers;

      // 4)
      questions[i].topic = newTopicData;
    }
    return questions;
  } catch (error) {
    console.error(`@getQuestionsWithTopicUid()🚨${error}`);
  }
};

export const getQuestionsWithTopicUids = async function (topicUids) {
  try {
    const resultsPromises = [];
    for (let i = 0; i < topicUids.length; i++) {
      const questionsPromise = getQuestionsWithTopicUid(topicUids[i]);
      resultsPromises.push(questionsPromise);
    }

    const results = await Promise.all(resultsPromises);

    return results.flat();
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

    const followedTopicsDataPromises = [];
    for (let i = 0; i < followedTopicsRefsData.length; i++) {
      const followedTopicDataPromise = getTopicInfoWithTopicUid(
        followedTopicsRefsData[i].uid
      );

      followedTopicsDataPromises.push(followedTopicDataPromise);
    }

    const followedTopicsData = await Promise.all(followedTopicsDataPromises);

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

      const [topic, likes] = await Promise.all([
        // Add topic data
        getTopicInfoWithTopicUid(questions[i].topic.uid),
        // add likes
        getQuestionLikes(questions[i].uid),
      ]);

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

    // This is an array of promises because array.map does not await its callback function.
    const allQuestionAnswersRefsPromises = questionAnswers.map(
      async (answer) => {
        const [answerDocRef, repliesDocRefs] = await Promise.all([
          // Get /answers/answerUid for each answerUid
          getDoc(doc(db, `/answers/${answer.uid}`)),
          // Get /answers/answerUid/replies for each answerUid
          getDocs(collection(db, `/answers/${answer.uid}/replies`)),
        ]);

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
          const data = repliesDocRef.data();
          repliesDocRefsData.push({ ...data, uid: repliesDocRef.id });
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

export const uploadProfileImage = async function (file) {
  try {
    const user = store.getState().auth.user;
    if (!user) throw new Error("No user found in state");
    // Stores the user image and returns a URL to this resource in the cloud.
    const imageRef = ref(storage, `/PUBLIC_USER_PROFILE_IMAGES/${user.userId}`);
    await uploadBytes(imageRef, file);
    const imageUrl = await getDownloadURL(imageRef);
    // Save image url to user in db
    updateDoc(doc(db, `/users/${user.userId}`), { imageUrl });
    return imageUrl;
  } catch (error) {
    console.error(`@uploadProfilePicture()🚨${error}`);
  }
};

export const deleteProfileImage = async function (userId) {
  try {
    if (!userId) throw new Error(`"${userId}" is not a valid user ID.`);
    // Delete user image from cloud storage
    const imageRef = ref(storage, `/PUBLIC_USER_PROFILE_IMAGES/${userId}`);

    await Promise.all([
      // Delete from firebase storage
      await deleteObject(imageRef),
      // Set to null in DB from db
      await updateDoc(doc(db, `/users/${userId}`), { imageUrl: null }),
    ]);
  } catch (error) {
    console.error(`@deleteProfileImage()🚨${error}`);
  }
};

export const deleteUserData = async function (user) {
  // NOTE: Step 1.Delete user.questionsAnswered and user.questionsAsked, user.followedTopics. lastly, delete entire user collection
  const questionsAnsweredQueryPromise = getDocs(
    query(collection(db, `/users/${user.userId}/questionsAnswered`))
  );
  const questionsAskedQueryPromise = getDocs(
    query(collection(db, `/users/${user.userId}/questionsAsked`))
  );
  const followedTopicsQueryPromise = getDocs(
    query(collection(db, `/users/${user.userId}/followedTopics`))
  );

  // Running promises in parallel
  const queriesResults = await Promise.all([
    questionsAnsweredQueryPromise,
    questionsAskedQueryPromise,
    followedTopicsQueryPromise,
  ]);

  const [
    questionsAnsweredQueryResult,
    questionsAskedQueryResult,
    followedTopicsQueryResult,
  ] = queriesResults;

  // In order for the user to be fully removed from the users collection, this deletions must happen. This is because subcollections are not automatically deleted.
  questionsAnsweredQueryResult.forEach((docRef) => deleteDoc(docRef.ref));
  questionsAskedQueryResult.forEach((docRef) => {
    deleteDoc(docRef.ref);
  });
  followedTopicsQueryResult.forEach((docRef) => {
    deleteDoc(docRef.ref);
  });

  // Lastly, delete entire user collection in users/userId in db
  await deleteDoc(doc(db, `/users/${user.userId}`));
  // NOTE: End step 1

  // NOTE: Step 2. Replace user username in questions collection
  // Replace questions/quiestionUid and questions/questionUid/likes/likedBy with DELETED_USER_USERNAME.
  const questionsCollectionRef = collection(db, "/questions");

  const questionQueryRef = query(
    questionsCollectionRef,
    where("askedBy", "==", user.username)
  );

  const questionsQuerySnapshot = await getDocs(questionQueryRef);
  questionsQuerySnapshot.forEach(async (docRef) => {
    // Not awaited to save execution time
    updateDoc(docRef.ref, { askedBy: DELETED_USER_USERNAME });
  });
  // NOTE: End step 2

  // NOTE: Step 3. Replace likedBy if like was by user in all questions matched.
  const querySnapshot = await getDocs(questionsCollectionRef);

  querySnapshot.forEach(async (docRef) => {
    const likesCollectionQuery = query(
      collection(db, `/questions/${docRef.id}/likes`),
      where("likedBy", "==", user.username)
    );

    (await getDocs(likesCollectionQuery)).forEach((docRef) =>
      updateDoc(docRef.ref, {
        likedBy: DELETED_USER_USERNAME,
      })
    );
  });
  // NOTE: End step 3.

  // NOTE: Step 4. Replace user username in answers collection with DELETED_USER_USERNAME
  // 1) Replace answers/answerUid > {answeredBy: to DELETED_USER_USERNAME}
  const answersCollectionRef = collection(db, "/answers");

  const answersQueryRef = query(
    answersCollectionRef,
    where("answeredBy", "==", user.username)
  );

  const answersQuerySnapshot = await getDocs(answersQueryRef);

  answersQuerySnapshot.forEach(async (answerDocRef) => {
    // Not awaited to run faster
    updateDoc(answerDocRef.ref, { answeredBy: DELETED_USER_USERNAME });
    // Likes collection under answers
    const likesCollection = collection(db, `/answers/${answerDocRef.id}/likes`);
    const likesDocs = await getDocs(likesCollection);
    likesDocs.forEach((likeDocRef) =>
      updateDoc(likeDocRef.ref, { likedBy: DELETED_USER_USERNAME })
    );

    // Replies collection under answers
    const repliesCollection = collection(
      db,
      `/answers/${answerDocRef.id}/replies`
    );

    const repliesDocs = await getDocs(repliesCollection);

    repliesDocs.forEach((replyDocRef) => {
      const replyData = replyDocRef.data();
      // If mention is username, update mention too, else only update repliedBy

      if (replyData.mention === user.username)
        updateDoc(replyDocRef.ref, {
          repliedBy: DELETED_USER_USERNAME,
          mention: DELETED_USER_USERNAME,
        });
      else updateDoc(replyDocRef.ref, { repliedBy: DELETED_USER_USERNAME });
    });
  });
  // NOTE: End step 4

  // NOTE: Step 5. Replace user username in topics/author
  const topicsCollectionRef = collection(db, "/topics");

  const topicsQueryRef = query(
    topicsCollectionRef,
    where("author", "==", user.username)
  );

  const topicsSnapshot = await getDocs(topicsQueryRef);

  topicsSnapshot.forEach((docRef) =>
    // Not awaited to save execution time
    updateDoc(docRef.ref, { author: DELETED_USER_USERNAME })
  );
  // NOTE: End step 5

  // NOTE: Step 6. Delete user image
  //  Can throw an error if the imageRef does not exists. This is not a problen since we only want to delete the image if it exists. Not awaited to
  if (user.imageUrl)
    deleteObject(ref(storage, `/PUBLIC_USER_PROFILE_IMAGES/${user.userId}`));
  // NOTE: End step 6
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
    return !querySnapshot.empty;
  } catch (error) {
    console.error(`@isUserFollowingTopic()🚨${error}`);
  }
};

export const followTopic = async function (topicUid) {
  try {
    if (!topicUid) throw new Error("Invalid topic uid.");
    const user = store.getState().auth.user;
    if (!user) throw new Error("No user found in state");
    const userTopics = await getUserFollowedTopics(user.userId);
    // Check if topic is already followed.
    if (userTopics.some((userTopicUid) => userTopicUid === topicUid)) return;
    await addDoc(collection(db, `/users/${user.userId}/followedTopics/`), {
      uid: topicUid,
    });
  } catch (error) {
    console.error(`@followTopic()🚨${error}`);
  }
};

export const unfollowTopic = async function (topicUid) {
  try {
    if (!topicUid) throw new Error("Invalid topic uid.");
    const user = store.getState().auth.user;
    if (!user) throw new Error("No user found in state");

    // This function queries for a document A that contains a document B where document field "uid" is equal to topicUid. This is because document A unique ID is created by firebase in followTopic() and this uid is untracked.
    const queryRef = query(
      collection(db, `/users/${user.userId}/followedTopics`),
      where("uid", "==", topicUid)
    );

    const querySnapshot = await getDocs(queryRef);
    let docRefToDelete = null;
    querySnapshot.forEach((docRef) => (docRefToDelete = docRef));
    await deleteDoc(
      doc(db, `/users/${user.userId}/followedTopics/${docRefToDelete.id}`)
    );
  } catch (error) {
    console.error(`@unfollowTopic()🚨${error}`);
  }
};

export const getQuestionDetailsLite = async function (questionUid) {
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

    const [topicData, answersQuerySnapshot, questionLikes] = await Promise.all([
      // add topic data
      getTopicInfoWithTopicUidLite(questionDetails.topic.uid),
      // Get answers for question
      getDocs(collection(db, `/questions/${questionUid}/answers`)),
      // get likes for question
      getQuestionLikes(questionUid),
    ]);

    topicData.date = new Date(topicData.date.toDate()).toISOString();

    const questionAnswers = [];
    answersQuerySnapshot.forEach((docRef) =>
      questionAnswers.push({ ...docRef.data() })
    );

    questionLikes.forEach(
      (like) => (like.date = new Date(like.date.toDate()).toISOString())
    );

    const preparedData = {
      ...questionDetails,
      topic: topicData,
      questionAnswers,
      likes: questionLikes,
    };

    return preparedData;
  } catch (error) {
    console.error(`@getQuestionDetailsLite()🚨${error}`);
  }
};

export const getUserAskedQuestions = async function (userId) {
  try {
    //BUG: optimize
    const queryRef = query(collection(db, `/users/${userId}/questionsAsked`));

    const docsRefs = await getDocs(queryRef);
    const userQuestionUids = [];

    docsRefs.forEach((docRef) => userQuestionUids.push(docRef.data().uid));

    const questions = [];
    for (let i = 0; i < userQuestionUids.length; i++) {
      const question = await getQuestionDetailsLite(userQuestionUids[i]);
      questions.push(question);
    }
    return questions;
  } catch (error) {
    console.error(`@getUserAskedQuestions()🚨${error}`);
  }
};

export const getUserAnsweredQuestions = async function (userId) {
  try {
    const queryRef = query(
      collection(db, `/users/${userId}/questionsAnswered`)
    );
    const docsRefs = await getDocs(queryRef);

    const userQuestionsAnsweredUids = [];
    docsRefs.forEach((docRef) =>
      userQuestionsAnsweredUids.push(docRef.data().uid)
    );

    const questions = [];
    for (let i = 0; i < userQuestionsAnsweredUids.length; i++) {
      const question = await getQuestionDetailsLite(
        userQuestionsAnsweredUids[i]
      );

      questions.push(question);
    }

    return questions;
  } catch (error) {
    console.error(`@getUserAnsweredQuestions()🚨${error}`);
  }
};

export const getPublicUserData = async function (username) {
  // get public user information using username.

  try {
    // Query for user basic info
    const queryRef = query(
      collection(db, "/users"),
      where("username", "==", username)
    );

    const querySnapshot = await getDocs(queryRef);

    // Return null if no user was found
    if (querySnapshot.empty) return null;

    let publicUserData = {};
    // Only one result, only one iteration.
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      publicUserData = {
        ...data,
        memberSince: new Date(data.memberSince.toDate()).toISOString(),
      };
    });

    return publicUserData;
  } catch (error) {
    console.error(`@getPublicUserData()🚨${error}`);
  }
};

export const saveAboutUser = async function (about) {
  try {
    const user = store.getState().auth.user;
    if (!user) throw new Error("No user found in state");

    await updateDoc(doc(db, `/users/${user.userId}`), { about });
  } catch (error) {
    console.error(`@saveAboutUser()🚨${error}`);
  }
};

export const getPrivateUserData = async function (userId) {
  try {
    if (typeof userId !== "string")
      throw new Error(`Expected type string but received "${userId}"`);
    return await getDoc(doc(db, `/private_user_data/${userId}`));
  } catch (error) {
    console.error(`@saveAboutUser()🚨${error}`);
  }
};
