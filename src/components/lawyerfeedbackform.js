import React, { useState } from "react";
import "../css/customerfeedback.css";
import api from '../api';
import Swal from 'sweetalert2';
import { toast } from "react-toastify";

export default function LawyerFeedbackForm({ revieweeId, onSubmit }) {
  const [formData, setFormData] = useState({
    fee_fairness: "",
    payment_issue: "",
    prefer_counvo: "",
    fee_type: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setSubmitError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    if (!revieweeId) {
      Swal.fire({
        icon: "warning",
        title: "Select a conversation",
        text: "Please select a conversation to review.",
      });
      return;
    }
    setIsSubmitting(true);
    try {
      const payload = { ...formData, revieweeId };
      await api.post("api/review/addlawyerfeedback", payload);
      toast.success("Feedback Submitted!", {
        text: "Thank you for your feedback.",
      });
      await onSubmit?.();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to submit feedback."
      );
      setSubmitError(
        error.response?.data?.message ||
          error.message ||
          "Failed to submit feedback."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      className="c-feedback-form c-feedback-form-dialog"
      onSubmit={handleSubmit}
    >
      <div className="c-feedback-form-body">
        {/* 2. Fee fairness */}
        <label className="c-feedback-label">
          1. Did the client pay you successfully??
          <select
            name="fee_fairness"
            value={formData.fee_fairness}
            onChange={handleChange}
            required
          >
            <option value="">Select...</option>
            <option>Yes</option>
            <option>No</option>
            <option>Partial Payment</option>
            <option>Still Waiting</option>
          </select>
        </label>

        {/* 3. Payment issue */}
        <label className="c-feedback-label">
          2. Was the fee accepted as-is or negotiated?
          <select
            name="payment_issue"
            value={formData.payment_issue}
            onChange={handleChange}
            required
          >
            <option value="">Select...</option>
            <option>Accepted</option>
            <option>Negotiated lower</option>
            <option>Negotiated higher</option>
          </select>
        </label>

        {/* 4. Prefer Counvo payment */}
        <label className="c-feedback-label">
          3. Do you face any delays or issues while collecting payment?
          <select
            name="prefer_counvo"
            value={formData.prefer_counvo}
            onChange={handleChange}
            required
          >
            <option value="">Select...</option>
            <option>Yes</option>
            <option>No</option>
          </select>
        </label>

        <label className="c-feedback-label">
          4. What platform fee would you find reasonable if Counvo collected
          full payment?
          <input
            type="text"
            name="fee_type"
            value={formData.fee_type}
            onChange={handleChange}
            required
          />
        </label>
      </div>
      <div className="c-feedback-form-footer">
        {submitError && (
          <p className="c-feedback-form-error" role="alert">
            {submitError}
          </p>
        )}
        <button
          type="submit"
          className="c-feedback-btn"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </div>
    </form>
  );
}
