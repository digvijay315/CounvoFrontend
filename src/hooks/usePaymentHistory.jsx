import { useState, useEffect } from "react";
import api from "../api";
import { UserRoles } from "../_constants/dataConstants";
import useAuth from "./useAuth";

const usePaymentHistory = (page = 1, limit = 10, status = null) => {
  const [payments, setPayments] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [statistics, setStatistics] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { userRole } = useAuth();

  const fetchPaymentHistory = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = { page, limit };
      if (status) params.status = status;
      let url = userRole === UserRoles.CUSTOMER ? "/api/v2/payment/client/history" : "/api/v2/admin/payments";
      const response = await api.get(url, {
        params,
      });

      if (response.data.success) {
        setPayments(response.data.data.payments);
        setPagination(response.data.data.pagination);
        if (userRole === UserRoles.LAWYER) {
          setStatistics(response.data.data.statistics);
        }
      }
    } catch (err) {
      console.error("Error fetching payment history:", err);
      setError(err.response?.data?.message || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentHistory();
  }, [page, limit, status]);

  return {
    payments,
    pagination,
    statistics,
    isLoading,
    error,
    refetch: fetchPaymentHistory,
  };
};

export default usePaymentHistory;

