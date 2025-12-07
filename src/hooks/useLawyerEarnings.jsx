import { useState, useEffect } from "react";
import api from "../api";

const useLawyerEarnings = (
  page = 1,
  limit = 10,
  filters = {}
) => {
  const [payments, setPayments] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [statistics, setStatistics] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchEarnings = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = { page, limit, ...filters };

      const response = await api.get("/api/v2/payment/lawyer/earnings", {
        params,
      });

      if (response.data.success) {
        setPayments(response.data.data.payments);
        setPagination(response.data.data.pagination);
        setStatistics(response.data.data.statistics);
      }
    } catch (err) {
      console.error("Error fetching lawyer earnings:", err);
      setError(err.response?.data?.message || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEarnings();
  }, [page, limit, JSON.stringify(filters)]);

  return {
    payments,
    pagination,
    statistics,
    isLoading,
    error,
    refetch: fetchEarnings,
  };
};

export default useLawyerEarnings;

