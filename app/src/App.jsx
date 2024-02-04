import { useState, useEffect } from "react";
import { auth, firestore } from "./database/firebaseResources";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { doc, setDoc, getDoc } from "firebase/firestore";
import "./App.css";
import { AuthDisplay } from "./components/AuthDisplay/AuthDisplay";

function App() {
  const [isLoading, setIsLoading] = useState(true); // Add a loading state
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userRef = doc(firestore, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (!userSnap.exists()) {
          await setDoc(userRef, {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
          });
        }
        navigate("/profile");
      } else {
        navigate("/"); // Adjust as needed
      }
      setIsLoading(false); // Set loading to false after handling auth state
    });

    return () => unsubscribe();
  }, [navigate]);

  if (isLoading) {
    return <div>Loading...</div>; // Display loading indicator while checking auth state
  }

  return (
    <div>
      Find reputable and good work
      <AuthDisplay />
      <div
        style={{
          fontSize: "75%",
          visibility: "visible",
          // visibility:'hidden'
        }}
      >
        ✨ created by rox the AI cofounder
      </div>
    </div>
  );
}

export default App;
