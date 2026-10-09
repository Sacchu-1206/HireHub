import { useEffect, useState } from "react";
import { getAdminDashboard } from "../api/adminApi";

function AdminDashboard() {
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setLoading(false);
          return;
        }

        const data = await getAdminDashboard(token);

        setStatistics(data.statistics);
      } catch (error) {
        console.error(
          "Failed to fetch admin dashboard:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <main>
        <h2>Loading admin dashboard...</h2>
      </main>
    );
  }

  if (!statistics) {
    return (
      <main>
        <h2>Unable to load dashboard</h2>
      </main>
    );
  }

  return (
    <main>
      <h1>Admin Dashboard</h1>

      <div>
        <div>
          <h3>Total Users</h3>
          <p>{statistics.totalUsers}</p>
        </div>

        <div>
          <h3>Candidates</h3>
          <p>{statistics.totalCandidates}</p>
        </div>

        <div>
          <h3>Recruiters</h3>
          <p>{statistics.totalRecruiters}</p>
        </div>

        <div>
          <h3>Total Jobs</h3>
          <p>{statistics.totalJobs}</p>
        </div>

        <div>
          <h3>Total Applications</h3>
          <p>{statistics.totalApplications}</p>
        </div>
      </div>

      <h2>Applications by Status</h2>

      <div>
        <div>
          <h3>Applied</h3>
          <p>
            {statistics.applicationsByStatus.Applied}
          </p>
        </div>

        <div>
          <h3>Shortlisted</h3>
          <p>
            {statistics.applicationsByStatus.Shortlisted}
          </p>
        </div>

        <div>
          <h3>Rejected</h3>
          <p>
            {statistics.applicationsByStatus.Rejected}
          </p>
        </div>

        <div>
          <h3>Hired</h3>
          <p>
            {statistics.applicationsByStatus.Hired}
          </p>
        </div>
      </div>
    </main>
  );
}

export default AdminDashboard;