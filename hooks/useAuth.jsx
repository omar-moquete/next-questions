import { initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
  reauthenticateWithCredential,
} from "firebase/auth";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { firebaseConfig } from "../api/firebaseApp";
import { authActions } from "../redux-store/authSlice";
import { toSerializable } from "../utils";

// The user object returned by firebase auth. Required by specific firebase functions (such as updatePassword(user, newPassword)).
let firebaseUserData = null;

// useAuth initializes auth and returns apis to manage auth.
const useAuth = function () {
  const dispatch = useDispatch();
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);
  const { listenerActive, authStatusNames, user } = useSelector(
    (state) => state.auth
  );
  const router = useRouter();
  // listenerActive prevents the authListener from being set more than once.
  if (!listenerActive) {
    dispatch(authActions.setListenerActive());
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          dispatch(authActions.setAuthStatus(authStatusNames.loading));
          // Required by specific firebase functions:
          firebaseUserData = user;

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

          if (!usersCollectionDocData) {
            dispatch(authActions.setAuthStatus("authStatusNames.error"));
            throw new Error("There was an error while getting user data.");
          }

          const userData = {
            email: usersCollectionDocData.email,
            username: usersCollectionDocData.username,
            userId: usersCollectionDocData.userId,
            imageUrl: usersCollectionDocData.imageUrl,
            memberSince: usersCollectionDocData.memberSince,
            questionsAsked: questionsCollectionDocData?.questionsAsked || [],
            questionsAnswered:
              questionsCollectionDocData?.questionsAnswered || [],
            // [ ]TODO: Add topic property
            // REMOVE OR IN ARRAY
          };
          dispatch(authActions.setAuthStatus(authStatusNames.loaded));
          dispatch(authActions._setUser(toSerializable(userData)));
        } catch (e) {
          console.error(`⛔ ${e}`);
          dispatch(authActions.setAuthStatus(authStatusNames.error));
        }
      } else {
        dispatch(authActions._setUser(null));
        dispatch(authActions.setAuthStatus(authStatusNames.notLoaded));
        // when state.user is changed by signOut()
      }
    });
  }

  return {
    async login(email, password) {
      return await signInWithEmailAndPassword(auth, email, password);
    },

    logout() {
      signOut(auth);
      router.replace("/login");
    },

    async createAccount(email, password, username) {
      // Create user in firebase auth. userId = awaitedValue.user.userId
      const { uid: userId } = (
        await createUserWithEmailAndPassword(auth, email, password)
      ).user;

      // Structure data that will go in firestore
      const userData = {
        email,
        username,
        userId,
        // Make image null when creating account.
        imageUrl: null,
        about: "",
        memberSince: serverTimestamp(),
        questionsAsked: [],
        questionsAnswered: [],
      };

      const docRef = doc(db, `/users/${userId}`);
      await setDoc(docRef, userData);
      return userData;
    },

    async deleteAccount(uid) {
      await deleteDoc(doc(db, "/users/" + uid));
    },

    async changePassword(oldPassword, newPassword) {
      try {
        // Reauthentication required by firebase. Prevents CREDENTIAL_TOO_OLD_LOGIN_AGAIN error.
        const { user: reauthenticatedUser } = await signInWithEmailAndPassword(
          auth,
          user.email,
          oldPassword
        );
        // After the previous function executes, next the authState listener will be executed, which automatically updates the user in the state.

        await updatePassword(reauthenticatedUser, newPassword);
      } catch (e) {
        throw new Error(e.message);
      }
    },
  };
};

export default useAuth;
