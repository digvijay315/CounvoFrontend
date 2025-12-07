import { useState } from "react";
import api from "../api";
import { toast } from "react-toastify";
import { APP_CONFIG } from "../_constants/config";

const usePayment = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const initializePayment = async (lawyerId, amount, notes = {}) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await api.post("/api/v2/payment/create", {
        lawyerId: lawyerId,
        amount: amount,
        transferAmount: amount,
        notes: {
          consultation: notes.consultation || "online",
          consultationType: notes.consultationType || "online",
          additionalNotes: notes.additionalNotes || "",
        },
      });

      // Razorpay payment options
      const options = {
        key: APP_CONFIG.RAZORPAY_KEY_ID,
        amount: response.data.amount,
        currency: response.data.currency,
        name: "Counvo",
        description: "Lawyer Consultation Payment",
        order_id: response.data.id,
        handler: function (paymentResponse) {
          toast.success("Payment successful!");
          // You can add callback here to verify payment on backend
          console.log("Payment Response:", paymentResponse);
        },
        prefill: {
          name: response.data.notes?.userName || "",
          email: response.data.notes?.userEmail || "",
          contact: response.data.notes?.userPhone || "",
        },
        theme: {
          color: "#F59E0B",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on("payment.failed", function (response) {
        toast.error("Payment failed! Please try again.");
        setError(response.error.description);
      });
      razorpay.on("payment.success", function (response) {
        toast.success("Payment successful!");
        console.log("Payment Response:", response);
      });
      razorpay.open();

      setIsLoading(false);
      return response.data;
    } catch (err) {
      setIsLoading(false);
      setError(err.response?.data?.message || err.message);
      toast.error(err.response?.data?.message || "Payment initialization failed");
      throw err;
    }
  };

  return { initializePayment, isLoading, error };
};

export default usePayment;
