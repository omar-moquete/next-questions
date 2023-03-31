import { initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
  sendPasswordResetEmail as firebaseAuthSendPasswordResetEmail,
} from "firebase/auth";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { DELETE_ACCOUNT_ENDPOINT } from "../api-endpoints";
import { firebaseConfig } from "../api/firebaseApp";
import { UI_GENERIC_ERROR } from "../app-config";
import { createUserInDb, getPrivateUserData, getUserDataWithId } from "../db";
import { authActions } from "../redux-store/authSlice";
import { toSerializable } from "../utils";

// useAuth initializes auth and returns apis to manage auth.
const useAuth = function () {
  const dispatch = useDispatch();
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const listenerActive = useSelector((slices) => slices.auth.listenerActive);
  const authStatusNames = useSelector((slices) => slices.auth.authStatusNames);
  const user = useSelector((slices) => slices.auth.user);
  const router = useRouter();
  // listenerActive prevents the authListener from being set more than once.
  if (!listenerActive) {
    dispatch(authActions.setListenerActive());
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          dispatch(authActions.setAuthStatus(authStatusNames.loading));

          const usersCollectionDocData = await getUserDataWithId(user.uid);

          if (!usersCollectionDocData) {
            dispatch(authActions.setAuthStatus("authStatusNames.error"));
            throw new Error("There was an error while getting user data.");
          }

          const privateUserData = (
            await getPrivateUserData(usersCollectionDocData.userId)
          ).data();
          const userData = {
            email: privateUserData.email,
            username: usersCollectionDocData.username,
            userId: usersCollectionDocData.userId,
            imageUrl: usersCollectionDocData.imageUrl,
            memberSince: usersCollectionDocData.memberSince,
          };
          dispatch(authActions.setAuthStatus(authStatusNames.loaded));
          dispatch(authActions._setUser(toSerializable(userData)));
        } catch (e) {
          console.error(`🚨@useAuth: ${e}`);
          dispatch(authActions.setAuthStatus(authStatusNames.error));
        }
      } else {
        dispatch(authActions._setUser(null));
        dispatch(authActions.setAuthStatus(authStatusNames.notLoaded));
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

      const userData = await createUserInDb(userId, email, username);

      return userData;
    },

    async deleteUser(password) {
      try {
        // Must reauthenticate before deleting account. Required by firebase auth.
        const response = await (
          await fetch(DELETE_ACCOUNT_ENDPOINT, {
            method: "POST",
            body: JSON.stringify({ email: user.email, password }),
            headers: {
              "Content-Type": "application/json",
            },
          })
        ).json();
        if (!response.deleted)
          throw new Error(response?.message || UI_GENERIC_ERROR);
        if (response.deleted) await signOut(auth);
        return response;
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

    formatErrorCode(errorString) {
      if (!errorString.includes("Firebase: Error (auth/")) {
        return errorString;
      }
      // Initial errorString format: firebaseService/error-message-no-spaces

      // Remove "/" and "-"s
      const words = errorString.split("/")[1].split(")")[0].split("-");

      // Get word to capitalize
      const firstWord = words[0];

      // Capitalize word
      const capitalizedFirstWord = [
        firstWord[0].toUpperCase(),
        firstWord.substring(1),
      ].join("");

      // Array of all the words with first word capitalized.
      const capitalizedSentenceArray = [
        capitalizedFirstWord,
        ...words.slice(1),
      ];

      // Add period to end of sentence.
      const formattedWords = capitalizedSentenceArray.join(" ") + ".";

      return formattedWords;
    },
  };
};

export default useAuth;
