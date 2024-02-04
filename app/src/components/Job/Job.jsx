import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../../database/firebaseResources";

const Job = () => {
  const [jobDetails, setJobDetails] = useState(null);
  const { jobID } = useParams();
  const auth = getAuth();
  const currentUser = auth.currentUser;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobDetails = async () => {
      const docRef = doc(firestore, "jobPostings", jobID);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setJobDetails(docSnap.data());
      } else {
        console.log("No such document!");
      }
    };

    fetchJobDetails();
  }, [jobID]);

  if (!jobDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {currentUser && jobDetails.employerId === currentUser.uid && (
        <button
          onClick={() => {
            navigate(`/create-job-posting/edit/${jobID}`);
            /* logic to navigate to the edit page or open an edit form */
          }}
        >
          Edit Posting
        </button>
      )}
      <h2>{jobDetails.title}</h2>
      <p>{jobDetails.description}</p>
      {/* Display other job details here */}
    </div>
  );
};

export default Job;
