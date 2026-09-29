import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBjTdvBInkdfkOI4p9UToWDkPr9oHUsR-w",
  authDomain: "ts-dev-57b9a.firebaseapp.com",
  projectId: "ts-dev-57b9a",
  storageBucket: "ts-dev-57b9a.firebasestorage.app",
  messagingSenderId: "381912094221",
  appId: "1:381912094221:web:4d207c279a8c4280082744",
  measurementId: "G-VYVNL7RB8H",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function main() {
  try {
    const snap = await getDocs(collection(db, "users"));
    console.log("Total users docs in Firestore:", snap.docs.length);
    snap.docs.forEach((doc) => {
      console.log("Doc ID:", doc.id, "Data:", JSON.stringify(doc.data()));
    });
  } catch (err) {
    console.error("Error reading users:", err);
  }
}

main();
