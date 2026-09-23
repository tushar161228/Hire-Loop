import express from "express";

import isAuthenticated from "../middlewares/isAuthenticated.js";

import {
  applyJob,
  getAppliedJobs,
  getApplicants,
  updateStatus,
} from "../controllers/application.controller.js";

const router = express.Router();

// ==========================================
// STUDENT
// ==========================================

// Apply for a job
router.route("/apply/:id").post(isAuthenticated, applyJob);

// Get jobs applied by CURRENT logged-in student
router.route("/get").get(isAuthenticated, getAppliedJobs);

// ==========================================
// RECRUITER
// ==========================================

// Get applicants for a particular job
router
  .route("/:id/applicants")
  .get(isAuthenticated, getApplicants);

// Update applicant status
router
  .route("/status/:id/update")
  .post(isAuthenticated, updateStatus);

export default router;