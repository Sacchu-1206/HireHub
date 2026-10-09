const express = require("express");
const User = require("../models/User");
const Job = require("../models/Job");
const Application = require("../models/Application");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

// Admin dashboard statistics
router.get(
  "/dashboard",
  protect,
  authorize("admin"),
  async (req, res) => {
    try {
      const totalUsers = await User.countDocuments();

      const totalCandidates = await User.countDocuments({
        role: "candidate",
      });

      const totalRecruiters = await User.countDocuments({
        role: "recruiter",
      });

      const totalJobs = await Job.countDocuments();

      const totalApplications =
        await Application.countDocuments();

      const appliedApplications =
        await Application.countDocuments({
          status: "Applied",
        });

      const shortlistedApplications =
        await Application.countDocuments({
          status: "Shortlisted",
        });

      const rejectedApplications =
        await Application.countDocuments({
          status: "Rejected",
        });

      const hiredApplications =
        await Application.countDocuments({
          status: "Hired",
        });

      res.json({
        success: true,
        statistics: {
          totalUsers,
          totalCandidates,
          totalRecruiters,
          totalJobs,
          totalApplications,
          applicationsByStatus: {
            Applied: appliedApplications,
            Shortlisted: shortlistedApplications,
            Rejected: rejectedApplications,
            Hired: hiredApplications,
          },
        },
      });
    } catch (error) {
      console.error(
        "Admin dashboard error:",
        error
      );

      res.status(500).json({
        success: false,
        message: "Failed to fetch admin dashboard",
      });
    }
  }
);

// Get all users
router.get(
  "/users",
  protect,
  authorize("admin"),
  async (req, res) => {
    try {
      const users = await User.find()
        .select("-password")
        .sort({ createdAt: -1 });

      res.json({
        success: true,
        count: users.length,
        users,
      });
    } catch (error) {
      console.error("Get users error:", error);

      res.status(500).json({
        success: false,
        message: "Failed to fetch users",
      });
    }
  }
);

// Delete user
router.delete(
  "/users/:id",
  protect,
  authorize("admin"),
  async (req, res) => {
    try {
      const user = await User.findById(req.params.id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Admin cannot delete their own account
      if (user._id.toString() === req.user.id) {
        return res.status(400).json({
          success: false,
          message: "You cannot delete your own admin account",
        });
      }

      await User.findByIdAndDelete(req.params.id);

      res.json({
        success: true,
        message: "User deleted successfully",
      });
    } catch (error) {
      console.error("Delete user error:", error);

      res.status(500).json({
        success: false,
        message: "Failed to delete user",
      });
    }
  }
);

router.get(
  "/jobs",
  protect,
  authorize("admin"),
  async (req, res) => {
    try {
      const jobs = await Job.find()
        .populate("recruiter", "name email")
        .sort({ createdAt: -1 });

      res.json({
        success: true,
        count: jobs.length,
        jobs,
      });
    } catch (error) {
      console.error("Get admin jobs error:", error);

      res.status(500).json({
        success: false,
        message: "Failed to fetch jobs",
      });
    }
  }
);

router.delete(
  "/jobs/:id",
  protect,
  authorize("admin"),
  async (req, res) => {
    try {
      const job = await Job.findById(req.params.id);

      if (!job) {
        return res.status(404).json({
          success: false,
          message: "Job not found",
        });
      }

      await Job.findByIdAndDelete(req.params.id);

      res.json({
        success: true,
        message: "Job deleted successfully",
      });
    } catch (error) {
      console.error("Delete admin job error:", error);

      res.status(500).json({
        success: false,
        message: "Failed to delete job",
      });
    }
  }
);

// Get all applications
router.get(
  "/applications",
  protect,
  authorize("admin"),
  async (req, res) => {
    try {
      const applications = await Application.find()
        .populate(
          "job",
          "title company location salary jobType"
        )
        .populate(
          "candidate",
          "name email"
        )
        .sort({ createdAt: -1 });

      res.json({
        success: true,
        count: applications.length,
        applications,
      });
    } catch (error) {
      console.error(
        "Get admin applications error:",
        error
      );

      res.status(500).json({
        success: false,
        message: "Failed to fetch applications",
      });
    }
  }
);
module.exports = router;