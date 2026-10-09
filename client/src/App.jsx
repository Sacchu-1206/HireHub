import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Jobs from "./pages/Jobs";
import Login from "./pages/Login";
import Register from "./pages/Register";
import JobDetails from "./pages/JobDetails";
import MyApplications from "./pages/MyApplications";
import RecruiterApplications from "./pages/RecruiterApplications";
import RecruiterJobs from "./pages/RecruiterJobs";
import Profile from "./pages/Profile";
import SavedJobs from "./pages/SavedJobs";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminJobs from "./pages/AdminJobs";
import AdminApplications from "./pages/AdminApplications";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

     <Routes>
  {/* Public Routes */}
  <Route path="/" element={<Home />} />
  <Route path="/jobs" element={<Jobs />} />
  <Route path="/jobs/:id" element={<JobDetails />} />
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />

  {/* Candidate Routes */}
  <Route element={<ProtectedRoute allowedRoles={["candidate"]} />}>
    <Route
      path="/my-applications"
      element={<MyApplications />}
    />

    <Route
      path="/saved-jobs"
      element={<SavedJobs />}
    />

    <Route
      path="/profile"
      element={<Profile />}
    />
  </Route>

  {/* Recruiter Routes */}
  <Route element={<ProtectedRoute allowedRoles={["recruiter"]} />}>
    <Route
      path="/recruiter-jobs"
      element={<RecruiterJobs />}
    />

    <Route
      path="/recruiter-applications"
      element={<RecruiterApplications />}
    />
  </Route>

  {/* Admin Routes */}
  <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
    <Route
      path="/admin-dashboard"
      element={<AdminDashboard />}
    />

    <Route
      path="/admin-users"
      element={<AdminUsers />}
    />

    <Route
      path="/admin-jobs"
      element={<AdminJobs />}
    />

    <Route
      path="/admin-applications"
      element={<AdminApplications />}
    />
  </Route>
</Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;