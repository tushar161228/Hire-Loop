import React, { useEffect } from "react";
import Navbar from "../shared/Navbar";
import ApplicantsTable from "./ApplicantsTable";
import axios from "axios";
import { APPLICATION_API_END_POINT } from "@/utils/constant";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setAllApplicants } from "@/redux/applicationSlice";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const Applicants = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { applicants } = useSelector((store) => store.application);

  useEffect(() => {
    const fetchAllApplicants = async () => {
      try {
        const res = await axios.get(
          `${APPLICATION_API_END_POINT}/${params.id}/applicants`,
          { withCredentials: true },
        );
        if (res.data.success) {
          console.log("API RESPONSE:", res.data.job);
          dispatch(setAllApplicants(res.data.job));
        } else {
          toast.error(res.data.message || "Failed to load applicants");
        }
      } catch (error) {
        console.log(error);
        toast.error(
          error?.response?.data?.message || "Failed to load applicants",
        );
      }
    };
    fetchAllApplicants();
  }, []);
  return (
    <div className="dark:bg-gray-950 min-h-screen transition-colors">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4">
        <button
          onClick={() => navigate("/admin/jobs")}
          className="flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-900 dark:hover:text-white mt-5 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to jobs
        </button>
        <h1 className="font-extrabold text-xl my-5 dark:text-white">
          Applicants {applicants?.applications?.length}
        </h1>
        <ApplicantsTable />
      </div>
    </div>
  );
};

export default Applicants;
