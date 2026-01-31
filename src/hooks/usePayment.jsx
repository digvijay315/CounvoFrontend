import { useState } from "react";
import api from "../api";
import { toast } from "react-toastify";
import { APP_CONFIG } from "../_constants/config";

const usePayment = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Confirms payment with backend after successful Razorpay payment
   * This verifies the payment signature and updates the payment status
   */
  const confirmPayment = async (
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
  ) => {
    try {
      const response = await api.post("/api/v2/payment/confirm", {
        razorpay_order_id: razorpayOrderId,
        razorpay_payment_id: razorpayPaymentId,
        razorpay_signature: razorpaySignature,
      });
      return response.data;
    } catch (err) {
      console.error("Error confirming payment:", err);
      throw err;
    }
  };

  // Cancel Payment
  const cancelPayment = async (paymentId, status = "cancelled") => {
    try {
      if(!paymentId) return;
      const response = await api.post("/api/v2/payment/cancel", {
        paymentId,
        status,
      });
      return response.data;
    } catch (err) {
      console.error("Error confirming payment:", err);
      throw err;
    }
  };

  /**
   * Initializes payment process
   * Creates order and opens Razorpay payment modal
   */
  const initializePayment = async (
    lawyerId,
    amount,
    notes = {},
    onSuccess = null,
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      // Step 1: Create payment order
      const response = await api.post("/api/v2/payment/create", {
        lawyerId: lawyerId,
        amount: amount,
        notes: {
          consultation: notes.consultation || "online",
          consultationType: notes.consultationType || "online",
          additionalNotes: notes.additionalNotes || "",
        },
      });
      if (response.data.error) {
        toast.error(response?.data?.error);
        setIsLoading(false);
        return;
      }
      const orderPaymentId = response?.data?.paymentId;
      const orderData = response.data.order || response.data;

      // Step 2: Configure Razorpay payment options
      const options = {
        key: APP_CONFIG.RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency || "INR",
        name: "Counvo",
        description: "Lawyer Consultation Payment",
        order_id: orderData.id,

        // Handler called when payment is successful
        handler: async function (paymentResponse) {
          try {
            // Step 3: Verify payment on backend
            const confirmResult = await confirmPayment(
              paymentResponse.razorpay_order_id,
              paymentResponse.razorpay_payment_id,
              paymentResponse.razorpay_signature,
            );

            toast.success("Payment successful and verified!");
            console.log("Payment confirmed:", confirmResult);

            // Call custom success callback if provided
            if (onSuccess && typeof onSuccess === "function") {
              onSuccess(confirmResult);
            }
          } catch (err) {
            console.error("Payment verification error:", err);
            toast.error(
              "Payment completed but verification failed. Please contact support.",
            );
          }
        },

        prefill: {
          name: response.data.notes?.userName || "",
          email: response.data.notes?.userEmail || "",
          contact: response.data.notes?.userPhone || "",
        },

        theme: {
          color: "#F59E0B", // Counvo primary color
        },

        modal: {
          ondismiss: function () {
            setIsLoading(false);
            toast.info("Payment cancelled");
            cancelPayment(orderPaymentId, "cancelled");
          },
        },
      };

      // Step 4: Open Razorpay payment modal
      const razorpay = new window.Razorpay(options);

      razorpay.on("payment.failed", function (response) {
        console.error("Payment failed:", response.error);
        toast.error(`Payment failed: ${response.error.description}`);
        setError(response.error.description);
        setIsLoading(false);
        cancelPayment(orderPaymentId, "failed");
      });

      razorpay.open();
      setIsLoading(false);

      return response.data;
    } catch (err) {
      setIsLoading(false);
      let responseError =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.message;
      setError(responseError);
      toast.error(responseError || "Payment initialization failed");
      throw err;
    }
  };

  return {
    initializePayment,
    confirmPayment,
    isLoading,
    error,
  };
};

export default usePayment;
