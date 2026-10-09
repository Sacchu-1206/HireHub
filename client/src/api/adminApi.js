import axios from "axios";

const API_URL = "http://localhost:5000/api/admin";

export const getAdminDashboard = async (token) => {
  const response = await axios.get(
    `${API_URL}/dashboard`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const getAdminUsers = async (token) => {
  const response = await axios.get(
    `${API_URL}/users`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const deleteAdminUser = async (
  userId,
  token
) => {
  const response = await axios.delete(
    `${API_URL}/users/${userId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const getAdminJobs = async (token) => {
  const response = await axios.get(
    `${API_URL}/jobs`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const deleteAdminJob = async (
  jobId,
  token
) => {
  const response = await axios.delete(
    `${API_URL}/jobs/${jobId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const getAdminApplications = async (token) => {
  const response = await axios.get(
    `${API_URL}/applications`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};;