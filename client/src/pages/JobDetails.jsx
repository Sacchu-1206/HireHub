import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { applyForJob } from "../api/applicationApi";
import {
  saveJob,
  checkSavedJob,
  removeSavedJob,
} from "../api/savedJobApi";

function JobDetails() {
  const { id } = useParams();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/jobs/${id}`
        );

        setJob(response.data.job);
      } catch (error) {
        console.error(
          "Failed to fetch job:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  useEffect(() => {
    const checkJobSaved = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setSaved(false);
          return;
        }

        const storedUser =
          localStorage.getItem("user");

        if (!storedUser) {
          return;
        }

        const user = JSON.parse(storedUser);

        if (user.role !== "candidate") {
          return;
        }

        const data = await checkSavedJob(
          id,
          token
        );

        setSaved(data.saved);
      } catch (error) {
        console.error(
          "Failed to check saved job:",
          error
        );
      }
    };

    checkJobSaved();
  }, [id]);

  const handleApply = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login to apply for this job.");
        return;
      }

      const storedUser =
        localStorage.getItem("user");

      if (storedUser) {
        const user = JSON.parse(storedUser);

        if (user.role !== "candidate") {
          alert(
            "Only candidates can apply for jobs."
          );
          return;
        }
      }

      const data = await applyForJob(id, token);

      alert(data.message);
    } catch (error) {
      console.error("Apply failed:", error);

      alert(
        error.response?.data?.message ||
          "Failed to apply for this job."
      );
    }
  };

  const handleSaveJob = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login to save this job.");
        return;
      }

      const storedUser =
        localStorage.getItem("user");

      if (!storedUser) {
        alert("Please login again.");
        return;
      }

      const user = JSON.parse(storedUser);

      if (user.role !== "candidate") {
        alert(
          "Only candidates can save jobs."
        );
        return;
      }

      setSaving(true);

      if (saved) {
        await removeSavedJob(id, token);

        setSaved(false);

        alert("Job removed from saved jobs.");
      } else {
        await saveJob(id, token);

        setSaved(true);

        alert("Job saved successfully.");
      }
    } catch (error) {
      console.error(
        "Save/remove job failed:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to update saved job."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <h2>Loading job...</h2>;
  }

  if (!job) {
    return <h2>Job not found</h2>;
  }

  return (
    <main>
      <h1>{job.title}</h1>

      <h2>{job.company}</h2>

      <p>📍 {job.location}</p>

      <p>💰 {job.salary}</p>

      <p>💼 {job.jobType}</p>

      <h3>Job Description</h3>

      <p>{job.description}</p>

      <h3>Required Skills</h3>

      <div>
        {job.skills.map((skill) => (
          <span key={skill}>
            {skill}{" "}
          </span>
        ))}
      </div>

      <br />

      <button onClick={handleApply}>
        Apply Now
      </button>

      <button
        onClick={handleSaveJob}
        disabled={saving}
        style={{
          marginLeft: "10px",
        }}
      >
        {saving
          ? "Please wait..."
          : saved
          ? "★ Saved"
          : "☆ Save Job"}
      </button>
    </main>
  );
}

export default JobDetails;