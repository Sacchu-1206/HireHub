
const express = require("express");
const mongoose = require("mongoose");
const Job = require("../models/Job");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

const allowedJobTypes = [
  "Full-time",
  "Part-time",
  "Internship",
  "Contract",
];

// Validate required fields for creating a job
const validateJobData = (data, isUpdate = false) => {
  const errors = [];

  const requiredFields = [
    "title",
    "company",
    "location",
    "description",
  ];

  if (!isUpdate) {
    for (const field of requiredFields) {
      if (
        typeof data[field] !== "string" ||
        !data[field].trim()
      ) {
        errors.push(`${field} is required`);
      }
    }
  } else {
    for (const field of requiredFields) {
      if (
        data[field] !== undefined &&
        (typeof data[field] !== "string" ||
          !data[field].trim())
      ) {
        errors.push(`${field} cannot be empty`);
      }
    }
  }

  if (
    data.jobType !== undefined &&
    !allowedJobTypes.includes(data.jobType)
  ) {
    errors.push(
      `jobType must be one of: ${allowedJobTypes.join(", ")}`
    );
  }

  if (
    data.salary !== undefined &&
    typeof data.salary !== "string"
  ) {
    errors.push("salary must be a string");
  }

  if (
    data.skills !== undefined &&
    (!Array.isArray(data.skills) ||
      !data.skills.every(
        (skill) =>
          typeof skill === "string" && skill.trim()
      ))
  ) {
    errors.push("skills must be an array of non-empty strings");
  }

  return errors;
};

// CREATE JOB
// POST /api/jobs
router.post("/", protect, authorize("recruiter"), async (req, res) => {
  try {
    const errors = validateJobData(req.body);

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    const {
      title,
      company,
      location,
      description,
      salary,
      jobType,
      skills,
    } = req.body;

    const job = await Job.create({
      title: title.trim(),
      company: company.trim(),
      location: location.trim(),
      description: description.trim(),
      salary:
        typeof salary === "string" && salary.trim()
          ? salary.trim()
          : "Not disclosed",
      jobType: jobType || "Full-time",
      skills: (skills || []).map((skill) => skill.trim()),
      recruiter: req.user.id,
    });

    return res.status(201).json({
      success: true,
      message: "Job created successfully",
      job,
    });
  } catch (error) {
    console.error("Job creation error:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Invalid job data",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to create job",
    });
  }
});

// GET ALL JOBS
// Supports search, location, jobType, sort, page and limit
router.get("/", async (req, res) => {
  try {
    const {
      search = "",
      location = "",
      jobType = "",
      sort = "latest",
      page = 1,
      limit = 6,
    } = req.query;

    if (
      !["string"].includes(typeof search) ||
      typeof location !== "string" ||
      typeof jobType !== "string" ||
      typeof sort !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid filter values",
      });
    }

    if (jobType && !allowedJobTypes.includes(jobType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid job type filter",
      });
    }

    if (!["latest", "oldest"].includes(sort)) {
      return res.status(400).json({
        success: false,
        message: "Sort must be latest or oldest",
      });
    }

    const currentPage = Number(page);
    const jobsPerPage = Number(limit);

    if (
      !Number.isInteger(currentPage) ||
      currentPage < 1 ||
      !Number.isInteger(jobsPerPage) ||
      jobsPerPage < 1 ||
      jobsPerPage > 100
    ) {
      return res.status(400).json({
        success: false,
        message: "Page must be positive and limit must be between 1 and 100",
      });
    }

    const filter = {};

    // Escape regex characters in user-provided search values
    const escapeRegex = (value) =>
      value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    if (search.trim()) {
      const searchRegex = new RegExp(
        escapeRegex(search.trim()),
        "i"
      );

      filter.$or = [
        { title: searchRegex },
        { company: searchRegex },
        { skills: searchRegex },
      ];
    }

    if (location.trim()) {
      filter.location = new RegExp(
        escapeRegex(location.trim()),
        "i"
      );
    }

    if (jobType) {
      filter.jobType = jobType;
    }

    const sortOption =
      sort === "oldest"
        ? { createdAt: 1 }
        : { createdAt: -1 };

    const totalJobs = await Job.countDocuments(filter);
    const totalPages = Math.ceil(totalJobs / jobsPerPage);
    const skip = (currentPage - 1) * jobsPerPage;

    const jobs = await Job.find(filter)
      .populate("recruiter", "name email")
      .sort(sortOption)
      .skip(skip)
      .limit(jobsPerPage);

    return res.json({
      success: true,
      count: jobs.length,
      totalJobs,
      totalPages,
      currentPage,
      jobsPerPage,
      filters: { search, location, jobType, sort },
      jobs,
    });
  } catch (error) {
    console.error("Get jobs error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch jobs",
    });
  }
});

// GET RECRUITER JOBS
// Keep this route before GET /:id
router.get(
  "/recruiter/my-jobs",
  protect,
  authorize("recruiter"),
  async (req, res) => {
    try {
      const jobs = await Job.find({
        recruiter: req.user.id,
      }).sort({ createdAt: -1 });

      return res.json({
        success: true,
        count: jobs.length,
        jobs,
      });
    } catch (error) {
      console.error("Get recruiter jobs error:", error);

      return res.status(500).json({
        success: false,
        message: "Failed to fetch recruiter jobs",
      });
    }
  }
);

// GET SINGLE JOB
// GET /api/jobs/:id
router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid job ID",
      });
    }

    const job = await Job.findById(req.params.id).populate(
      "recruiter",
      "name email"
    );

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    return res.json({ success: true, job });
  } catch (error) {
    console.error("Get job details error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch job details",
    });
  }
});

// UPDATE JOB
// PUT /api/jobs/:id
router.put(
  "/:id",
  protect,
  authorize("recruiter"),
  async (req, res) => {
    try {
      if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid job ID",
        });
      }

      const errors = validateJobData(req.body, true);

      if (errors.length > 0) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors,
        });
      }

      const job = await Job.findById(req.params.id);

      if (!job) {
        return res.status(404).json({
          success: false,
          message: "Job not found",
        });
      }

      if (
        !job.recruiter ||
        job.recruiter.toString() !== req.user.id
      ) {
        return res.status(403).json({
          success: false,
          message: "You are not authorized to update this job",
        });
      }

      const allowedFields = [
        "title",
        "company",
        "location",
        "description",
        "salary",
        "jobType",
        "skills",
      ];

      for (const field of allowedFields) {
        if (req.body[field] !== undefined) {
          if (typeof req.body[field] === "string") {
            job[field] = req.body[field].trim();
          } else if (field === "skills") {
            job.skills = req.body.skills.map((skill) =>
              skill.trim()
            );
          }
        }
      }

      await job.save();

      return res.json({
        success: true,
        message: "Job updated successfully",
        job,
      });
    } catch (error) {
      console.error("Update job error:", error);

      if (error.name === "ValidationError") {
        return res.status(400).json({
          success: false,
          message: "Invalid job data",
        });
      }

      return res.status(500).json({
        success: false,
        message: "Failed to update job",
      });
    }
  }
);

// DELETE JOB
// DELETE /api/jobs/:id
router.delete(
  "/:id",
  protect,
  authorize("recruiter"),
  async (req, res) => {
    try {
      if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid job ID",
        });
      }

      const job = await Job.findById(req.params.id);

      if (!job) {
        return res.status(404).json({
          success: false,
          message: "Job not found",
        });
      }

      if (
        !job.recruiter ||
        job.recruiter.toString() !== req.user.id
      ) {
        return res.status(403).json({
          success: false,
          message: "You are not authorized to delete this job",
        });
      }

      await Job.findByIdAndDelete(req.params.id);

      return res.json({
        success: true,
        message: "Job deleted successfully",
      });
    } catch (error) {
      console.error("Delete job error:", error);

      return res.status(500).json({
        success: false,
        message: "Failed to delete job",
      });
    }
  }
);

module.exports = router;
