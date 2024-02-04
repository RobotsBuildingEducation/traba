import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";

export const AuthComponent = (StyledFirebaseAuth).default
  ? (StyledFirebaseAuth).default
  : StyledFirebaseAuth;

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "traba-214e5.firebaseapp.com",
  projectId: "traba-214e5",
  storageBucket: "traba-214e5.appspot.com",
  messagingSenderId: "69545427754",
  appId: "1:69545427754:web:d02718ab40f01f87051453",
  measurementId: "G-Q9MYWV3GGC"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const firestore = getFirestore(app);


export const uiConfig = {
  // Popup signin flow rather than redirect flow.
  signInFlow: "popup",
  // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
  signInSuccessUrl: "/",
  // We will display Google and Facebook as auth providers.
  signInOptions: [GoogleAuthProvider.PROVIDER_ID],
  callbacks: {
    // Avoid redirects after sign-in.
    signInSuccessWithAuthResult: () => false,
  },
};
