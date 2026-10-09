import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getJobs } from "../api/jobApi";
import "./Jobs.css";

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("");
  const [sort, setSort] = useState("latest");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const jobsPerPage = 6;

  const fetchJobs = async (pageNumber = page) => {
    try {
      setLoading(true);

      const data = await getJobs({
        search,
        location,
        jobType,
        sort,
        page: pageNumber,
        limit: jobsPerPage,
      });

      setJobs(data.jobs || []);
      setTotalPages(data.totalPages || 1);
      setPage(data.currentPage || pageNumber);
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs(1);
  }, [sort]);

  const handleSearch = (e) => {
    e.preventDefault();

    setPage(1);
    fetchJobs(1);
  };

  const handleClearFilters = () => {
    setSearch("");
    setLocation("");
    setJobType("");
    setSort("latest");
    setPage(1);
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) {
      return;
    }

    setPage(pageNumber);
    fetchJobs(pageNumber);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <main className="jobs-page">
      <div className="jobs-header">
        <h1>Find Your Next Job</h1>

        <p>
          Explore opportunities that match your skills and career goals.
        </p>

        <form
          className="job-filters"
          onSubmit={handleSearch}
        >
          <input
            type="text"
            placeholder="Job title, company or skill"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />

          <select
            value={jobType}
            onChange={(e) => setJobType(e.target.value)}
          >
            <option value="">All Job Types</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Internship">Internship</option>
            <option value="Contract">Contract</option>
          </select>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="latest">Latest Jobs</option>
            <option value="oldest">Oldest Jobs</option>
          </select>

          <button type="submit">
            Search
          </button>

          <button
            type="button"
            className="clear-btn"
            onClick={handleClearFilters}
          >
            Clear
          </button>
        </form>
      </div>

      <div className="jobs-result-header">
        <h2>Available Jobs</h2>

        <span>
          {jobs.length}{" "}
          {jobs.length === 1 ? "job" : "jobs"} found
        </span>
      </div>

      {loading ? (
        <div className="jobs-message">
          <h2>Loading jobs...</h2>
        </div>
      ) : jobs.length === 0 ? (
        <div className="jobs-message">
          <h2>No jobs found</h2>

          <p>
            Try changing your search or filters.
          </p>
        </div>
      ) : (
        <>
          <div className="jobs-grid">
            {jobs.map((job) => (
              <article
                className="job-card"
                key={job._id}
              >
                <div className="job-card-header">
                  <div>
                    <h2>{job.title}</h2>

                    <p className="company-name">
                      {job.company}
                    </p>
                  </div>

                  <span className="job-type">
                    {job.jobType}
                  </span>
                </div>

                <div className="job-info">
                  <span>
                    📍 {job.location}
                  </span>

                  <span>
                    💰 {job.salary}
                  </span>
                </div>

                <p className="job-description">
                  {job.description}
                </p>

                <div className="skills">
                  {job.skills.map((skill) => (
                    <span key={skill}>
                      {skill}
                    </span>
                  ))}
                </div>

                <Link
                  to={`/jobs/${job._id}`}
                  className="apply-btn"
                >
                  View Job
                </Link>
              </article>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() =>
                  handlePageChange(page - 1)
                }
                disabled={page === 1}
              >
                Previous
              </button>

              {Array.from(
                { length: totalPages },
                (_, index) => index + 1
              ).map((pageNumber) => (
                <button
                  key={pageNumber}
                  className={
                    page === pageNumber
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    handlePageChange(pageNumber)
                  }
                >
                  {pageNumber}
                </button>
              ))}

              <button
                onClick={() =>
                  handlePageChange(page + 1)
                }
                disabled={page === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </main>
  );
}

export default Jobs;