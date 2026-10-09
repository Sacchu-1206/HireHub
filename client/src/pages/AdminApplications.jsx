import { useEffect, useState } from "react";
import { getAdminApplications } from "../api/adminApi";

function AdminApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      const data = await getAdminApplications(token);

      setApplications(data.applications || []);
    } catch (error) {
      console.error(
        "Failed to fetch admin applications:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  if (loading) {
    return (
      <main>
        <h2>Loading applications...</h2>
      </main>
    );
  }

  return (
    <main>
      <h1>Manage Applications</h1>

      <p>
        Total Applications: {applications.length}
      </p>

      {applications.length === 0 ? (
        <p>No applications found.</p>
      ) : (
        <div>
          {applications.map((application) => (
            <div key={application._id}>
              <h2>
                {application.job
                  ? application.job.title
                  : "Job No Longer Available"}
              </h2>

              <p>
                Candidate:{" "}
                {application.candidate?.name ||
                  "Candidate unavailable"}
              </p>

              <p>
                Email:{" "}
                {application.candidate?.email ||
                  "Email unavailable"}
              </p>

              {application.job && (
                <>
                  <p>
                    Company: {application.job.company}
                  </p>

                  <p>
                    Location: {application.job.location}
                  </p>

                  <p>
                    Job Type: {application.job.jobType}
                  </p>
                </>
              )}

              {!application.job && (
                <p>
                  This job has been removed by the
                  recruiter.
                </p>
              )}

              <p>
                Status:{" "}
                <strong>
                  {application.status}
                </strong>
              </p>

              <p>
                Applied On:{" "}
                {new Date(
                  application.createdAt
                ).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

export default AdminApplications;