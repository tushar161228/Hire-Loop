import React, { useEffect, useState } from "react";
import Navbar from "./shared/Navbar";
import FilterCard from "./FilterCard";
import Job from "./Job";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { filterData } from "@/utils/filterConstants";

const Jobs = () => {
  const { allJobs, searchedQuery, activeFilters } = useSelector(
    (store) => store.job,
  );

  const [filterJobs, setFilterJobs] = useState(allJobs);

  // Normalize job type values
  // Example:
  // "Full-time" -> "fulltime"
  // "Full Time" -> "fulltime"
  // "FULL-TIME" -> "fulltime"
  // "Part-time" -> "parttime"
  const normalizeJobType = (value) => {
    return value
      ?.toString()
      .toLowerCase()
      .trim()
      .replace(/[-_\s]/g, "");
  };

  useEffect(() => {
    let jobs = allJobs;

    // ---------------- SEARCH FILTER ----------------
    if (searchedQuery) {
      jobs = jobs.filter(
        (job) =>
          job.title?.toLowerCase().includes(searchedQuery.toLowerCase()) ||
          job.description
            ?.toLowerCase()
            .includes(searchedQuery.toLowerCase()) ||
          job.location?.toLowerCase().includes(searchedQuery.toLowerCase()),
      );
    }

    // ---------------- LOCATION FILTER ----------------
    if (activeFilters?.location?.length) {
      jobs = jobs.filter((job) =>
        activeFilters.location.some((loc) => {
          const jobLoc = job.location?.toLowerCase() || "";
          const filterLoc = loc.toLowerCase();

          return jobLoc.includes(filterLoc) || filterLoc.includes(jobLoc);
        }),
      );
    }

    // ---------------- INDUSTRY FILTER ----------------
    if (activeFilters?.industry?.length) {
      jobs = jobs.filter((job) =>
        activeFilters.industry.some((title) =>
          job.title?.toLowerCase().includes(title.toLowerCase()),
        ),
      );
    }

    // ---------------- JOB TYPE FILTER ----------------
    if (activeFilters?.jobType?.length) {
      jobs = jobs.filter((job) =>
        activeFilters.jobType.some(
          (selectedType) =>
            normalizeJobType(selectedType) === normalizeJobType(job.jobType),
        ),
      );
    }

    // ---------------- EXPERIENCE FILTER ----------------
    if (activeFilters?.experience?.length) {
      const expOptions =
        filterData.find((f) => f.key === "experience")?.options || [];

      const selectedExpRanges = expOptions.filter((opt) =>
        activeFilters.experience.includes(opt.label),
      );

      jobs = jobs.filter((job) =>
        selectedExpRanges.some(
          (range) =>
            job.experienceLevel >= range.min &&
            job.experienceLevel <= range.max,
        ),
      );
    }

    // ---------------- SALARY FILTER ----------------
    if (activeFilters?.salary?.length) {
      const salaryOptions =
        filterData.find((f) => f.key === "salary")?.options || [];

      const selectedRanges = salaryOptions.filter((opt) =>
        activeFilters.salary.includes(opt.label),
      );

      jobs = jobs.filter((job) =>
        selectedRanges.some(
          (range) => job.salary >= range.min && job.salary <= range.max,
        ),
      );
    }

    setFilterJobs(jobs);
  }, [allJobs, searchedQuery, activeFilters]);

  return (
    <div className="dark:bg-gray-950 min-h-screen transition-colors">
      <Navbar />

      <div className="max-w-7xl mx-auto mt-5 px-4">
        <div className="flex gap-5">
          {/* FILTER SIDEBAR */}
          <div className="w-[20%]">
            <FilterCard />
          </div>

          {/* JOBS */}
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
              {filterJobs.length} job
              {filterJobs.length !== 1 ? "s" : ""} found
            </p>

            {filterJobs.length <= 0 ? (
              <span className="text-gray-500 dark:text-gray-400">
                No jobs match your filters. Try clearing some.
              </span>
            ) : (
              <div className="h-[85vh] overflow-y-auto pb-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filterJobs.map((job) => (
                    <motion.div
                      initial={{
                        opacity: 0,
                        x: 100,
                      }}
                      animate={{
                        opacity: 1,
                        x: 0,
                      }}
                      exit={{
                        opacity: 0,
                        x: -100,
                      }}
                      transition={{
                        duration: 0.3,
                      }}
                      key={job?._id}
                    >
                      <Job job={job} />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Jobs;
