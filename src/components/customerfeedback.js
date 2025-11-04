import React, { useState } from "react";
import "../css/customerfeedback.css";
import api from '../api';
import Swal from 'sweetalert2';

export default function CustomerFeedbackForm({ onSubmit }) {
  // ✅ State for all fields
  const [formData, setFormData] = useState({
    satisfaction: "",
    fee_fairness: "",
    payment_issue: "",
    prefer_counvo: "",
    fee_type: "",
    suggestions: "",
  });

  // ✅ Update state on change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

   const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("api/admin/addfeedback", formData);
       Swal.fire({
        icon: 'success',
        title: 'Feedback Submitted!',
        text: "Feedback Submitted Successful!",
        showConfirmButton: true,
      }).then(()=>
      {
        window.location.reload()
      });

    } catch (error) {
      console.error("Error saving feedback:", error);
    }
  };

  return (
    <form className="c-feedback-form" onSubmit={handleSubmit}>
      <h2 className="c-feedback-title">We Value Your Feedback</h2>

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

      <button type="submit" className="c-feedback-btn">
        Submit
      </button>
    </form>
  );
}
