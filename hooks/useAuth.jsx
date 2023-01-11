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
  getDocs,
  getFirestore,
  query,
  setDoc,
  Timestamp,
  where,
} from "firebase/firestore";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { firebaseConfig } from "../api/firebaseApp";
import { authActions } from "../redux-store/authSlice";

// useAuth initializes auth and returns apis to manage auth.
const useAuth = function () {
  const dispatch = useDispatch();

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);

  // Will only run once
  let detachListener = null;
  useEffect(() => {
    detachListener = onAuthStateChanged(auth, async (user) => {
      dispatch(authActions.setIsLoading(true));
      if (user) {
        // Querying data: find username with uid
        // Get query reference. __name__ is the name of the document which is meant to be the user id
        const q = query(
          collection(db, "/users"),
          where("__name__", "==", user.uid)
        );
        // Get query snapshot
        const querySnapshot = await getDocs(q);
        // Iterate docs
        let result = null;
        querySnapshot.forEach((doc) => (result = doc.data()));
        // Only one user will be returned from the query. Convert to json to object will prevent unserialized value error from redux.
        dispatch(authActions._setUser(JSON.parse(JSON.stringify(result))));
      } else dispatch(authActions._setUser(user)); // User will be null
      dispatch(authActions.setIsLoading(false));
    });

    return () => {
      // Unsubscribe listener
      detachListener();
    };
  }, []);

  return {
    async login(email, password) {
      dispatch(authActions.setIsLoading(true));
      const userCredentials = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      dispatch(authActions.setIsLoading(false));
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
