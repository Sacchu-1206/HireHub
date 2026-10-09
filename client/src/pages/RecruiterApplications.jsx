import { useEffect, useState } from "react";
import {
  getRecruiterApplications,
  updateApplicationStatus,
} from "../api/applicationApi";

function RecruiterApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        return;
      }

      const data = await getRecruiterApplications(token);

      setApplications(data.applications);
    } catch (error) {
      console.error("Failed to fetch recruiter applications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleStatusChange = async (applicationId, status) => {
    try {
      const token = localStorage.getItem("token");

      const data = await updateApplicationStatus(
        applicationId,
        status,
        token
      );

      setApplications((currentApplications) =>
        currentApplications.map((application) =>
          application._id === applicationId
            ? {
                ...application,
                status: data.application.status,
              }
            : application
        )
      );
    } catch (error) {
      console.error("Failed to update status:", error);

      alert(
        error.response?.data?.message ||
          "Failed to update application status"
      );
    }
  };

  if (loading) {
    return <h2>Loading applications...</h2>;
  }

  return (
    <main>
      <h1>Recruiter Applications</h1>

      {applications.length === 0 ? (
        <p>No applications found.</p>
      ) : (
        applications.map((application) => (
          <div key={application._id}>
            <h2>{application.job.title}</h2>

            <p>{application.job.company}</p>

            <p>
              Candidate: {application.candidate.name}
            </p>

            <p>
              Email: {application.candidate.email}
            </p>

            <p>
              Current Status: {application.status}
            </p>

            <select
              value={application.status}
              onChange={(e) =>
                handleStatusChange(
                  application._id,
                  e.target.value
                )
              }
            >
              <option value="Applied">Applied</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Rejected">Rejected</option>
              <option value="Hired">Hired</option>
            </select>
          </div>
        ))
      )}
    </main>
  );
}

export default RecruiterApplications;