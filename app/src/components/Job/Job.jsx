import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../../database/firebaseResources";

const Job = () => {
  const [jobDetails, setJobDetails] = useState(null);
  const { jobID } = useParams();

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
      <h2>{jobDetails.title}</h2>
      <p>{jobDetails.description}</p>
      {/* Display other job details here */}
    </div>
  );
};

export default Job;
