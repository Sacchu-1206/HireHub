import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
      "http://localhost:5000/api/auth/login",
     {
       email: email.trim(),
       password,
  }
);

      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // Navbar ko immediately update karne ke liye
      window.dispatchEvent(new Event("authChanged"));

      alert("Login successful");

      // Role ke according redirect
      if (user.role === "candidate") {
        navigate("/profile");
      } else if (user.role === "recruiter") {
        navigate("/recruiter-jobs");
      } else if (user.role === "admin") {
        navigate("/");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Login failed:", error);

      alert(
        error.response?.data?.message ||
          "Login failed"
      );
    }
  };

  return (
    <main className="login-page">
      <div className="login-card">
        <h1>Welcome Back</h1>

        <p>
          Login to continue to HireHub
        </p>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            required
          />

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            required
          />

          <button type="submit">
            Login
          </button>
        </form>

        <p className="register-link">
          Don't have an account?{" "}
          <Link to="/register">
            Create Account
          </Link>
        </p>
      </div>
    </main>
  );
}

export default Login;