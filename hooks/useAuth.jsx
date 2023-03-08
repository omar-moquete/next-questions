import { initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
  deleteUser as firebaseAuthDeleteUser,
  sendPasswordResetEmail as firebaseAuthSendPasswordResetEmail,
} from "firebase/auth";
import {
  collection,
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
import { deleteUserData } from "../db";
import { authActions } from "../redux-store/authSlice";
import { formatFirebaseErrorCode, toSerializable } from "../utils";

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

    async logout() {
      // signOut runs listener before resolving. The route /login is pushed to the history after the listener is ran.
      await signOut(auth);
      router.push("/login");
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
        memberSince: serverTimestamp(),
      };

      const docRef = doc(db, `/users/${userId}`);
      await setDoc(docRef, userData);
      return userData;
    },

    async deleteUser(password) {
      try {
        // Must reauthenticate before deleting account. Required by firebase auth.
        const { user: reauthenticatedUser } = await signInWithEmailAndPassword(
          auth,
          user.email,
          password
        );

        // If there were no errors during reauthentication, these lines will run. Otherwise the function stops execution and returns error from signInWithEmailAndPassword.
        // firebaseAuthDeleteUser cannot be ran in parallel with Promise.all because it automatically loads a new route.
        await deleteUserData(user); // user from state
        await firebaseAuthDeleteUser(reauthenticatedUser); // user from firebase
      } catch (error) {
        throw new Error(error.message);
      }
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

    async sendPasswordResetEmail(email) {
      await firebaseAuthSendPasswordResetEmail(auth, email);
    },
  };
};

export default useAuth;
