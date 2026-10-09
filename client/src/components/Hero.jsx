import "./Hero.css";

function Hero() {
  return (
    <section className="hero">
      <h1>Find Your Next Opportunity</h1>

      <p>
        Discover jobs that match your skills and career goals.
      </p>

      <div className="search-box">
        <input
          type="text"
          placeholder="Job title or keyword"
        />

        <input
          type="text"
          placeholder="Location"
        />

        <button>Search Jobs</button>
      </div>
    </section>
  );
}

export default Hero;