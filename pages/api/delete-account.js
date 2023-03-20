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

// BUG: Deletes wrong account. The delete account button is disabled temporarily.
export default async function handler(req, res) {
  try {
    if (req.method !== "POST") throw new Error("Only POST Requests allowed");

    const email = req.body.email;
    const password = req.body.password;
    if (!email) throw new Error({ deleted: false, message: "Invalid email" });
    if (!password)
      throw new Error({ deleted: false, message: "Invalid password" });
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const { user: firebaseAuthUserData } = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const db = getFirestore(app);
    const storage = getStorage(app);
    let user = null;

    (
      await getDocs(
        collection(db, "/users"),
        where("__name__", "==", firebaseAuthUserData.uid)
      )
    ).forEach((docRef) => (user = docRef.data()));

    user.firebaseAuthUserData = firebaseAuthUserData;

    // NOTE: Step 1.Delete user.questionsAnswered and user.questionsAsked, user.followedTopics. lastly, delete entire user collection
    const questionsAnsweredQueryPromise = getDocs(
      query(
        collection(
          db,
          `/users/${user.firebaseAuthUserData.uid}/questionsAnswered`
        )
      )
    );
    const questionsAskedQueryPromise = getDocs(
      query(
        collection(db, `/users/${user.firebaseAuthUserData.uid}/questionsAsked`)
      )
    );
    const followedTopicsQueryPromise = getDocs(
      query(
        collection(db, `/users/${user.firebaseAuthUserData.uid}/followedTopics`)
      )
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
    await deleteDoc(doc(db, `/users/${user.firebaseAuthUserData.uid}`));

    // NOTE: End step 1

    // NOTE: Step 2. Replace user username in questions collection
    // Replace questions/quiestionUid and questions/questionUid/likes/likedBy with DELETED_USER_USERNAME.
    const questionsCollectionRef = collection(db, "/questions");

    console.log("user", user);
    const questionQueryRef = query(
      questionsCollectionRef,
      where("askedBy", "==", user.username)
    );

    const questionsQuerySnapshot = await getDocs(questionQueryRef);
    questionsQuerySnapshot.forEach(async (docRef) => {
      // Not awaited to save execution time
      await updateDoc(docRef.ref, {
        askedBy: DELETED_USER_USERNAME,
      });
    });
    // NOTE: End step 2

    // NOTE: Step 3. Replace likedBy if like was by user in all questions matched.
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
    // NOTE: End step 3.

    // NOTE: Step 4. Replace user username in answers collection with DELETED_USER_USERNAME
    // 1) Replace answers/answerUid > {answeredBy: to DELETED_USER_USERNAME}
    const answersCollectionRef = collection(db, "/answers");

    const answersQueryRef = query(
      answersCollectionRef,
      where("answeredBy", "==", user.username)
    );

    const answersQuerySnapshot = await getDocs(answersQueryRef);

    answersQuerySnapshot.forEach(async (answerDocRef) => {
      // Not awaited to run faster
      await updateDoc(answerDocRef.ref, { answeredBy: DELETED_USER_USERNAME });
      // Likes collection under answers
      const likesCollection = collection(
        db,
        `/answers/${answerDocRef.id}/likes`
      );
      const likesDocs = await getDocs(likesCollection);
      likesDocs.forEach((likeDocRef) =>
        updateDoc(likeDocRef.ref, { likedBy: DELETED_USER_USERNAME })
      );

      // Replies collection under answers
      const repliesCollection = collection(
        db,
        `/answers/${answerDocRef.id}/replies`
      );

      const repliesDocs = await getDocs(repliesCollection);

      repliesDocs.forEach((replyDocRef) => {
        const replyData = replyDocRef.data();
        // If mention is username, update mention too, else only update repliedBy

        if (replyData.mention === user.username)
          updateDoc(replyDocRef.ref, {
            repliedBy: DELETED_USER_USERNAME,
            mention: DELETED_USER_USERNAME,
          });
        else updateDoc(replyDocRef.ref, { repliedBy: DELETED_USER_USERNAME });
      });
    });
    // NOTE: End step 4

    // NOTE: Step 5. Replace user username in topics/author
    const topicsCollectionRef = collection(db, "/topics");

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
    // NOTE: End step 5

    // NOTE: Step 6. Delete user image
    //  Can throw an error if the imageRef does not exists. This is not a problen since we only want to delete the image if it exists. Not awaited to
    if (user.imageUrl)
      await deleteObject(
        ref(
          storage,
          `/PUBLIC_USER_PROFILE_IMAGES/${user.firebaseAuthUserData.uid}`
        )
      );
    // NOTE: End step 6

    // NOTE: Step 7. Delete user from Firebase Auth, delete private user data collection.
    await Promise.all([
      deleteDoc(doc(db, `/private_user_data/${user.firebaseAuthUserData.uid}`)),
      deleteUser(user.firebaseAuthUserData),
    ]);
    // NOTE: End Step 7.

    res
      .status(200)
      .json({ deleted: true, message: "Account successfully deleted." });
  } catch (error) {
    // If there was an unexpected error
    res.status(400).json({ deleted: false, error: error.message });
  }
}
