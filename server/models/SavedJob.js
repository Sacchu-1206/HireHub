const mongoose = require("mongoose");

const savedJobSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },

    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Same candidate same job ko multiple times save nahi kar sakta
savedJobSchema.index(
  { job: 1, candidate: 1 },
  { unique: true }
);

module.exports = mongoose.model(
  "SavedJob",
  savedJobSchema
);