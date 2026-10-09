
const express = require("express");
const mongoose = require("mongoose");
const Application = require("../models/Application");
const Job = require("../models/Job");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

const allowedStatuses = [
  "Applied",
  "Shortlisted",
  "Rejected",
  "Hired",
];

// Candidate - Apply for a job
router.post("/", protect, authorize("candidate"), async (req, res) => {
  try {
    const { jobId } = req.body;

    if (!jobId || typeof jobId !== "string") {
      return res.status(400).json({
        success: false,
        message: "Job ID is required",
      });
    }

    if (!mongoose.isValidObjectId(jobId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid job ID",
      });
    }

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    const application = await Application.create({
      job: jobId,
      candidate: req.user.id,
    });

    return res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      application,
    });
  } catch (error) {
    console.error("Application error:", error);

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "You have already applied for this job",
      });
    }

    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid application data",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to submit application",
    });
  }
});

// Candidate - Get own applications
router.get(
  "/my-applications",
  protect,
  authorize("candidate"),
  async (req, res) => {
    try {
      const applications = await Application.find({
        candidate: req.user.id,
      })
        .populate("job", "title company location salary jobType")
        .sort({ createdAt: -1 });

      return res.json({
        success: true,
        count: applications.length,
        applications,
      });
    } catch (error) {
      console.error("Get applications error:", error);

      return res.status(500).json({
        success: false,
        message: "Failed to fetch applications",
      });
    }
  }
);

// Recruiter - Get applications for recruiter's jobs
router.get(
  "/recruiter-applications",
  protect,
  authorize("recruiter"),
  async (req, res) => {
    try {
      const applications = await Application.find()
        .populate({
          path: "job",
          match: { recruiter: req.user.id },
          select: "title company location",
        })
        .populate("candidate", "name email")
        .sort({ createdAt: -1 });

      const recruiterApplications = applications.filter(
        (application) => application.job !== null
      );

      return res.json({
        success: true,
        count: recruiterApplications.length,
        applications: recruiterApplications,
      });
    } catch (error) {
      console.error("Get recruiter applications error:", error);

      return res.status(500).json({
        success: false,
        message: "Failed to fetch recruiter applications",
      });
    }
  }
);

// Recruiter - Update application status
router.patch(
  "/:id/status",
  protect,
  authorize("recruiter"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid application ID",
        });
      }

      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: `Invalid status. Allowed values: ${allowedStatuses.join(", ")}`,
        });
      }

      const application = await Application.findById(id).populate("job");

      if (!application) {
        return res.status(404).json({
          success: false,
          message: "Application not found",
        });
      }

      // Handle applications whose job has been deleted
      if (!application.job) {
        return res.status(404).json({
          success: false,
          message: "The job for this application is no longer available",
        });
      }

      // Ensure the recruiter owns the job
      if (
        !application.job.recruiter ||
        application.job.recruiter.toString() !== req.user.id
      ) {
        return res.status(403).json({
          success: false,
          message: "You are not authorized to update this application",
        });
      }

      application.status = status;
      await application.save();

      return res.json({
        success: true,
        message: "Application status updated successfully",
        application,
      });
    } catch (error) {
      console.error("Update application status error:", error);

      if (error.name === "ValidationError" || error.name === "CastError") {
        return res.status(400).json({
          success: false,
          message: "Invalid application data",
        });
      }

      return res.status(500).json({
        success: false,
        message: "Failed to update application status",
      });
    }
  }
);

module.exports = router;
