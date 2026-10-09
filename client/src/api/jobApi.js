import axios from "axios";

const API_URL = "http://localhost:5000/api/jobs";

// Get jobs with optional filters
export const getJobs = async (filters = {}) => {
  const response = await axios.get(API_URL, {
    params: {
      search: filters.search || "",
      location: filters.location || "",
      jobType: filters.jobType || "",
      sort: filters.sort || "latest",
      page: filters.page || 1,
      limit: filters.limit || 6,
    },
  });

  return response.data;
};

export const getRecruiterJobs = async (token) => {
  const response = await axios.get(
    `${API_URL}/recruiter/my-jobs`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const updateJob = async (
  jobId,
  jobData,
  token
) => {
  const response = await axios.put(
    `${API_URL}/${jobId}`,
    jobData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const deleteJob = async (
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