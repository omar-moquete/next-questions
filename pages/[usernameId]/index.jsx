import React from "react";
import UserProfile from "../../components/user-profile/UserProfile";
import { initializeApp } from "firebase/app";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import { firebaseConfig } from "../../api/firebaseApp";

const ProfilePage = function (props) {
  // After user public data has been received through props and state.auth had been set, check if the user that's signed in is the same as the user that's being displayed then update UI.

  return <UserProfile publicUserData={props.publicUserData} />;
};

export default ProfilePage;

export const getStaticProps = async function ({ params }) {
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  // get public user information using username.
  const usersCollection = collection(db, `/users`);
  // Query for user basic info
  const q = query(usersCollection, where("username", "==", params.usernameId));
  const snapshot = await getDocs(q);

  const publicUserData = {
    username: "",
    imageUrl: "",
    userId: "",
    memberSince: "",
    about: "",
    questionsAsked: [],
    questionsAnswered: [],
  };
  // Only one result, only one iteration.
  snapshot.forEach((doc) => {
    const userData = doc.data();
    publicUserData.username = userData.username;
    publicUserData.userId = userData.userId;
    publicUserData.imageUrl = userData.imageUrl;
    publicUserData.memberSince = userData.memberSince;
    publicUserData.about = userData.about;
  });

  // Query for remaining information and add to publicUserData
  // Must stringify due to serialization
  return {
    props: {
      publicUserData: JSON.parse(JSON.stringify(publicUserData)),
    },
  };
  // if no user is authenticated, return basic public user information
};

export const getStaticPaths = async function () {
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const paths = [];

  const usersCollection = collection(db, "/users");

  const snapshot = await getDocs(usersCollection);
  snapshot.forEach((doc) =>
    paths.push({ params: { usernameId: doc.data().username } })
  );
  return {
    paths,
    fallback: false,
  };
};
