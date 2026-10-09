import { useEffect, useState } from "react";
import {
  getRecruiterJobs,
  updateJob,
  deleteJob,
} from "../api/jobApi";

function RecruiterJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editingJob, setEditingJob] = useState(null);

  const fetchJobs = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        return;
      }

      const data = await getRecruiterJobs(token);

      setJobs(data.jobs);
    } catch (error) {
      console.error("Failed to fetch recruiter jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleDelete = async (jobId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this job?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await deleteJob(jobId, token);

      setJobs((currentJobs) =>
        currentJobs.filter((job) => job._id !== jobId)
      );

      alert("Job deleted successfully");
    } catch (error) {
      console.error("Delete job failed:", error);

      alert(
        error.response?.data?.message ||
          "Failed to delete job"
      );
    }
  };

  const handleEdit = (job) => {
    setEditingJob({
      ...job,
      skills: job.skills.join(", "),
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const updatedJobData = {
        ...editingJob,
        skills: editingJob.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean),
      };

      const data = await updateJob(
        editingJob._id,
        updatedJobData,
        token
      );

      setJobs((currentJobs) =>
        currentJobs.map((job) =>
          job._id === editingJob._id
            ? data.job
            : job
        )
      );

      setEditingJob(null);

      alert("Job updated successfully");
    } catch (error) {
      console.error("Update job failed:", error);

      alert(
        error.response?.data?.message ||
          "Failed to update job"
      );
    }
  };

  if (loading) {
    return <h2>Loading jobs...</h2>;
  }

  return (
    <main>
      <h1>My Jobs</h1>

      {jobs.length === 0 ? (
        <p>No jobs found.</p>
      ) : (
        jobs.map((job) => (
          <div key={job._id}>
            <h2>{job.title}</h2>

            <p>{job.company}</p>

            <p>📍 {job.location}</p>

            <p>💰 {job.salary}</p>

            <p>💼 {job.jobType}</p>

            <p>{job.description}</p>

            <p>
              Skills: {job.skills.join(", ")}
            </p>

            <button onClick={() => handleEdit(job)}>
              Edit
            </button>

            <button onClick={() => handleDelete(job._id)}>
              Delete
            </button>
          </div>
        ))
      )}

      {editingJob && (
        <div>
          <h2>Edit Job</h2>

          <form onSubmit={handleUpdate}>
            <input
              value={editingJob.title}
              onChange={(e) =>
                setEditingJob({
                  ...editingJob,
                  title: e.target.value,
                })
              }
              placeholder="Job title"
            />

            <input
              value={editingJob.company}
              onChange={(e) =>
                setEditingJob({
                  ...editingJob,
                  company: e.target.value,
                })
              }
              placeholder="Company"
            />

            <input
              value={editingJob.location}
              onChange={(e) =>
                setEditingJob({
                  ...editingJob,
                  location: e.target.value,
                })
              }
              placeholder="Location"
            />

            <input
              value={editingJob.salary}
              onChange={(e) =>
                setEditingJob({
                  ...editingJob,
                  salary: e.target.value,
                })
              }
              placeholder="Salary"
            />

            <textarea
              value={editingJob.description}
              onChange={(e) =>
                setEditingJob({
                  ...editingJob,
                  description: e.target.value,
                })
              }
              placeholder="Description"
            />

            <input
              value={editingJob.skills}
              onChange={(e) =>
                setEditingJob({
                  ...editingJob,
                  skills: e.target.value,
                })
              }
              placeholder="JavaScript, React, Node.js"
            />

            <button type="submit">
              Save Changes
            </button>

            <button
              type="button"
              onClick={() => setEditingJob(null)}
            >
              Cancel
            </button>
          </form>
        </div>
      )}
    </main>
  );
}

export default RecruiterJobs;