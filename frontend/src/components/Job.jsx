import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Bookmark } from "lucide-react";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "sonner";

const daysAgoFunction = (mongodbTime) => {
  const createdAt = new Date(mongodbTime);
  const currentTime = new Date();

  const timeDifference = currentTime - createdAt;

  return Math.floor(
    timeDifference / (1000 * 24 * 60 * 60)
  );
};

// ==========================================
// GET USER-SPECIFIC SAVED JOB KEY
// ==========================================

const getSavedJobsKey = (userId) => {
  return `savedJobs_${userId}`;
};

// ==========================================
// GET SAVED JOBS
// ==========================================

const getSavedJobs = (userId) => {
  if (!userId) {
    return [];
  }

  try {
    return (
      JSON.parse(
        localStorage.getItem(
          getSavedJobsKey(userId)
        )
      ) || []
    );
  } catch (error) {
    console.log("Get Saved Jobs Error:", error);
    return [];
  }
};

const Job = ({ job }) => {
  const navigate = useNavigate();

  const { user } = useSelector(
    (store) => store.auth
  );

  const [isSaved, setIsSaved] = useState(false);

  // ==========================================
  // CHECK WHETHER THIS JOB IS SAVED
  // ==========================================

  useEffect(() => {
    if (!user?._id || !job?._id) {
      setIsSaved(false);
      return;
    }

    const savedJobs = getSavedJobs(user._id);

    setIsSaved(
      savedJobs.includes(job._id)
    );
  }, [user?._id, job?._id]);

  // ==========================================
  // SAVE / REMOVE JOB
  // ==========================================

  const toggleSave = (e) => {
    e.stopPropagation();

    // User must be logged in
    if (!user?._id) {
      toast.error(
        "Please login to save jobs"
      );

      navigate("/login");

      return;
    }

    const savedJobs = getSavedJobs(
      user._id
    );

    let updatedJobs;

    if (savedJobs.includes(job?._id)) {

      // REMOVE JOB
      updatedJobs = savedJobs.filter(
        (id) => id !== job._id
      );

      toast.success(
        "Removed from saved jobs"
      );

    } else {

      // SAVE JOB
      updatedJobs = [
        ...savedJobs,
        job._id,
      ];

      toast.success("Job saved");
    }

    // ========================================
    // SAVE UNDER CURRENT USER'S ID
    // ========================================

    localStorage.setItem(
      getSavedJobsKey(user._id),
      JSON.stringify(updatedJobs)
    );

    setIsSaved(
      updatedJobs.includes(job._id)
    );
  };

  return (
    <div className="p-5 rounded-xl shadow-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">

      {/* ======================================
          TOP SECTION
      ====================================== */}

      <div className="flex items-center justify-between">

        <p className="text-sm text-gray-500 dark:text-gray-400">
          {daysAgoFunction(job?.createdAt) === 0
            ? "Today"
            : `${daysAgoFunction(
                job?.createdAt
              )} days ago`}
        </p>

        {/* SAVE ICON */}
        <Button
          onClick={toggleSave}
          variant="outline"
          className={`rounded-full w-10 h-10 p-0 flex items-center justify-center ${
            isSaved
              ? "border-[#6A38C2] bg-[#6A38C2]/10"
              : ""
          }`}
        >
          <Bookmark
            className={`h-5 w-5 ${
              isSaved
                ? "fill-[#6A38C2] text-[#6A38C2]"
                : ""
            }`}
          />
        </Button>

      </div>

      {/* ======================================
          COMPANY
      ====================================== */}

      <div className="flex items-center gap-3 mt-4">

        <Avatar className="h-12 w-12">

          <AvatarImage
            src={job?.company?.logo}
            alt={job?.company?.name}
          />

        </Avatar>

        <div>

          <h2 className="font-semibold text-lg dark:text-white">
            {job?.company?.name}
          </h2>

          <p className="text-sm text-gray-500 dark:text-gray-400">
            {job?.location}
          </p>

        </div>

      </div>

      {/* ======================================
          JOB TITLE
      ====================================== */}

      <h1 className="font-bold text-lg mt-4 dark:text-white">
        {job?.title}
      </h1>

      {/* ======================================
          DESCRIPTION
      ====================================== */}

      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 line-clamp-2">
        {job?.description}
      </p>

      {/* ======================================
          BADGES
      ====================================== */}

      <div className="flex flex-wrap gap-2 mt-4">

        <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
          {job?.position} Positions
        </Badge>

        <Badge className="bg-red-100 text-red-600 hover:bg-red-100">
          {job?.jobType}
        </Badge>

        <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100">
          {job?.salary}LPA
        </Badge>

      </div>

      {/* ======================================
          ACTION BUTTONS
      ====================================== */}

      <div className="flex items-center gap-3 mt-5">

        <Button
          onClick={() =>
            navigate(
              `/description/${job?._id}`
            )
          }
          variant="outline"
          className="dark:text-white dark:border-gray-700"
        >
          Details
        </Button>

        <Button
          onClick={toggleSave}
          className={
            isSaved
              ? "bg-gray-400 hover:bg-gray-500 text-black"
              : "bg-[#7209b7] hover:bg-[#5f32ad]"
          }
        >
          {isSaved
            ? "Saved"
            : "Save For Later"}
        </Button>

      </div>

    </div>
  );
};

export default Job;