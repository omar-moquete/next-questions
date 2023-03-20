import { initializeApp } from "firebase/app";
import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import { firebaseConfig } from "../../api/firebaseApp";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") throw new Error("Only POST Requests allowed");

    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    // Querying data:
    // Get collection reference
    const colRef = collection(db, req.body.inCollection);

    // Get query reference
    const q = query(colRef, where(req.body.fieldName, "==", req.body.exists));
    // Get query snapshot
    const querySnapshot = await getDocs(q);

    // Get data out of the snapshot:
    const results = [];

    // The results array will be filled with data when forEach finishes iterating over querySnapshot.
    querySnapshot.forEach((snapshot) => results.push(snapshot.data()));

    // If matches were found in the database
    if (results.length > 0)
      res.status(403).json({
        found: true,
        message: `The ${req.body.type} "${req.body.exists}" already exists.`,
      });
    // If matches were NOT found in the database
    else
      res.status(200).json({
        found: false,
        message: `The ${req.body.type} "${req.body.exists}" is available for use.`,
      });
  } catch (error) {
    console.log("error", error);
    // If there was an unexpected error
    res.status(400).json({ found: false, error: error.message });
  }
}
