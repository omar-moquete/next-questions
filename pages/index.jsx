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

const HomePage = function ({ latestQuestionsData }) {
  return <Home latestQuestionsData={latestQuestionsData} />;
};

export default HomePage;

export const getStaticProps = async function () {
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  const nanosecondsInAWeek = 604_800 * 1000;
  const queryRef = query(
    collection(db, "/questions"),
    where("unixTimestamp", ">=", Date.now() - nanosecondsInAWeek),
    limit(15)
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
    const topic = (
      await getDoc(doc(db, `/topics/${latestQuestionsData[i].topic.uid}`))
    ).data();

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

    latestQuestionsData[i].topic = topic;
    latestQuestionsData[i].topic.date = new Date(
      latestQuestionsData[i].topic.date.toDate()
    ).toISOString();
  }

  const props = {
    latestQuestionsData,
  };

  return {
    props,
  };
};
