import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover";
import {
  Edit2,
  Eye,
  MoreHorizontal,
  Trash2,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { JOB_API_END_POINT } from "@/utils/constant";
import { setAllAdminJobs } from "@/redux/jobSlice";

const AdminJobsTable = () => {
  const { allAdminJobs, searchJobByText } = useSelector(
    (store) => store.job
  );

  const [filterJobs, setFilterJobs] = useState(allAdminJobs);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // ===============================
  // FILTER JOBS
  // ===============================
  useEffect(() => {
    const filteredJobs = allAdminJobs.filter((job) => {
      if (!searchJobByText) {
        return true;
      }

      return (
        job?.title
          ?.toLowerCase()
          .includes(searchJobByText.toLowerCase()) ||
        job?.company?.name
          ?.toLowerCase()
          .includes(searchJobByText.toLowerCase())
      );
    });

    setFilterJobs(filteredJobs);
  }, [allAdminJobs, searchJobByText]);

  // ===============================
  // DELETE JOB
  // ===============================
  const deleteJobHandler = async (jobId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this job?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const res = await axios.delete(
        `${JOB_API_END_POINT}/delete/${jobId}`,
        {
          withCredentials: true,
        }
      );

      if (res.data.success) {
        toast.success(res.data.message);

        // Remove deleted job from Redux
        const updatedJobs = allAdminJobs.filter(
          (job) => job._id !== jobId
        );

        dispatch(setAllAdminJobs(updatedJobs));
      }
    } catch (error) {
      console.log("Delete Job Error:", error);

      toast.error(
        error?.response?.data?.message ||
          "Failed to delete job"
      );
    }
  };

  return (
    <div>
      <Table>
        <TableCaption>
          A list of your recent posted jobs
        </TableCaption>

        <TableHeader>
          <TableRow>
            <TableHead>Company Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">
              Action
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {filterJobs?.length > 0 ? (
            filterJobs.map((job) => (
              <TableRow key={job?._id}>
                <TableCell>
                  {job?.company?.name || "N/A"}
                </TableCell>

                <TableCell>
                  {job?.title || "N/A"}
                </TableCell>

                <TableCell>
                  {job?.createdAt
                    ? job.createdAt.split("T")[0]
                    : "N/A"}
                </TableCell>

                <TableCell className="text-right">
                  <Popover>
                    <PopoverTrigger asChild>
                      <button className="cursor-pointer p-1">
                        <MoreHorizontal />
                      </button>
                    </PopoverTrigger>

                    <PopoverContent className="w-36">
                      {/* EDIT */}
                      <div
                        onClick={() =>
                          navigate(
                            `/admin/companies/${job?._id}`
                          )
                        }
                        className="flex items-center gap-2 w-fit cursor-pointer"
                      >
                        <Edit2 className="w-4" />
                        <span>Edit</span>
                      </div>

                      {/* APPLICANTS */}
                      <div
                        onClick={() =>
                          navigate(
                            `/admin/jobs/${job?._id}/applicants`
                          )
                        }
                        className="flex items-center gap-2 w-fit cursor-pointer mt-2"
                      >
                        <Eye className="w-4" />
                        <span>Applicants</span>
                      </div>

                      {/* DELETE */}
                      <div
                        onClick={() =>
                          deleteJobHandler(job?._id)
                        }
                        className="flex items-center gap-2 w-fit cursor-pointer mt-2 text-red-600"
                      >
                        <Trash2 className="w-4" />
                        <span>Delete</span>
                      </div>
                    </PopoverContent>
                  </Popover>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={4}
                className="text-center py-6"
              >
                No jobs found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminJobsTable;