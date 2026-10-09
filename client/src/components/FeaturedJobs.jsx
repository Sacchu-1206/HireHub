import "./FeaturedJobs.css";

function FeaturedJobs() {
  const jobs = [
    {
      id: 1,
      title: "React.js Developer",
      company: "TechNova Solutions",
      location: "Indore, Madhya Pradesh",
      type: "Full Time",
    },
    {
      id: 2,
      title: "MERN Stack Developer",
      company: "CodeCraft Technologies",
      location: "Remote",
      type: "Full Time",
    },
    {
      id: 3,
      title: "Frontend Developer",
      company: "PixelWorks",
      location: "Bangalore, India",
      type: "Internship",
    },
  ];

  return (
    <section className="featured-jobs">
      <h2>Featured Jobs</h2>

      <div className="job-list">
        {jobs.map((job) => (
          <div className="job-card" key={job.id}>
            <h3>{job.title}</h3>

            <p>{job.company}</p>

            <p>{job.location}</p>

            <span>{job.type}</span>

            <button>View Details</button>
          </div>
        ))}
      </div>
    </section>
  );
}

export default FeaturedJobs;