import { useState, useEffect } from "react";
import { auth, firestore } from "./database/firebaseResources"; // Adjust based on your Firebase config file
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { doc, setDoc, getDoc } from "firebase/firestore";
import "./App.css";
import { AuthDisplay } from "./components/AuthDisplay/AuthDisplay";

function App() {
  const [count, setCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userRef = doc(firestore, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (!userSnap.exists()) {
          // User doesn't exist, create a new document
          await setDoc(userRef, {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            // Add more fields as needed
          });
        }

        navigate("/profile");
      } else {
        // User is signed out
      }
    });

    return () => unsubscribe();
  }, [navigate]);
  return (
    <div>
      Hello world
      <AuthDisplay />
    </div>
  );
}

export default App;
