import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import Swal from "sweetalert2";
import Header from "../Layout/header";
import "../Client/css/payment.css";

function Payment() {
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem("userDetails"));

  const [lawyerId, setLawyerId] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [lawyerInfo, setLawyerInfo] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  // Fetch transaction history
  useEffect(() => {
    fetchTransactionHistory();
  }, []);

  const fetchTransactionHistory = async () => {
    try {
      const res = await api.get(`/api/payment/transactions/${userData.user._id}`);
      setTransactions(res.data || []);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  // Verify lawyer exists
  const verifyLawyer = async () => {
    if (!lawyerId.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Lawyer ID Required",
        text: "Please enter a lawyer ID",
      });
      return;
    }

    setIsVerifying(true);
    try {
      const res = await api.get(`/api/lawyer/getlawyer/${lawyerId}`);
      if (res.data) {
        setLawyerInfo(res.data);
        Swal.fire({
          icon: "success",
          title: "Lawyer Found!",
          text: `${res.data.firstName} ${res.data.lastName}`,
          timer: 2000,
        });
      }
    } catch (error) {
      setLawyerInfo(null);
      Swal.fire({
        icon: "error",
        title: "Lawyer Not Found",
        text: "Please check the lawyer ID and try again",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  // Handle payment
  const handlePayment = async (e) => {
    e.preventDefault();

    if (!lawyerInfo) {
      Swal.fire({
        icon: "warning",
        title: "Verify Lawyer First",
        text: "Please verify the lawyer ID before proceeding",
      });
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      Swal.fire({
        icon: "warning",
        title: "Invalid Amount",
        text: "Please enter a valid amount",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Create order on backend using the correct route
      const orderRes = await api.post("/api/user/payment/create", {
        lawyerId: lawyerId,
        amount: parseFloat(amount),
      });

      console.log("Order Response:", orderRes.data);

      const { order } = orderRes.data;

      if (!order || !order.id) {
        throw new Error("Invalid order response from server");
      }

      // Check if Razorpay is loaded
      if (!window.Razorpay) {
        Swal.fire({
          icon: "error",
          title: "Payment Gateway Error",
          text: "Razorpay is not loaded. Please refresh the page and try again.",
        });
        setIsProcessing(false);
        return;
      }

      // Initialize Razorpay Checkout
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID || orderRes.data.key_id,
        amount: order.amount,
        currency: order.currency,
        name: "Counvo Legal Services",
        description: description || `Payment to ${lawyerInfo.firstName} ${lawyerInfo.lastName}`,
        order_id: order.id,
        handler: async function (response) {
          // Payment successful - verify on backend
          try {
            setIsProcessing(true);

            const verifyRes = await api.post("/user/payment/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              lawyerId: lawyerId,
              amount: parseFloat(amount),
              description: description,
            });

            if (verifyRes.data.success) {
              Swal.fire({
                icon: "success",
                title: "Payment Successful!",
                html: `
                  <p><strong>₹${amount}</strong> paid to</p>
                  <p><strong>${lawyerInfo.firstName} ${lawyerInfo.lastName}</strong></p>
                  <p style="font-size: 0.9em; color: #6b7280;">Payment ID: ${response.razorpay_payment_id}</p>
                `,
                confirmButtonColor: "#10b981",
              });

              // Reset form
              setLawyerId("");
              setAmount("");
              setDescription("");
              setLawyerInfo(null);

              // Refresh transaction history
              fetchTransactionHistory();
            } else {
              throw new Error(verifyRes.data.message || "Payment verification failed");
            }
          } catch (error) {
            console.error("Payment verification error:", error);
            Swal.fire({
              icon: "error",
              title: "Payment Verification Failed",
              text: error.response?.data?.message || error.message || "Please contact support",
            });
          } finally {
            setIsProcessing(false);
          }
        },
        prefill: {
          name: userData.user.fullName || "",
          email: userData.user.email || "",
          contact: userData.user.mobile || "",
        },
        notes: {
          lawyerId: lawyerId,
          clientId: userData.user._id,
          description: description || "Payment to lawyer",
        },
        theme: {
          color: "#3b82f6",
        },
        modal: {
          ondismiss: function () {
            console.log("Payment cancelled by user");
            setIsProcessing(false);
            Swal.fire({
              icon: "info",
              title: "Payment Cancelled",
              text: "You cancelled the payment",
              timer: 2000,
              showConfirmButton: false,
            });
          },
          escape: true,
          backdropclose: false,
        },
      };

      // Open Razorpay Checkout
      const rzp = new window.Razorpay(options);
      
      rzp.on('payment.failed', function (response) {
        console.error("Payment failed:", response.error);
        setIsProcessing(false);
        Swal.fire({
          icon: "error",
          title: "Payment Failed",
          html: `
            <p><strong>Code:</strong> ${response.error.code}</p>
            <p><strong>Description:</strong> ${response.error.description}</p>
            <p style="font-size: 0.9em; color: #6b7280;">${response.error.reason}</p>
          `,
        });
      });

      rzp.open();

    } catch (error) {
      console.error("Payment error:", error);
      setIsProcessing(false);
      Swal.fire({
        icon: "error",
        title: "Payment Failed",
        text: error.response?.data?.message || error.message || "Something went wrong. Please try again.",
      });
    }
  };


  return (
    <div className="payment-page">
      <Header />
      <div className="payment-container">
        <div className="payment-header">
          <h1>💳 Payment Gateway</h1>
          <p>Pay your lawyer securely and instantly</p>
        </div>

        <div className="payment-content">
          {/* Payment Form */}
          <div className="payment-form-card">
            <h2>Make a Payment</h2>

            <form onSubmit={handlePayment}>
              {/* Lawyer ID Input */}
              <div className="form-group">
                <label htmlFor="lawyerId">Lawyer ID</label>
                <div className="input-with-button">
                  <input
                    type="text"
                    id="lawyerId"
                    value={lawyerId}
                    onChange={(e) => setLawyerId(e.target.value)}
                    placeholder="Enter lawyer ID"
                    disabled={isVerifying || isProcessing}
                  />
                  <button
                    type="button"
                    onClick={verifyLawyer}
                    disabled={isVerifying || isProcessing}
                    className="verify-btn"
                  >
                    {isVerifying ? "Verifying..." : "Verify"}
                  </button>
                </div>
              </div>

              {/* Lawyer Info Display */}
              {lawyerInfo && (
                <div className="lawyer-info-card">
                  <div className="lawyer-info-header">
                    <img
                      src={lawyerInfo.profilepic || "/default-avatar.png"}
                      alt={lawyerInfo.firstName}
                      className="lawyer-avatar"
                    />
                    <div>
                      <h3>
                        {lawyerInfo.firstName} {lawyerInfo.lastName}
                      </h3>
                      <p className="lawyer-specialization">
                        {Array.isArray(lawyerInfo.specializations)
                          ? lawyerInfo.specializations
                              .map((s) => s.label)
                              .join(", ")
                          : lawyerInfo.specializations}
                      </p>
                      <p className="lawyer-experience">
                        {lawyerInfo.yearsOfExperience} years experience
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Amount Input */}
              <div className="form-group">
                <label htmlFor="amount">Amount (₹)</label>
                <input
                  type="number"
                  id="amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  min="1"
                  step="0.01"
                  disabled={!lawyerInfo || isProcessing}
                  required
                />
              </div>

              {/* Description Input */}
              <div className="form-group">
                <label htmlFor="description">
                  Description <span className="optional">(Optional)</span>
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter payment description"
                  rows="3"
                  disabled={!lawyerInfo || isProcessing}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="pay-btn"
                disabled={!lawyerInfo || isProcessing || !amount}
              >
                {isProcessing ? (
                  <>
                    <span className="spinner"></span>
                    Processing...
                  </>
                ) : (
                  `Pay ₹${amount || "0"}`
                )}
              </button>
            </form>
          </div>

          {/* Transaction History */}
          <div className="transaction-history-card">
            <div className="history-header">
              <h2>Transaction History</h2>
              <button
                className="toggle-history-btn"
                onClick={() => setShowHistory(!showHistory)}
              >
                {showHistory ? "Hide" : "Show"}
              </button>
            </div>

            {showHistory && (
              <div className="transactions-list">
                {transactions.length === 0 ? (
                  <div className="no-transactions">
                    <span className="icon">📋</span>
                    <p>No transactions yet</p>
                  </div>
                ) : (
                  transactions.map((transaction, index) => (
                    <div key={index} className="transaction-item">
                      <div className="transaction-info">
                        <div className="transaction-lawyer">
                          <strong>{transaction.lawyerName}</strong>
                        </div>
                        <div className="transaction-description">
                          {transaction.description || "Payment to lawyer"}
                        </div>
                        <div className="transaction-date">
                          {new Date(transaction.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="transaction-amount">
                        <span
                          className={`amount ${
                            transaction.status === "completed"
                              ? "completed"
                              : "pending"
                          }`}
                        >
                          ₹{transaction.amount}
                        </span>
                        <span
                          className={`status ${transaction.status}`}
                        >
                          {transaction.status}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Info Cards */}
        <div className="info-cards">
          <div className="info-card">
            <div className="info-icon">🔒</div>
            <h3>Secure Payments</h3>
            <p>All transactions are encrypted and secure</p>
          </div>
          <div className="info-card">
            <div className="info-icon">⚡</div>
            <h3>Instant Transfer</h3>
            <p>Payments are processed instantly</p>
          </div>
          <div className="info-card">
            <div className="info-icon">📱</div>
            <h3>24/7 Support</h3>
            <p>Get help anytime you need</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Payment;

