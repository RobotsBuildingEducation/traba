import React, { useEffect, useState } from "react";
import { Form, Button, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
  startAfter,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { firestore } from "../../database/firebaseResources";
import SignOutButton from "../SignOut/SignOut";

export const JobList = styled.div`
  margin-top: 20px;
`;

export const JobPosting = styled.div`
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

export const JobTitle = styled.h3`
  margin: 0;
  color: #333;
`;

export const JobDescription = styled.p`
  color: #666;
`;

const Profile = () => {
  const LIMIT = 3;
  const [userProfile, setUserProfile] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true); // Add a loading state
  const [jobPostings, setJobPostings] = useState([]);
  const [lastVisible, setLastVisible] = useState(null);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const navigate = useNavigate();

  const fetchJobPostingsForEmployees = async () => {
    setLoadingJobs(true);
    let queryConstraints = [orderBy("createdAt"), limit(LIMIT)];
    if (lastVisible) {
      queryConstraints.push(startAfter(lastVisible));
    }
    const queryRef = query(
      collection(firestore, "jobPostings"),
      ...queryConstraints
    );

    const documentSnapshots = await getDocs(queryRef);
    if (documentSnapshots.docs.length < LIMIT) {
      setHasMore(false); // No more documents to fetch
    } else {
      setHasMore(true);
      // Get the last visible document for the next query
      const lastVisibleDocument =
        documentSnapshots.docs[documentSnapshots.docs.length - 1];
      setLastVisible(lastVisibleDocument);
    }

    const newPostings = documentSnapshots.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setJobPostings((prevPostings) => [...prevPostings, ...newPostings]);
    setLoadingJobs(false);
    setEditMode(false);
  };

  const handleCreateJobPosting = () => {
    navigate("/create-job-posting"); // Assumes you have a route set up for this
  };

  const handleRadioChange = (event) => {
    const updatedRole = event.target.value;
    setUserProfile((prevProfile) => ({
      ...prevProfile,
      userRole: updatedRole,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Get form data
    const name = event.target.userName.value;
    const phone = event.target.userPhone.value;
    const email = event.target.userEmail.value;

    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const userDocRef = doc(firestore, "users", user.uid);
      const userDoc = await getDoc(userDocRef);
      try {
        await setDoc(
          userDocRef,
          {
            name,
            phone,
            email,
            userRole: userProfile.userRole,
          },
          { merge: true }
        );
        setEditMode(false);
      } catch (error) {
        console.error("Error updating document: ", error);
        alert("Error updating profile");
      }
    }
  };
  let getPostings = async (user) => {
    const postingsRef = collection(firestore, "jobPostings");
    console.log("postingsRef", postingsRef);

    const q = query(postingsRef, where("employerId", "==", user.uid));
    console.log("q", q);
    const querySnapshot = await getDocs(q);
    console.log("query", querySnapshot);
    const postings = querySnapshot.docs.map((doc) => ({
      docID: doc.id,
      ...doc.data(),
    }));
    // Assuming you have a state for storing job postings
    console.log("postings", postings);
    setJobPostings(postings);
  };

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDocRef = doc(firestore, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setUserProfile(userDoc.data());
          if (userDoc.data()?.userRole === "employee") {
            fetchJobPostingsForEmployees();
          } else if (userDoc.data()?.userRole === "employer") {
            getPostings(user);
          }
        } else {
          // Handle case where user is authenticated but no profile data is found
        }
      } else {
        // User is not logged in, navigate to login page or handle accordingly
        navigate("/");
      }
      setLoading(false); // Set loading to false here to ensure it's always updated appropriately
    });

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, [navigate]);

  console.log("jobPostings", jobPostings);
  console.log("editmode", editMode);
  console.log("userProfile.userRole", userProfile.userRole);
  if (loading) {
    return <Container>Loading...</Container>; // Display loading indicator while fetching
  }

  if (userProfile && !editMode) {
    return (
      <Container className="mt-5">
        <SignOutButton />
        <br />
        <br />
        <h2>Profile</h2>
        <p>Name: {userProfile.name}</p>
        <p>Email: {userProfile.email}</p>
        <p>Phone: {userProfile.phone}</p>
        <Button variant="primary" onClick={() => setEditMode(true)}>
          Edit Profile
        </Button>
        &nbsp; &nbsp;
        {/* Update this condition to check userProfile.userRole from Firestore */}
        {userProfile.userRole === "employer" && (
          <Button variant="success" onClick={handleCreateJobPosting}>
            Create Job Posting
          </Button>
        )}
        <br />
        <br />
        {!editMode &&
          userProfile?.userRole === "employer" &&
          jobPostings?.length > 0 && (
            <>
              <h2>Your job postings</h2>
              <JobList>
                {jobPostings.map((posting) => (
                  <JobPosting key={posting.docID}>
                    <Link
                      to={`/job/${posting.docID}`}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      <JobTitle>{posting.title}</JobTitle>
                      <JobDescription>{posting.description}</JobDescription>
                    </Link>
                  </JobPosting>
                ))}
              </JobList>
            </>
          )}
        {!editMode &&
          userProfile?.userRole === "employee" &&
          jobPostings?.length > 0 && (
            <>
              <JobList>
                {jobPostings.map((posting) => (
                  <JobPosting key={posting.id}>
                    <JobTitle>{posting.title}</JobTitle>
                    <JobDescription>{posting.description}</JobDescription>
                  </JobPosting>
                ))}
              </JobList>
              <Button
                onClick={fetchJobPostingsForEmployees}
                disabled={!hasMore || loadingJobs}
              >
                {loadingJobs ? "Loading..." : !hasMore ? "End" : "Load More"}
              </Button>
            </>
          )}
      </Container>
    );
  }
  return (
    <Container className="mt-5">
      <SignOutButton />
      <br />
      <br />
      <h1>Create your profile </h1>

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="userName">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter your name"
            required
            value={userProfile ? userProfile.name : ""}
            onChange={(e) =>
              setUserProfile({ ...userProfile, name: e.target.value })
            }
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="userPhone">
          <Form.Label>Phone Number</Form.Label>
          <Form.Control
            type="tel"
            placeholder="Enter your phone number"
            required
            value={userProfile ? userProfile.phone : ""}
            onChange={(e) =>
              setUserProfile({ ...userProfile, phone: e.target.value })
            }
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="userEmail">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter your email"
            required
            value={userProfile ? userProfile.email : ""}
            onChange={(e) =>
              setUserProfile({ ...userProfile, email: e.target.value })
            }
          />
        </Form.Group>

        <div className="mb-3">
          <Form.Check
            inline
            label="Looking for work"
            name="userRole"
            type="radio"
            id="inline-radio-1"
            value="employee"
            checked={userProfile && userProfile.userRole === "employee"}
            onChange={handleRadioChange}
          />
          <Form.Check
            inline
            label="Looking for workers"
            name="userRole"
            type="radio"
            id="inline-radio-2"
            value="employer"
            checked={userProfile && userProfile.userRole === "employer"}
            onChange={handleRadioChange}
          />
        </div>
        <br />
        <Button variant="primary" type="submit">
          Save Profile
        </Button>
      </Form>
    </Container>
  );
};

export default Profile;
