import React, { useState } from "react";
import "../css/customerfeedback.css";
import api from '../api';
import Swal from 'sweetalert2';

export default function LawyerFeedbackForm({ onSubmit }) {
  // ✅ State for all fields
  const [formData, setFormData] = useState({
    client_pay: "",
    fee_negoatiated: "",
    delays_issue: "",
    other_plateform: "",
  });

  // ✅ Update state on change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

   const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("api/admin/addlawyerfeedback", formData);
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
        4. What platform fee would you find reasonable if Counvo collected full payment?
        <input
        type="text"
          name="fee_type"
          value={formData.fee_type}
          onChange={handleChange}
          required
        />
         
      </label>
     

     

      <button type="submit" className="c-feedback-btn">
        Submit
      </button>
    </form>
  );
}
