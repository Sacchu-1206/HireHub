import axios from "axios";

const API_URL = "http://localhost:5000/api/saved-jobs";

// Save a job
export const saveJob = async (jobId, token) => {
  const response = await axios.post(
    API_URL,
    { jobId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

// Get all saved jobs
export const getSavedJobs = async (token) => {
  const response = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// Check whether a job is already saved
export const checkSavedJob = async (jobId, token) => {
  const response = await axios.get(
    `${API_URL}/check/${jobId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

// Remove a saved job
export const removeSavedJob = async (
  jobId,
  token
) => {
  const response = await axios.delete(
    `${API_URL}/${jobId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};