import "./Categories.css";
function Categories() {
  const categories = [
    "Frontend Development",
    "Backend Development",
    "Full Stack Development",
    "Data Science",
    "UI/UX Design",
    "Digital Marketing",
  ];

  return (
    <section className="categories">
      <h2>Explore Job Categories</h2>

      <div className="category-list">
        {categories.map((category) => (
          <div className="category-card" key={category}>
            <h3>{category}</h3>
            <p>Explore opportunities</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Categories;