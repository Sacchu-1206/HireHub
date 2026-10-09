import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getSavedJobs,
  removeSavedJob,
} from "../api/savedJobApi";
import "./SavedJobs.css";

function SavedJobs() {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSavedJobs = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    const data = await getSavedJobs(token);

    console.log("Saved Jobs API Response:",JSON.stringify(data, null, 2));

    setSavedJobs(data.savedJobs || []);
  } catch (error) {
    console.error("Failed to fetch saved jobs:", error);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const handleRemove = async (jobId) => {
    try {
      const token = localStorage.getItem("token");

      await removeSavedJob(jobId, token);

      setSavedJobs((currentJobs) =>
        currentJobs.filter(
          (savedJob) =>
            savedJob.job?._id !== jobId
        )
      );
    } catch (error) {
      console.error(
        "Failed to remove saved job:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to remove saved job"
      );
    }
  };

  if (loading) {
    return (
      <main className="saved-jobs-page">
        <h2>Loading saved jobs...</h2>
      </main>
    );
  }

  return (
    <main className="saved-jobs-page">
      <div className="saved-jobs-header">
        <h1>Saved Jobs</h1>

        <p>
          Jobs you saved for later.
        </p>
      </div>

      {savedJobs.length === 0 ? (
        <div className="no-saved-jobs">
          <h2>No saved jobs</h2>

          <p>
            Save interesting jobs and find them here later.
          </p>

          <Link to="/jobs">
            Browse Jobs
          </Link>
        </div>
      ) : (
        <div className="saved-jobs-list">
          {savedJobs.map((savedJob) => {
            if (!savedJob.job) {
              return null;
            }

            const job = savedJob.job;

            return (
              <article
                className="saved-job-card"
                key={savedJob._id}
              >
                <div className="saved-job-content">
                  <h2>{job.title}</h2>

                  <p className="saved-job-company">
                    {job.company}
                  </p>

                  <div className="saved-job-info">
                    <span>
                      📍 {job.location}
                    </span>

                    <span>
                      💰 {job.salary}
                    </span>

                    <span>
                      💼 {job.jobType}
                    </span>
                  </div>

                  <div className="saved-job-skills">
                    {job.skills.map((skill) => (
                      <span key={skill}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="saved-job-actions">
                  <Link
                    to={`/jobs/${job._id}`}
                    className="view-job-btn"
                  >
                    View Job
                  </Link>

                  <button
                    className="remove-job-btn"
                    onClick={() =>
                      handleRemove(job._id)
                    }
                  >
                    Remove
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </main>
  );
}

export default SavedJobs;