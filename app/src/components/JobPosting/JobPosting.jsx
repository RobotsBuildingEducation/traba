import React, { useState } from "react";
import { Form, Button, Container } from "react-bootstrap";

import { collection, addDoc } from "firebase/firestore";
import { firestore } from "../../database/firebaseResources";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";

const JobPosting = () => {
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      try {
        await addDoc(collection(firestore, "jobPostings"), {
          employerId: user.uid, // Link to the employer's user document
          title: jobTitle,
          description: jobDescription,
          createdAt: new Date(), // Optional: Helps in sorting or filtering jobs
        });
        alert("Job posted successfully");
        navigate("/profile"); // Redirect or navigate to a confirmation page
      } catch (error) {
        console.error("Error posting job: ", error);
        alert("Failed to post job");
      }
    } else {
      alert("You must be signed in to post a job");
    }
  };

  return (
    <Container className="mt-5">
      <h1>Post a Job</h1>
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
          Post Job
        </Button>
      </Form>
    </Container>
  );
};

export default JobPosting;
