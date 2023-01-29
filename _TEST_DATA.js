export const USER_DATA = [
  {
    uid: "u1",
    username: "the_connoisseur77",
    image:
      "https://media.istockphoto.com/id/1372641621/photo/portrait-of-a-businessman-on-gray-background.jpg?s=612x612&w=is&k=20&c=I3K5XdgQpzPWui8j9CcvTa3f3gfifxZfetZd-h4a4BM=",
    questionsAsked: [{ uid: "q1" }],
    questionsAnswered: [{ uid: "q2" }],
    memberSince: { seconds: 100000 },
    topics: [{ uid: "t1", title: "Cars", timeStamp: { seconds: 0 } }],
  },
];

const FAKE_LOGGEDIN_USER = {
  email: "fake@fake.com",
  username: "the_connoisseur77",
  userId: "uid",
  imageUrl:
    "https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?w=2000",
  memberSince: { seconds: 1674361910 },
  questionsAsked: [{ uid: "q1" }],
  questionsAnswered: [{ uid: "q2" }],
  topics: [{ uid: "t1" }, { uid: "t3" }],
};

export const QUESTIONS_TEST_DATA = [
  {
    uid: "q1",
    title: "Tire pressure light won't go off",
    text: "I've been trying to fix this issue for a while now. And I'm really trying to learn how to fix my own car. Any suggestions?",
    topic: { uid: "t1" },
    timeStamp: { seconds: 1674361910 },
    askedBy: "the_connoisseur77",
    likes: 23,
    answers: 5,
  },
  {
    uid: "q0x1",
    title: "Best programming language",
    text: "JavaScript is the best programming language!",
    topic: { uid: "t3" },
    timeStamp: { seconds: 1674361910 },
    askedBy: "the_connoisseur77",
    likes: 23,
    answers: 5,
  },
  {
    uid: "q2",
    title: "How fast do airplanes take off?",
    text: "I've been wondering the speed...",
    topic: { uid: "t2" },
    timeStamp: { seconds: 1674361910 },
    askedBy: "the_connoisseur77",
    likes: 23,
    answers: 5,
  },
  {
    uid: "q3",
    title: "Why don't airplanes have parachutes?",
    text: "This is probably a dumb question, but why? I mean, it would save a lot of lives! 😁",
    topic: { uid: "t2" },
    timeStamp: { seconds: 1674361910 },
    askedBy: "the_connoisseur77",
    likes: 9,
    answers: 5,
  },
];

// Mock example of a query to a topics db
export const USER_QUESTION_TEST_DATA = [
  {
    uid: "q1",
    title: "USER_FEED",
    timeStamp: { seconds: 1674361910 },
    askedBy: "CURRENT_USER",
    likes: 23,
    answers: 5,
  },
];

export const TOPICS_TEST_DATA = [
  {
    uid: "t1",
    authorUsername: "coco_809",
    text: "CarRepairs",
    description: "Explore car repair questions.",
    questionsAsked: [{ uid: "q1" }],
  },
  {
    uid: "t2",
    authorUsername: "coco_809",
    text: "Airplanes",
    description: "Questions about Airplanes.",
    questionsAsked: [{ uid: "q2" }, { uid: "q3" }],
  },
  {
    uid: "t3",
    authorUsername: "Valiente_02",
    text: "JavaScript",
    description: "All about JS!",
    questionsAsked: [{ uid: "q0x1" }],
  },
];

export const ANSWERS_TEST_DATA = [
  {
    question: "q1",
    text: "Have you tried replacing the tire pressure sensor? Sometimes that can be the problem.",
    timeStamp: { seconds: 1674361910 },
  },
];

export const getQuestionsWithTopicUid = (topicUid) => {
  const filteredQuestion = QUESTIONS_TEST_DATA.filter(
    (question) => question.topic.uid === topicUid
  );
  return filteredQuestion;
};

export const getTopicInfoWithTopicUid = (topicUid) =>
  TOPICS_TEST_DATA.filter((topic) => topic.uid === topicUid)[0];

export const getTopicInfoWithTopicName = (topicName) => {
  const [topicInfo] = TOPICS_TEST_DATA.filter(
    (topic) => topic.topic === topicName
  );
  return topicInfo;
};

export const getLoggedInUserTopics = () => FAKE_LOGGEDIN_USER.topics;

export const getListOfQuestionsWithListOfTopics = (topics) => {
  const results = topics.map((topic) => getQuestionsWithTopicUid(topic.uid))[0];
  return results;
};

// export const getUserAnsweredQuestionsWithListOfTopics = (topics) => {
//   // return questions the user has asked under topics
//   const questionsAskedByUser = QUESTIONS_TEST_DATA.filter(
//     (question) => question.askedBy === FAKE_LOGGEDIN_USER.username
//   );

//   console.log("questionsAskedByUser", questionsAskedByUser);
//   // return only the questions where a topicUid matches
//   const questionsAnsweredByUserThatAreAlsoInTheReceivedTopcsList =
//     questionsAskedByUser.filter(
//       // return the question where its topic.uid is included in any of the user asked questions
//       (question) =>
//         topics.filter((topic) => topic.uid === question.topic.uid)[0]
//     );
//   return questionsAnsweredByUserThatAreAlsoInTheReceivedTopcsList;
// };

// export const getQuestionsWithTopicName = (topicName) => {
//   // 1) First find topicUid because questions only keep reference to topic uids
//   const topicUid = TOPICS_TEST_DATA.filter(
//     (topic) => topic.text === topicName
//   )[0];

//   // 2) Then filter the question which topicUid === topicUid above
//   const result = QUESTIONS_TEST_DATA.filter(
//     (question) => question.topic.uid === topicUid
//   );

//   return QUESTIONS_TEST_DATA;
// };

export const getTopicsWithTopicText = (text) => {
  const results = TOPICS_TEST_DATA.filter((topic) =>
    topic.text.toLowerCase().startsWith(text.toLowerCase())
  );

  return results;
};

export const getTopicNameWithTopicUid = (topicUid) =>
  getTopicInfoWithTopicUid(topicUid).text;

export const followTopic = (topicToFollow) => {
  // Adds a topic to the user topics
  FAKE_LOGGEDIN_USER.topics.push({ uid: topicToFollow });
};

export const unfollowTopic = (topicUidToRemove) => {
  // Removes a topic from the user topics
  FAKE_LOGGEDIN_USER.topics = FAKE_LOGGEDIN_USER.topics.filter(
    (topic) => topic.uid !== topicUidToRemove
  );
};

export const isUserFollowngTopic = (topicUid) => {
  const result = FAKE_LOGGEDIN_USER.topics.filter(
    (topic) => topic.uid === topicUid
  );
  if (result.length > 0) return true;
  else return false;
};

export const getQuestionWithUid = (uid) => {
  const match = QUESTIONS_TEST_DATA.find((question) => question.uid === uid);

  return match;
};

//////////////////
export const getUserImageUrlWithUsername = () => {
  return "https://static.vecteezy.com/system/resources/thumbnails/001/993/889/small/beautiful-latin-woman-avatar-character-icon-free-vector.jpg";
};
