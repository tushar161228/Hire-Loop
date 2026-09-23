import React, { useEffect, useState } from "react";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

import { Badge } from "./ui/badge";

import { useSelector } from "react-redux";

import axios from "axios";

import { APPLICATION_API_END_POINT } from "@/utils/constant";

const AppliedJobTable = () => {
  // =====================================================
  // CURRENT USER
  // =====================================================

  const { user } = useSelector((store) => store.auth);

  // =====================================================
  // LOCAL APPLICATION STATE
  // =====================================================

  const [applications, setApplications] = useState([]);

  const [loading, setLoading] = useState(true);

  // =====================================================
  // FETCH APPLIED JOBS
  // =====================================================

  useEffect(() => {
    if (!user?._id) {
      return;
    }

    if (user?.role !== "student") {
      setLoading(false);
      return;
    }

    const fetchAppliedJobs = async () => {
      try {
        setLoading(true);

        const res = await axios.get(
          `${APPLICATION_API_END_POINT}/get`,
          {
            withCredentials: true,
          }
        );

        console.log(
          "Applied Jobs API Response:",
          res.data
        );

        if (res.data?.success) {
          const fetchedApplications = Array.isArray(
            res.data?.application
          )
            ? res.data.application
            : [];

          console.log(
            "Applications received:",
            fetchedApplications
          );

          console.log(
            "Number of applications:",
            fetchedApplications.length
          );

          setApplications(fetchedApplications);
        } else {
          setApplications([]);
        }
      } catch (error) {
        console.log(
          "Fetch Applied Jobs Error:",
          error
        );

        console.log(
          "Backend Response:",
          error?.response?.data
        );

        setApplications([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAppliedJobs();
  }, [user?._id, user?.role]);

  // =====================================================
  // WAIT FOR USER
  // =====================================================

  if (!user?._id) {
    return (
      <div className="w-full py-10 text-center text-gray-400">
        Loading applied jobs...
      </div>
    );
  }

  // =====================================================
  // TABLE
  // =====================================================

  return (
    <div className="w-full">
      <Table>

        <TableCaption>
          A list of your applied jobs
        </TableCaption>

        {/* =================================================
            TABLE HEADER
        ================================================= */}

        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>

            <TableHead>Job Role</TableHead>

            <TableHead>Company</TableHead>

            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>

        {/* =================================================
            TABLE BODY
        ================================================= */}

        <TableBody>

          {/* LOADING */}

          {loading ? (
            <TableRow>
              <TableCell
                colSpan={4}
                className="text-center py-10 text-gray-400"
              >
                Loading applied jobs...
              </TableCell>
            </TableRow>
          ) : applications.length === 0 ? (

            /* NO APPLICATIONS */

            <TableRow>
              <TableCell
                colSpan={4}
                className="text-center py-10 text-gray-500"
              >
                You have not applied for any jobs yet.
              </TableCell>
            </TableRow>

          ) : (

            /* APPLICATIONS */

            applications.map((application) => {

              const job = application?.job;

              const company = job?.company;

              const status =
                application?.status
                  ?.toString()
                  .toLowerCase()
                  .trim() || "pending";

              return (
                <TableRow
                  key={application?._id}
                >

                  {/* DATE */}

                  <TableCell>
                    {application?.createdAt
                      ? new Date(
                          application.createdAt
                        ).toLocaleDateString()
                      : "N/A"}
                  </TableCell>

                  {/* JOB ROLE */}

                  <TableCell className="font-medium">
                    {job?.title || "N/A"}
                  </TableCell>

                  {/* COMPANY */}

                  <TableCell>
                    {company?.name || "N/A"}
                  </TableCell>

                  {/* STATUS */}

                  <TableCell>

                    {status === "accepted" && (
                      <Badge className="bg-green-600 hover:bg-green-600 text-white">
                        ACCEPTED
                      </Badge>
                    )}

                    {status === "rejected" && (
                      <Badge className="bg-red-600 hover:bg-red-600 text-white">
                        REJECTED
                      </Badge>
                    )}

                    {status === "pending" && (
                      <Badge className="bg-yellow-600 hover:bg-yellow-600 text-white">
                        PENDING
                      </Badge>
                    )}

                  </TableCell>

                </TableRow>
              );
            })
          )}

        </TableBody>
      </Table>
    </div>
  );
};

export default AppliedJobTable;