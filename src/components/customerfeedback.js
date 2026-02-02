import React, { useState } from "react";
import "../css/customerfeedback.css";
import api from "../api";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

export default function CustomerFeedbackForm({ revieweeId, onSubmit }) {
  const [formData, setFormData] = useState({
    satisfaction: "",
    fee_fairness: "",
    payment_issue: "",
    prefer_counvo: "",
    fee_type: "",
    suggestions: "",
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
      await api.post("api/review/addfeedback", payload);
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
      console.error("Error saving feedback:", error);
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
        {/* 1. Satisfaction */}
        <label className="c-feedback-label" htmlFor="satisfaction">
          1. How satisfied were you with your consultation?
          <div className="c-feedback-stars">
            {[1, 2, 3, 4, 5].map((n) => (
              <label key={n} className="c-star">
                <input
                  type="radio"
                  name="satisfaction"
                  value={n}
                  checked={formData.satisfaction === String(n)}
                  onChange={handleChange}
                  required
                />
                <span>{n}</span>
              </label>
            ))}
          </div>
        </label>

        {/* 2. Fee fairness */}
        <label className="c-feedback-label">
          2. Was the consultation fee fair?
          <select
            name="fee_fairness"
            value={formData.fee_fairness}
            onChange={handleChange}
            required
          >
            <option value="">Select...</option>
            <option>Too High</option>
            <option>Reasonable</option>
            <option>Too Low</option>
            <option>Not Sure</option>
          </select>
        </label>

        {/* 3. Payment issue */}
        <label className="c-feedback-label">
          3. Did you face any issue in paying the lawyer?
          <select
            name="payment_issue"
            value={formData.payment_issue}
            onChange={handleChange}
            required
          >
            <option value="">Select...</option>
            <option>Yes</option>
            <option>No</option>
            <option>Didn’t pay yet</option>
          </select>
        </label>

        {/* 4. Prefer Counvo payment */}
        <label className="c-feedback-label">
          4. Would you prefer to pay everything on Counvo next time?
          <select
            name="prefer_counvo"
            value={formData.prefer_counvo}
            onChange={handleChange}
            required
          >
            <option value="">Select...</option>
            <option>Yes, it’s easier that way</option>
            <option>No, I prefer paying lawyer directly</option>
            <option>Doesn’t matter</option>
          </select>
        </label>

        {/* 5. Fixed or Flexible fee */}
        <label className="c-feedback-label">
          5. Do you like fixed or flexible consultation fee?
          <select
            name="fee_type"
            value={formData.fee_type}
            onChange={handleChange}
            required
          >
            <option value="">Select...</option>
            <option>Fixed</option>
            <option>Flexible</option>
          </select>
        </label>

        {/* 6. Suggestions */}
        <label className="c-feedback-label">
          6. Any feedback or suggestions for us?{" "}
          <span className="c-feedback-optional">(optional)</span>
          <textarea
            name="suggestions"
            value={formData.suggestions}
            onChange={handleChange}
            rows={2}
            maxLength={300}
            placeholder="Your thoughts..."
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
