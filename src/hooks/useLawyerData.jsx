import React, { useEffect, useState } from "react";
import api from "../api";

const useLawyerData = () => {
  const [lawyerList, setLawyerList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchLawyerList = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/api/v2/lawyer/allprofiles");
      setLawyerList(response.data);
    } catch (error) {
      console.error("Error fetching lawyer list:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLawyerList();
  }, []);

  return { lawyerList, isLoading, error };
};

export default useLawyerData;
