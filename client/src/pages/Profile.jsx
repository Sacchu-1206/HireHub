import { useEffect, useState } from "react";
import { getProfile, updateProfile } from "../api/authApi";
import "./Profile.css";

function Profile() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    skills: [],
    education: "",
    experience: "",
    bio: "",
    resume: "",
  });

  const [skillsInput, setSkillsInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first.");
        return;
      }

      const data = await getProfile(token);

      setProfile(data.user);

      setSkillsInput(data.user.skills?.join(", ") || "");
    } catch (error) {
      console.error("Failed to fetch profile:", error);

      alert(
        error.response?.data?.message ||
          "Failed to load profile"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setProfile((currentProfile) => ({
      ...currentProfile,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const token = localStorage.getItem("token");

      const updatedProfile = {
        name: profile.name,
        phone: profile.phone,
        skills: skillsInput
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean),
        education: profile.education,
        experience: profile.experience,
        bio: profile.bio,
        resume: profile.resume,
      };

      const data = await updateProfile(
        updatedProfile,
        token
      );

      setProfile(data.user);
      setSkillsInput(data.user.skills?.join(", ") || "");

      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Failed to update profile:", error);

      alert(
        error.response?.data?.message ||
          "Failed to update profile"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="profile-page">
        <h2>Loading profile...</h2>
      </main>
    );
  }

  return (
    <main className="profile-page">
      <div className="profile-container">

        <div className="profile-header">
          <div className="profile-avatar">
            {profile.name
              ? profile.name.charAt(0).toUpperCase()
              : "U"}
          </div>

          <div>
            <h1>My Profile</h1>
            <p>
              Manage your personal information and professional
              details.
            </p>
          </div>
        </div>

        <form
          className="profile-form"
          onSubmit={handleSubmit}
        >

          <div className="form-section">
            <h2>Personal Information</h2>

            <div className="form-grid">

              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={profile.email}
                  disabled
                />
                <small>
                  Email cannot be changed.
                </small>
              </div>

              <div className="form-group">
                <label>Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={profile.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                />
              </div>

              <div className="form-group">
                <label>Experience</label>
                <input
                  type="text"
                  name="experience"
                  value={profile.experience}
                  onChange={handleChange}
                  placeholder="e.g. Fresher / 1 Year"
                />
              </div>

            </div>
          </div>

          <div className="form-section">
            <h2>Professional Information</h2>

            <div className="form-group">
              <label>Skills</label>

              <input
                type="text"
                value={skillsInput}
                onChange={(e) =>
                  setSkillsInput(e.target.value)
                }
                placeholder="React, JavaScript, HTML, CSS"
              />

              <small>
                Separate multiple skills using commas.
              </small>
            </div>

            <div className="form-group">
              <label>Education</label>

              <input
                type="text"
                name="education"
                value={profile.education}
                onChange={handleChange}
                placeholder="e.g. B.Tech Computer Science"
              />
            </div>

            <div className="form-group">
              <label>Bio</label>

              <textarea
                name="bio"
                value={profile.bio}
                onChange={handleChange}
                placeholder="Write a short professional introduction..."
                rows="5"
              />
            </div>

            <div className="form-group">
              <label>Resume URL</label>

              <input
                type="url"
                name="resume"
                value={profile.resume}
                onChange={handleChange}
                placeholder="https://drive.google.com/..."
              />

              <small>
                Add your Google Drive or other resume link.
              </small>
            </div>
          </div>

          <div className="profile-actions">
            <button
              type="submit"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : "Save Profile"}
            </button>
          </div>

        </form>
      </div>
    </main>
  );
}

export default Profile;