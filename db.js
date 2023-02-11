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
  where,
} from "firebase/firestore";
import { firebaseConfig } from "./api/firebaseApp";
import store from "./redux-store/store";

// NOTE: These functions control database requests.
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const user = store.getState().auth.user;

export const createTopic = async function (topicData) {
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
    console.error(`@createTopic()🚨${error}`);
  }
};

export const createQuestion = async function (questionData) {
  try {
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

export const answer = async function (text, questionUid) {
  try {
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
  } catch (error) {
    console.error(`@answer()🚨${error}`);
  }
};

export const reply = async function (text, answerUid) {
  try {
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
  } catch (error) {
    console.error(`@reply()🚨${error}`);
  }
};

export const like = async function (questionUid) {
  try {
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

    const updatedLikes = await getLikes(questionUid);
    // Convert Firebase timestamp to date object
    updatedLikes.forEach(
      (like) => (like.date = new Date(like.date.toDate()).toISOString())
    );
    return updatedLikes;
  } catch (error) {
    console.error(`@like()🚨${error}`);
  }
};

export const getLikes = async function (questionUid) {
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
    console.error(`@getLikes()🚨${error}`);
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
      questionAuthorData: { imageUrl: questionAuthor.imageUrl },
      questionData,
    };

    return questionDetails;
  } catch (error) {
    console.error(`@getQuestionDetails()🚨${error}`);
  }
};

export const getQuestionAnswers = async function (questionUid) {
  try {
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
  } catch (error) {
    console.error(`@getQuestionAnswers()🚨${error}`);
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
      // Add likes
      const likes = await getLikes(questions[i].uid);
      questions[i].likes = likes;

      // Add author information
      const askedByUserData = await getUserDataWithUsername(
        questions[i].askedBy
      );
      questions[i].questionAuthorData = {
        imageUrl: askedByUserData.imageUrl,
      };

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

      // Add topic data
      const topic = await getTopicInfoWithTopicUid(questions[i].topic.uid);

      // add likes
      const likes = await getLikes(questions[i].uid);

      questions[i].questionAuthorData = questionAuthorData;
      questions[i].topic = topic;
      questions[i].likes = likes;
    }

    return questions;
  } catch (error) {
    console.error(`@getAllQuestions()🚨${error}`);
  }
};
