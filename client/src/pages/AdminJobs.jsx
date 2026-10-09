import { useEffect, useState } from "react";
import {
  getAdminJobs,
  deleteAdminJob,
} from "../api/adminApi";

function AdminJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      const data = await getAdminJobs(token);

      setJobs(data.jobs || []);
    } catch (error) {
      console.error(
        "Failed to fetch admin jobs:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleDelete = async (jobId, jobTitle) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${jobTitle}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await deleteAdminJob(jobId, token);

      setJobs((currentJobs) =>
        currentJobs.filter(
          (job) => job._id !== jobId
        )
      );

      alert("Job deleted successfully.");
    } catch (error) {
      console.error(
        "Failed to delete job:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to delete job."
      );
    }
  };

  if (loading) {
    return (
      <main>
        <h2>Loading jobs...</h2>
      </main>
    );
  }

  return (
    <main>
      <h1>Manage Jobs</h1>

      <p>
        Total Jobs: {jobs.length}
      </p>

      {jobs.length === 0 ? (
        <p>No jobs found.</p>
      ) : (
        <div>
          {jobs.map((job) => (
            <div key={job._id}>
              <h2>{job.title}</h2>

              <p>
                Company: {job.company}
              </p>

              <p>
                Location: {job.location}
              </p>

              <p>
                Salary: {job.salary}
              </p>

              <p>
                Job Type: {job.jobType}
              </p>

              <p>
                Recruiter:{" "}
                {job.recruiter?.name ||
                  "Recruiter no longer available"}
              </p>

              <p>
                Created:{" "}
                {new Date(
                  job.createdAt
                ).toLocaleDateString()}
              </p>

              <button
                onClick={() =>
                  handleDelete(
                    job._id,
                    job.title
                  )
                }
              >
                Delete Job
              </button>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

export default AdminJobs;