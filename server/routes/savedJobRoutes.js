const express = require("express");
const SavedJob = require("../models/SavedJob");
const Job = require("../models/Job");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

/*
  SAVE JOB
  POST /api/saved-jobs
*/
router.post(
  "/",
  protect,
  authorize("candidate"),
  async (req, res) => {
    try {
      const { jobId } = req.body;

      if (!jobId) {
        return res.status(400).json({
          success: false,
          message: "Job ID is required",
        });
      }

      const job = await Job.findById(jobId);

      if (!job) {
        return res.status(404).json({
          success: false,
          message: "Job not found",
        });
      }

      try {
        const savedJob = await SavedJob.create({
          job: jobId,
          candidate: req.user.id,
        });

        res.status(201).json({
          success: true,
          message: "Job saved successfully",
          savedJob,
        });
      } catch (error) {
        if (error.code === 11000) {
          return res.status(400).json({
            success: false,
            message: "Job is already saved",
          });
        }

        throw error;
      }
    } catch (error) {
      console.error("Save job error:", error);

      res.status(500).json({
        success: false,
        message: "Failed to save job",
      });
    }
  }
);


/*
  GET SAVED JOBS
  GET /api/saved-jobs
*/
router.get(
  "/",
  protect,
  authorize("candidate"),
  async (req, res) => {
    try {
      const savedJobs = await SavedJob.find({
        candidate: req.user.id,
      })
        .populate(
          "job",
          "title company location salary jobType skills description"
        )
        .sort({ createdAt: -1 });

      res.json({
        success: true,
        count: savedJobs.length,
        savedJobs,
      });
    } catch (error) {
      console.error("Get saved jobs error:", error);

      res.status(500).json({
        success: false,
        message: "Failed to fetch saved jobs",
      });
    }
  }
);


/*
  CHECK IF JOB IS SAVED
  GET /api/saved-jobs/check/:jobId
*/
router.get(
  "/check/:jobId",
  protect,
  authorize("candidate"),
  async (req, res) => {
    try {
      const savedJob = await SavedJob.findOne({
        job: req.params.jobId,
        candidate: req.user.id,
      });

      res.json({
        success: true,
        saved: !!savedJob,
      });
    } catch (error) {
      console.error("Check saved job error:", error);

      res.status(500).json({
        success: false,
        message: "Failed to check saved job",
      });
    }
  }
);


/*
  REMOVE SAVED JOB
  DELETE /api/saved-jobs/:jobId
*/
router.delete(
  "/:jobId",
  protect,
  authorize("candidate"),
  async (req, res) => {
    try {
      const savedJob = await SavedJob.findOneAndDelete({
        job: req.params.jobId,
        candidate: req.user.id,
      });

      if (!savedJob) {
        return res.status(404).json({
          success: false,
          message: "Saved job not found",
        });
      }

      res.json({
        success: true,
        message: "Job removed from saved jobs",
      });
    } catch (error) {
      console.error("Remove saved job error:", error);

      res.status(500).json({
        success: false,
        message: "Failed to remove saved job",
      });
    }
  }
);

module.exports = router;