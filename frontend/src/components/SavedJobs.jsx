import React, { useEffect, useState } from "react";
import Navbar from "./shared/Navbar";
import Job from "./Job";

import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  Bookmark,
} from "lucide-react";

import { Button } from "./ui/button";

// ==========================================
// GET USER-SPECIFIC SAVED JOB KEY
// ==========================================

const getSavedJobsKey = (userId) => {
  return `savedJobs_${userId}`;
};

const SavedJobs = () => {
  const { allJobs } = useSelector(
    (store) => store.job
  );

  const { user } = useSelector(
    (store) => store.auth
  );

  const navigate = useNavigate();

  const [savedJobs, setSavedJobs] = useState([]);

  // ==========================================
  // CHECK USER + LOAD SAVED JOBS
  // ==========================================

  useEffect(() => {
    // Not logged in
    if (!user) {
      navigate("/login", {
        replace: true,
      });

      return;
    }

    // Recruiter should not access saved jobs
    if (user.role !== "student") {
      navigate("/", {
        replace: true,
      });

      return;
    }

    try {
      const savedIds =
        JSON.parse(
          localStorage.getItem(
            getSavedJobsKey(user._id)
          )
        ) || [];

      const jobs = allJobs.filter(
        (job) =>
          savedIds.includes(job?._id)
      );

      setSavedJobs(jobs);

    } catch (error) {
      console.log(
        "Saved Jobs Error:",
        error
      );

      setSavedJobs([]);
    }

  }, [
    allJobs,
    user,
    navigate,
  ]);

  // ==========================================
  // PREVENT UNAUTHENTICATED RENDER
  // ==========================================

  if (
    !user ||
    user.role !== "student"
  ) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">

      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-6">

        {/* =====================================
            BACK BUTTON
        ===================================== */}

        <Button
          onClick={() => navigate(-1)}
          variant="outline"
          className="mb-6 flex items-center gap-2 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800"
        >
          <ArrowLeft className="w-4 h-4" />

          Back
        </Button>

        {/* =====================================
            HEADER
        ===================================== */}

        <div className="flex items-center gap-3 mb-6">

          <Bookmark className="w-6 h-6 text-[#6A38C2]" />

          <div>

            <h1 className="text-2xl font-bold dark:text-white">
              Saved Jobs
            </h1>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              Jobs you saved for later
            </p>

          </div>

        </div>

        {/* =====================================
            NO SAVED JOBS
        ===================================== */}

        {savedJobs.length === 0 ? (

          <div className="flex flex-col items-center justify-center py-20 text-center">

            <Bookmark className="w-12 h-12 text-gray-400 mb-4" />

            <h2 className="text-xl font-semibold dark:text-white">
              No saved jobs
            </h2>

            <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-md">
              Save jobs that you are interested
              in and check them here later.
            </p>

            <Button
              onClick={() =>
                navigate("/jobs")
              }
              className="mt-5 bg-[#6A38C2] hover:bg-[#5b30a6]"
            >
              Browse Jobs
            </Button>

          </div>

        ) : (

          /* ===================================
             SAVED JOBS
          =================================== */

          <>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">

              {savedJobs.length} saved job
              {savedJobs.length !== 1
                ? "s"
                : ""}

            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

              {savedJobs.map((job) => (
                <Job
                  key={job?._id}
                  job={job}
                />
              ))}

            </div>
          </>
        )}

      </div>

    </div>
  );
};

export default SavedJobs;