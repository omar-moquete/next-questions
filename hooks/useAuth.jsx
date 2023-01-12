import { initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  setDoc,
  Timestamp,
  where,
} from "firebase/firestore";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { firebaseConfig } from "../api/firebaseApp";
import { authActions } from "../redux-store/authSlice";
import { toSerializable } from "../utils";

// useAuth initializes auth and returns apis to manage auth.
const useAuth = function () {
  const dispatch = useDispatch();

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);
  const authStatusNames = useSelector((state) => state.auth.authStatusNames);

  // Will only run once
  let detachListener = null;
  useEffect(() => {
    detachListener = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          dispatch(authActions.setAuthStatus(authStatusNames.checking));
          // Querying data: find username with uid
          // Get query reference. __name__ is the name of the document which is meant to be the user id
          const queryInUsers = query(
            collection(db, "/users"),
            where("__name__", "==", user.uid)
          );

          // Get query snapshot
          const queryInUsersSnapshot = await getDocs(queryInUsers);
          // Iterate docs
          let usersCollectionDocData = null;
          queryInUsersSnapshot.forEach(
            (doc) => (usersCollectionDocData = doc.data())
          );
          // Only one user will be returned from the query. Convert to json to object will prevent unserialized value error from redux.

          // Get questions linked to user

          let questionsCollectionDocData = null;
          const queryInQuestions = query(
            collection(db, "/questions"),
            where("userId", "==", user.uid)
          );

          const queryInQuestionsSnapshot = await getDocs(queryInQuestions);

          queryInQuestionsSnapshot.forEach(
            (doc) => (questionsCollectionDocData = doc.data())
          );

          const userData = {
            email: usersCollectionDocData.email,
            username: usersCollectionDocData.username,
            userId: usersCollectionDocData.userId,
            imageUrl: usersCollectionDocData.imageUrl,
            memberSince: usersCollectionDocData.memberSince,
            questionsAsked: questionsCollectionDocData.questionsAsked,
            questionsAnswered: questionsCollectionDocData.questionsAnswered,
          };

          dispatch(authActions._setUser(toSerializable(userData)));
          dispatch(authActions.setAuthStatus(authStatusNames.checked));
        } catch (error) {
          dispatch(authActions.setAuthStatus(authStatusNames.checked));
        }
      } else dispatch(authActions._setUser(null));
    });

    return () => {
      // Unsubscribe listener
      detachListener();
    };
  }, []);

  return {
    async login(email, password) {
      const userCredentials = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      return userCredentials;
    },

    logout() {
      signOut(auth);
    },

    async createAccount(email, password, username) {
      // Create user in firebase auth. userId = awaitedValue.user.userId
      const { uid: userId } = (
        await createUserWithEmailAndPassword(auth, email, password)
      ).user;

      // Structure data that will go in firestore
      const userData = {
        userId,
        email,
        username,
        memberSince: Timestamp.fromDate(new Date()),
        imageUrl: null,
      };

      const docRef = doc(db, `/users/${userId}`);
      console.log(userData);
      await setDoc(docRef, userData);
      return userData;
    },

    async deleteAccount(uid) {
      await deleteDoc(doc(db, "/users/" + uid));
    },
  };
};

export default useAuth;
