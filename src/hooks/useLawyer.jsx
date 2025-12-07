import api from "../api";
import { useState, useEffect } from "react";

const fetchLawyerById = async (lawyerId) => {
  const response = await api.get(`/api/v2/lawyer/getlawyer/${lawyerId}`);
  return response.data;
};

const useLawyer = (lawyerId) => {
  const [lawyer, setLawyer] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => {
    setIsLoading(true);
    fetchLawyerById(lawyerId).then((data) => {
      setLawyer(data.data);
      setIsLoading(false);
    }).catch((error) => {
      setError(error);
      setIsLoading(false);
    });
  }, [lawyerId]);
  return { lawyer, isLoading, error };
};

export default useLawyer;

