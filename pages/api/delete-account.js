import { initializeApp } from "firebase/app";
import { deleteUser, getAuth, signInWithEmailAndPassword } from "firebase/auth";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { deleteObject, getStorage, ref } from "firebase/storage";
import { firebaseConfig } from "../../api/firebaseApp";
import { DELETED_USER_USERNAME } from "../../app-config";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") throw new Error("Only POST Requests allowed");
    const email = req.body.email;
    const password = req.body.password;

    if (!email) throw new Error("Invalid email");
    if (!password) throw new Error("Invalid password");

    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);

    const { user: firebaseAuthUserData } = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    const { uid: firebaseUserId } = firebaseAuthUserData;

    const db = getFirestore(app);
    const storage = getStorage(app);

    //Top level collections
    const usersCollectionRef = collection(db, "/users");
    const questionsCollectionRef = collection(db, "/questions");
    const answersCollectionRef = collection(db, "/answers");
    const topicsCollectionRef = collection(db, "/topics");
    const answerDocs = await getDocs(answersCollectionRef);

    const userDocRef = await getDocs(
      query(usersCollectionRef, where("__name__", "==", firebaseUserId))
    );

    let user = null;

    userDocRef.forEach(
      (docRef) => (user = { userId: docRef.id, ...docRef.data() })
    );

    if (user.userId !== firebaseUserId)
      throw new Error("An error has occurred.");

    const phase1 = async () => {
      // NOTE: phase 1. Delete user.questionsAnswered, user.questionsAsked and user.followedTopics. lastly, delete entire user collection.
      try {
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
        questionsAnsweredQueryResult.forEach(
          async (docRef) => await deleteDoc(docRef.ref)
        );

        questionsAskedQueryResult.forEach(async (docRef) => {
          await deleteDoc(docRef.ref);
        });

        followedTopicsQueryResult.forEach(async (docRef) => {
          await deleteDoc(docRef.ref);
        });

        // Lastly, delete entire user collection in users/userId in db
        await deleteDoc(doc(db, `/users/${user.userId}`));
      } catch (error) {
        throw new Error(`@phase1(): ${error.message}`);
      }
      // NOTE: End phase 1
    };

    const phase2 = async () => {
      // NOTE: phase 2. Replace user username in questions collection
      try {
        // Replace questions/quiestionUid and questions/questionUid/likes/likedBy with DELETED_USER_USERNAME.
        const questionQueryRef = query(
          questionsCollectionRef,
          where("askedBy", "==", user.username)
        );

        const questionsQuerySnapshot = await getDocs(questionQueryRef);
        questionsQuerySnapshot.forEach(async (docRef) => {
          await updateDoc(docRef.ref, {
            askedBy: DELETED_USER_USERNAME,
          });
        });
      } catch (error) {
        throw new Error(`@phase2(): ${error.message}`);
      }
      // NOTE: End phase 2
    };

    const phase3 = async () => {
      // NOTE: phase 3. Replace likedBy if like was by user in all questions matched.
      try {
        const querySnapshot = await getDocs(questionsCollectionRef);

        querySnapshot.forEach(async (docRef) => {
          const likesCollectionQuery = query(
            collection(db, `/questions/${docRef.id}/likes`),
            where("likedBy", "==", user.username)
          );

          (await getDocs(likesCollectionQuery)).forEach(
            async (docRef) =>
              await updateDoc(docRef.ref, {
                likedBy: DELETED_USER_USERNAME,
              })
          );
        });
      } catch (error) {
        throw new Error(`@phase3(): ${error.message}`);
      }
      // NOTE: End phase 3.
    };

    const phase4 = async () => {
      // NOTE: phase 4. Replace user username in answers collection with DELETED_USER_USERNAME
      try {
        // 1) Replace answers/answerUid > {answeredBy: to DELETED_USER_USERNAME}
        const answersQueryAnsweredByRef = query(
          answersCollectionRef,
          where("answeredBy", "==", user.username)
        );

        const answersQuerySnapshot = await getDocs(answersQueryAnsweredByRef);

        answersQuerySnapshot.forEach(
          async (answerDocRef) =>
            await updateDoc(answerDocRef.ref, {
              answeredBy: DELETED_USER_USERNAME,
            })
        );
      } catch (error) {
        throw new Error(`@phase4(): ${error.message}`);
      }
      // NOTE: End phase 4
    };

    const phase5 = async () => {
      //NOTE: phase 5. Update likedBy for each answer liked by the user.
      try {
        const answerLikedByDocs = await getDocs(
          query(answersCollectionRef, where("likedBy", "==", user.username))
        );

        answerLikedByDocs.forEach(
          async (docRef) =>
            await updateDoc(docRef.ref, { likedBy: DELETED_USER_USERNAME })
        );
      } catch (error) {
        throw new Error(`@phase5(): ${error.message}`);
      }
      //NOTE: End phase 5.
    };

    const phase6 = async () => {
      //NOTE: phase 6. Update repliedBy for each answer replied by the user.
      try {
        answerDocs.forEach(async (answerDocRef) => {
          // Filter the replies under an answer that were made by the user and update repliedBy.
          const repliesQuery = query(
            collection(db, `/answers/${answerDocRef.id}/replies`),
            where("repliedBy", "==", user.username)
          );

          const repliesQuerySnapshot = await getDocs(repliesQuery);

          repliesQuerySnapshot.forEach(
            async (replyDoc) =>
              await updateDoc(replyDoc.ref, {
                repliedBy: DELETED_USER_USERNAME,
              })
          );
        });
      } catch (error) {
        throw new Error(`@phase6(): ${error.message}`);
      }
      //NOTE: End phase 6.
    };

    const phase7 = async () => {
      //NOTE: phase 7. Update mention for each answer reply where user is mentioned.
      try {
        answerDocs.forEach(async (answerDocRef) => {
          // Filter the replies under an answer reply where user is mentioned and update repliedBy.
          const repliesQuery = query(
            collection(db, `/answers/${answerDocRef.id}/replies`),
            where("mention", "==", user.username)
          );

          const repliesQuerySnapshot = await getDocs(repliesQuery);

          repliesQuerySnapshot.forEach(
            async (replyDoc) =>
              await updateDoc(replyDoc.ref, { mention: DELETED_USER_USERNAME })
          );
        });
      } catch (error) {
        throw new Error(`@phase7(): ${error.message}`);
      }
      //NOTE: End phase 7.
    };

    const phase8 = async () => {
      //NOTE: phase 8. Update likedBy for each answer reply liked by the user.
      try {
        answerDocs.forEach(async (answerDocRef) => {
          // Filter the replies where likes were made by the user.
          const repliesQuery = query(
            collection(db, `/answers/${answerDocRef.id}/likes`),
            where("likedBy", "==", user.username)
          );

          const repliesQuerySnapshot = await getDocs(repliesQuery);

          repliesQuerySnapshot.forEach(
            async (replyDoc) =>
              await updateDoc(replyDoc.ref, { likedBy: DELETED_USER_USERNAME })
          );
        });
      } catch (error) {
        throw new Error(`@phase1(): ${error.message}`);
      }
      //NOTE: End phase 8.
    };

    const phase9 = async () => {
      // NOTE: phase 9. Replace user username in topics/author
      try {
        const topicsQueryRef = query(
          topicsCollectionRef,
          where("author", "==", user.username)
        );

        const topicsSnapshot = await getDocs(topicsQueryRef);

        topicsSnapshot.forEach(
          async (docRef) =>
            // Not awaited to save execution time
            await updateDoc(docRef.ref, { author: DELETED_USER_USERNAME })
        );
      } catch (error) {
        throw new Error(`@phase9(): ${error.message}`);
      }
      // NOTE: End phase 9
    };

    const phase10 = async () => {
      // NOTE: phase 10. Delete user image
      try {
        //  Can throw an error if the imageRef does not exists. This is not a problen since we only want to delete the image if it exists.
        if (user.imageUrl)
          await deleteObject(
            ref(storage, `/PUBLIC_USER_PROFILE_IMAGES/${user.userId}`)
          );
      } catch (error) {
        throw new Error(`@phase10(): ${error.message}`);
      }
      // NOTE: End phase 10
    };

    const finalize = async () => {
      // NOTE: phase 11. Delete user from Firebase Auth, delete private user data collection.

      try {
        await deleteDoc(doc(db, `/private_user_data/${firebaseUserId}`));
        await deleteUser(firebaseAuthUserData);
      } catch (error) {
        throw new Error(`@finalize(): ${error.message}`);
      }
      // NOTE: End phase 11.
    };

    await Promise.all([
      phase1(),
      phase2(),
      phase3(),
      phase4(),
      phase5(),
      phase6(),
      phase7(),
      phase8(),
      phase9(),
      phase10(),
    ]);

    await finalize();

    res
      .status(200)
      .json({ deleted: true, message: "Account successfully deleted." });
  } catch (error) {
    // If there was an unexpected error
    console.log("error", error);
    res.status(400).json({ deleted: false, message: error.message });
  }
}
