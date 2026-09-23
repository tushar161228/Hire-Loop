import React, { useEffect, useMemo } from "react";
import Navbar from "./shared/Navbar";
import Job from "./Job";

import { useDispatch, useSelector } from "react-redux";
import { setSearchedQuery } from "@/redux/jobSlice";

import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import useGetAllJobs from "@/hooks/useGetAllJobs";

const Browse = () => {
  useGetAllJobs();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { allJobs, searchedQuery } = useSelector((store) => store.job);

  // ==========================================
  // FILTER JOBS
  // ==========================================

  const filteredJobs = useMemo(() => {
    if (!searchedQuery?.trim()) {
      return allJobs;
    }

    const query = searchedQuery.toLowerCase().trim();

    return allJobs.filter((job) => {
      const title = job?.title?.toLowerCase() || "";

      const description = job?.description?.toLowerCase() || "";

      const location = job?.location?.toLowerCase() || "";

      const industry = job?.industry?.toLowerCase() || "";

      const companyName = job?.company?.name?.toLowerCase() || "";

      const requirements = Array.isArray(job?.requirements)
        ? job.requirements.join(" ").toLowerCase()
        : "";

      return (
        title.includes(query) ||
        description.includes(query) ||
        location.includes(query) ||
        industry.includes(query) ||
        companyName.includes(query) ||
        requirements.includes(query)
      );
    });
  }, [allJobs, searchedQuery]);

  // ==========================================
  // CLEAR SEARCH WHEN LEAVING BROWSE
  // ==========================================

  useEffect(() => {
    return () => {
      dispatch(setSearchedQuery(""));
    };
  }, [dispatch]);

  // ==========================================
  // BACK TO JOBS
  // ==========================================

  const backToJobs = () => {
    dispatch(setSearchedQuery(""));
    navigate("/jobs");
  };

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />

      <div className="max-w-7xl mx-auto my-10 px-4">
        {/* =====================================
            BACK BUTTON
        ===================================== */}

        <button
          onClick={backToJobs}
          className="
            flex
            items-center
            gap-2
            px-4
            py-2
            mb-6
            rounded-md
            border
            border-gray-700
            bg-gray-900
            text-gray-200
            hover:bg-gray-800
            hover:border-[#6A38C2]
            hover:text-white
            transition-all
            cursor-pointer
          "
        >
          <ArrowLeft className="w-4 h-4" />

          <span>Back to Jobs</span>
        </button>

        {/* =====================================
            SEARCH RESULT HEADING
        ===================================== */}

        <h1 className="font-bold text-xl my-10 text-white">
          {searchedQuery
            ? `Search Results for "${searchedQuery}"`
            : "Search Results"}{" "}
          ({filteredJobs.length})
        </h1>

        {/* =====================================
            JOBS
        ===================================== */}

        {filteredJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredJobs.map((job) => (
              <Job key={job?._id} job={job} />
            ))}
          </div>
        ) : (
          /* =====================================
             NO JOBS FOUND
          ===================================== */

          <div className="flex flex-col items-center justify-center py-20 text-center">
            <h2 className="text-xl font-semibold text-white">No jobs found</h2>

            <p className="text-gray-400 mt-2">
              No jobs match{" "}
              <span className="text-white font-medium">"{searchedQuery}"</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Browse;
