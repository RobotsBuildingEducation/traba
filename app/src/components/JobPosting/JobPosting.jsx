import React, { useEffect, useState } from "react";
import { Form, Button, Container } from "react-bootstrap";
import { doc, setDoc, getDoc, collection, addDoc } from "firebase/firestore";
import { firestore } from "../../database/firebaseResources";
import { useNavigate, useParams } from "react-router-dom";
import { getAuth } from "firebase/auth";

const JobPosting = () => {
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const navigate = useNavigate();
  const { jobID } = useParams(); // Get the jobID from the URL

  useEffect(() => {
    const fetchJobDetails = async () => {
      if (jobID) {
        const docRef = doc(firestore, "jobPostings", jobID);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setJobTitle(docSnap.data().title);
          setJobDescription(docSnap.data().description);
        } else {
          console.log("No such document!");
        }
      }
    };

    fetchJobDetails();
  }, [jobID]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      try {
        if (jobID) {
          // Update existing job posting
          const jobRef = doc(firestore, "jobPostings", jobID);
          await setDoc(
            jobRef,
            {
              title: jobTitle,
              description: jobDescription,
              updatedAt: new Date(),
            },
            { merge: true }
          );
        } else {
          // Create new job posting
          await addDoc(collection(firestore, "jobPostings"), {
            employerId: user.uid,
            title: jobTitle,
            description: jobDescription,
            createdAt: new Date(),
          });
        }
        navigate("/profile");
      } catch (error) {
        console.error("Error saving job: ", error);
        alert("Failed to save job");
      }
    } else {
      alert("You must be signed in");
    }
  };

  return (
    <Container className="mt-5">
      <h1>{jobID ? "Edit Job Posting" : "Post a New Job"}</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="jobTitle">
          <Form.Label>Job Title</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter job title"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="jobDescription">
          <Form.Label>Job Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Enter job description"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          {jobID ? "Update Job" : "Post Job"}
        </Button>
      </Form>
    </Container>
  );
};

export default JobPosting;
