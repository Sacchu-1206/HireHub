import axios from "axios";

const API_URL = "http://localhost:5000/api/applications";

export const applyForJob = async (jobId, token) => {
  const response = await axios.post(
    API_URL,
    {
      jobId,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const getMyApplications = async (token) => {
  const response = await axios.get(
    `${API_URL}/my-applications`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const getRecruiterApplications = async (token) => {
  const response = await axios.get(
    `${API_URL}/recruiter-applications`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const updateApplicationStatus = async (
  applicationId,
  status,
  token
) => {
  const response = await axios.patch(
    `${API_URL}/${applicationId}/status`,
    {
      status,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};