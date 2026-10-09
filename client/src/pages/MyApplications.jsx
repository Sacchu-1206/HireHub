import { useEffect, useState } from "react";
import { getMyApplications } from "../api/applicationApi";
import "./MyApplications.css";

function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setLoading(false);
          return;
        }

        const data = await getMyApplications(token);

        setApplications(data.applications || []);
      } catch (error) {
        console.error(
          "Failed to fetch applications:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  if (loading) {
    return (
      <main className="my-applications-page">
        <h2>Loading applications...</h2>
      </main>
    );
  }

  return (
    <main className="my-applications-page">
      <div className="my-applications-header">
        <h1>My Applications</h1>
        <p>Track the jobs you have applied for.</p>
      </div>

      {applications.length === 0 ? (
        <p className="no-applications">
          No applications found.
        </p>
      ) : (
        <div className="applications-list">
          {applications.map((application) => {
            // Job delete ho chuki hai to job null ho sakti hai
            if (!application.job) {
              return (
                <div
                  className="application-card"
                  key={application._id}
                >
                  <h2>Job No Longer Available</h2>

                  <p className="application-company">
                    This job has been removed by the recruiter.
                  </p>

                  <span className="application-status">
                    {application.status}
                  </span>
                </div>
              );
            }

            return (
              <div
                className="application-card"
                key={application._id}
              >
                <h2>{application.job.title}</h2>

                <p className="application-company">
                  {application.job.company}
                </p>

                <div className="application-info">
                  <span>
                    📍 {application.job.location}
                  </span>

                  <span>
                    💰 {application.job.salary}
                  </span>

                  <span>
                    💼 {application.job.jobType}
                  </span>
                </div>

                <span className="application-status">
                  {application.status}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}

export default MyApplications;