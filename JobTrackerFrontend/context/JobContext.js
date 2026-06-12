import React, { createContext, useContext, useState } from 'react';
import api from '../api';

const JobContext = createContext();

export const useJobs = () => useContext(JobContext);

export const JobProvider = ({ children }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await api.get('/jobs');
      setJobs(response.data);
    } catch (e) {
      console.error('Fetch jobs error:', e);
    } finally {
      setLoading(false);
    }
  };

  const addJob = async (jobData) => {
    try {
      const response = await api.post('/jobs', jobData);
      setJobs((prev) => [response.data, ...prev]);
      return response.data;
    } catch (e) {
      console.error('Add job error:', e);
      throw e;
    }
  };

  const updateJob = async (id, updates) => {
    try {
      const response = await api.put(`/jobs/${id}`, updates);
      setJobs((prev) => prev.map((j) => (j.id === id ? response.data : j)));
      return response.data;
    } catch (e) {
      console.error('Update job error:', e);
      throw e;
    }
  };

  const deleteJob = async (id) => {
    try {
      await api.delete(`/jobs/${id}`);
      setJobs((prev) => prev.filter((j) => j.id !== id));
    } catch (e) {
      console.error('Delete job error:', e);
      throw e;
    }
  };

  return (
    <JobContext.Provider value={{ jobs, loading, fetchJobs, addJob, updateJob, deleteJob }}>
      {children}
    </JobContext.Provider>
  );
};