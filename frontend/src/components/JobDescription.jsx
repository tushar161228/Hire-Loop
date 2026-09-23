import React, { useEffect, useState, useMemo } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import Job from "./Job";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from "@/utils/constant";
import { setSingleJob } from "@/redux/jobSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import {
  ArrowLeft,
  Bookmark,
  Share2,
  Briefcase,
  IndianRupee,
  GraduationCap,
  Users,
  CalendarDays,
  MapPin,
  Building2,
  Loader2,
  CheckCircle2,
  Flag,
  Sparkles,
} from "lucide-react";

const daysAgo = (mongodbTime) => {
  if (!mongodbTime) return "";
  const createdAt = new Date(mongodbTime);
  const currentTime = new Date();
  const diffDays = Math.floor(
    (currentTime - createdAt) / (1000 * 60 * 60 * 24),
  );
  if (diffDays <= 0) return "Today";
  if (diffDays === 1) return "1 day ago";
  return `${diffDays} days ago`;
};

const avatarColors = [
  "bg-rose-100 text-rose-600",
  "bg-blue-100 text-blue-600",
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100 text-amber-700",
  "bg-violet-100 text-violet-700",
  "bg-cyan-100 text-cyan-700",
];

const getInitials = (name) => {
  if (!name) return "JP";
  const words = name.trim().split(" ").filter(Boolean);
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
};

const getAvatarColor = (name) => {
  if (!name) return avatarColors[0];
  const sum = name.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return avatarColors[sum % avatarColors.length];
};

const overviewItems = (singleJob) => [
  {
    icon: Briefcase,
    label: "Job Type",
    value: singleJob?.jobType,
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: IndianRupee,
    label: "Salary",
    value: `${singleJob?.salary} LPA`,
    color: "bg-purple-50 text-[#6A38C2]",
  },
  {
    icon: GraduationCap,
    label: "Experience",
    value: `${singleJob?.experienceLevel} yrs`,
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    icon: Users,
    label: "Total Applicants",
    value: singleJob?.applications?.length || 0,
    color: "bg-orange-50 text-[#F83002]",
  },
  {
    icon: CalendarDays,
    label: "Posted Date",
    value: singleJob?.createdAt?.split("T")[0],
    color: "bg-pink-50 text-pink-600",
  },
];

const JobDescription = () => {
  const { singleJob, allJobs } = useSelector((store) => store.job);
  const { user } = useSelector((store) => store.auth);
  const isIntiallyApplied =
    singleJob?.applications?.some(
      (application) => application.applicant === user?._id,
    ) || false;
  const [isApplied, setIsApplied] = useState(isIntiallyApplied);
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);

  const params = useParams();
  const jobId = params.id;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const applyJobHandler = async () => {
    try {
      setApplying(true);
      const res = await axios.post(
        `${APPLICATION_API_END_POINT}/apply/${jobId}`,
        {},
        { withCredentials: true },
      );

      if (res.data.success) {
        setIsApplied(true);
        const updatedSingleJob = {
          ...singleJob,
          applications: [...singleJob.applications, { applicant: user?._id }],
        };
        dispatch(setSingleJob(updatedSingleJob));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setApplying(false);
    }
  };

  const shareHandler = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Job link copied to clipboard");
  };

  const reportHandler = () => {
    toast.success("Thanks — we've noted your report.");
  };

  useEffect(() => {
    const fetchSingleJob = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setSingleJob(res.data.job));
          setIsApplied(
            res.data.job.applications.some(
              (application) => application.applicant === user?._id,
            ),
          );
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchSingleJob();
  }, [jobId, dispatch, user?._id]);

  const isNew = useMemo(() => {
    if (!singleJob?.createdAt) return false;
    const diffDays = Math.floor(
      (new Date() - new Date(singleJob.createdAt)) / (1000 * 60 * 60 * 24),
    );
    return diffDays <= 2;
  }, [singleJob?.createdAt]);

  const filledCount = singleJob?.applications?.length || 0;
  const totalPositions = singleJob?.position || 0;
  const fillPercent =
    totalPositions > 0
      ? Math.min(100, Math.round((filledCount / totalPositions) * 100))
      : 0;
  const spotsLeft = Math.max(totalPositions - filledCount, 0);

  const similarJobs = useMemo(() => {
    if (!singleJob || !allJobs?.length) return [];
    const titleWord = singleJob.title?.split(" ")[0]?.toLowerCase();
    return allJobs
      .filter((j) => j._id !== singleJob._id)
      .filter(
        (j) =>
          j.location === singleJob.location ||
          j.title?.toLowerCase().includes(titleWord),
      )
      .slice(0, 3);
  }, [singleJob, allJobs]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto my-10 px-4 animate-pulse">
        <div className="h-6 w-28 bg-gray-200 rounded mb-6"></div>
        <div className="bg-white border border-gray-100 rounded-xl p-6 space-y-4 shadow-md">
          <div className="h-8 w-2/3 bg-gray-200 rounded"></div>
          <div className="h-4 w-1/3 bg-gray-200 rounded"></div>
          <div className="flex gap-2">
            <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
            <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
            <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto my-8 px-4 pb-24 md:pb-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-900 dark:hover:text-white mb-4 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to jobs
      </button>

      <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden">
        <div className="h-1.5 w-full bg-gradient-to-r from-[#6A38C2] to-[#F83002]"></div>
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div
                className={`h-14 w-14 rounded-xl border border-gray-100 flex items-center justify-center overflow-hidden shrink-0 font-bold text-lg ${getAvatarColor(singleJob?.company?.name)}`}
              >
                {singleJob?.company?.logo ? (
                  <img
                    src={singleJob.company.logo}
                    alt={singleJob?.company?.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  getInitials(singleJob?.company?.name)
                )}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white">
                    {singleJob?.title}
                  </h1>
                  {isNew && (
                    <span className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </span>
                      New
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm font-medium text-gray-500 mt-1">
                  <span className="flex items-center gap-1">
                    <Building2 className="h-4 w-4" />{" "}
                    {singleJob?.company?.name || "Company"}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" /> {singleJob?.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <CalendarDays className="h-4 w-4" /> Posted{" "}
                    {daysAgo(singleJob?.createdAt)}
                  </span>
                </div>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-2 shrink-0">
              <button
                onClick={() => setIsSaved(!isSaved)}
                title="Save job"
                className="rounded-full border border-gray-200 p-2.5 hover:bg-gray-50 hover:shadow-sm transition-all"
              >
                <Bookmark
                  className={`h-4 w-4 ${isSaved ? "fill-[#6A38C2] text-[#6A38C2]" : "text-gray-500"}`}
                />
              </button>
              <button
                onClick={shareHandler}
                title="Copy job link"
                className="rounded-full border border-gray-200 p-2.5 hover:bg-gray-50 hover:shadow-sm transition-all"
              >
                <Share2 className="h-4 w-4 text-gray-500" />
              </button>
              <Button
                onClick={isApplied ? null : applyJobHandler}
                disabled={isApplied || applying}
                className={`rounded-lg font-semibold shadow-sm ${isApplied ? "bg-gray-400 cursor-not-allowed" : "bg-[#7209b7] hover:bg-[#5f32ad] hover:shadow-md"}`}
              >
                {applying ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Applying
                  </>
                ) : isApplied ? (
                  "Already Applied"
                ) : (
                  "Apply Now"
                )}
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-5">
            <Badge
              className="text-blue-700 font-bold bg-blue-50"
              variant="ghost"
            >
              {singleJob?.position} Positions
            </Badge>
            <Badge
              className="text-[#F83002] font-bold bg-red-50"
              variant="ghost"
            >
              {singleJob?.jobType}
            </Badge>
            <Badge
              className="text-[#7209b7] font-bold bg-purple-50"
              variant="ghost"
            >
              {singleJob?.salary} LPA
            </Badge>
            <Badge
              className="text-emerald-700 font-bold bg-emerald-50"
              variant="ghost"
            >
              {singleJob?.experienceLevel} yrs exp
            </Badge>
          </div>

          {totalPositions > 0 && (
            <div className="mt-5">
              <div className="flex items-center justify-between text-xs font-semibold text-gray-500 mb-1">
                <span>
                  {filledCount} of {totalPositions} positions applied
                </span>
                <span
                  className={
                    spotsLeft <= 2 ? "text-[#F83002]" : "text-gray-500"
                  }
                >
                  {spotsLeft > 0 ? `${spotsLeft} spots left` : "Filled"}
                </span>
              </div>
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#6A38C2] to-[#F83002] rounded-full transition-all duration-500"
                  style={{ width: `${fillPercent}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-md hover:shadow-lg transition-shadow p-6">
            <h2 className="font-extrabold text-lg mb-3 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[#6A38C2]" /> Job Description
            </h2>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">
              {singleJob?.description}
            </p>
          </div>

          {singleJob?.requirements?.length > 0 && (
            <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-md hover:shadow-lg transition-shadow p-6">
              <h2 className="font-extrabold text-lg mb-3">Requirements</h2>
              <div className="flex flex-col gap-2">
                {singleJob.requirements.map((req, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-2 text-sm text-gray-700 font-medium"
                  >
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                    {req.trim()}
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={reportHandler}
            className="flex items-center gap-1 text-xs font-medium text-gray-400 hover:text-[#F83002] transition-colors"
          >
            <Flag className="h-3 w-3" /> Report this job
          </button>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-md hover:shadow-lg transition-shadow p-6">
            <h2 className="font-extrabold text-lg mb-4">Job Overview</h2>
            <ul className="space-y-4 text-sm">
              {overviewItems(singleJob).map((item, index) => (
                <li key={index} className="flex items-center gap-3">
                  <div
                    className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${item.color}`}
                  >
                    <item.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs font-medium">
                      {item.label}
                    </p>
                    <p className="font-bold text-gray-800 dark:text-gray-100">
                      {item.value}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {singleJob?.company && (
            <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-md hover:shadow-lg transition-shadow p-6">
              <h2 className="font-extrabold text-lg mb-3">About the company</h2>
              <div className="flex items-center gap-3 mb-3">
                <div
                  className={`h-12 w-12 rounded-lg border border-gray-100 flex items-center justify-center overflow-hidden shrink-0 font-bold ${getAvatarColor(singleJob.company.name)}`}
                >
                  {singleJob.company.logo ? (
                    <img
                      src={singleJob.company.logo}
                      alt={singleJob.company.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    getInitials(singleJob.company.name)
                  )}
                </div>
                <div>
                  <p className="font-bold text-gray-900 dark:text-white">
                    {singleJob.company.name}
                  </p>
                  {singleJob.company.website && (
                    <a
                      href={singleJob.company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-medium text-[#6A38C2] hover:underline"
                    >
                      {singleJob.company.website}
                    </a>
                  )}
                </div>
              </div>
              {singleJob.company.description && (
                <p className="text-sm text-gray-600 leading-relaxed">
                  {singleJob.company.description}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {similarJobs.length > 0 && (
        <div className="mt-10">
          <h2 className="font-extrabold text-xl mb-4">
            Similar Jobs You Might Like
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {similarJobs.map((job) => (
              <Job key={job._id} job={job} />
            ))}
          </div>
        </div>
      )}

      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-4px_12px_rgba(0,0,0,0.08)] p-3 flex items-center gap-2 z-10">
        <button
          onClick={() => setIsSaved(!isSaved)}
          className="rounded-full border border-gray-200 p-2.5 shrink-0"
        >
          <Bookmark
            className={`h-4 w-4 ${isSaved ? "fill-[#6A38C2] text-[#6A38C2]" : "text-gray-500"}`}
          />
        </button>
        <Button
          onClick={isApplied ? null : applyJobHandler}
          disabled={isApplied || applying}
          className={`flex-1 rounded-lg font-semibold ${isApplied ? "bg-gray-400 cursor-not-allowed" : "bg-[#7209b7] hover:bg-[#5f32ad]"}`}
        >
          {applying ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Applying
            </>
          ) : isApplied ? (
            "Already Applied"
          ) : (
            "Apply Now"
          )}
        </Button>
      </div>
    </div>
  );
};

export default JobDescription;
