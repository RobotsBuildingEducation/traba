import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider, Route } from "react-router-dom";

import App from "./App";

import "./index.css";
import Profile from "./components/Profile/Profile";
import JobPosting from "./components/JobPosting/JobPosting";
import Job from "./components/Job/Job";
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
  {
    path: "/create-job-posting",
    element: <JobPosting />,
  },
  {
    path: "/create-job-posting/edit/:jobID",
    element: <JobPosting />,
  },
  {
    path: "/job/:jobID",
    element: <Job />,
  },
]);
ReactDOM.createRoot(document.getElementById("root")).render(
  <div>
    {" "}
    <RouterProvider router={router} />{" "}
  </div>
);
