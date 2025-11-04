import React from "react";
import '../css/lawyerfeedback.css'


export function LawyerFeedbackForm({ onSubmit }) {
  return (
    <form className="feedback-form" onSubmit={e => {e.preventDefault(); onSubmit && onSubmit();}}>
      <h2>Lawyer Feedback</h2>

      <label>
        1. Did the client pay you successfully?
        <select name="payment_status" required>
          <option value="">Select...</option>
          <option>Yes</option>
          <option>No</option>
          <option>Partial Payment</option>
          <option>Still Waiting</option>
        </select>
      </label>

      <label>
        2. Was the fee accepted as-is or negotiated?
        <select name="fee_negotiation" required>
          <option value="">Select...</option>
          <option>Accepted</option>
          <option>Negotiated lower</option>
          <option>Negotiated higher</option>
        </select>
      </label>

      <label>
        3. Do you face any delays or issues while collecting payment?
        <select name="delays_issues" required>
          <option value="">Select...</option>
          <option>Yes</option>
          <option>No</option>
        </select>
      </label>

      <label>
        4. What platform fee would you find reasonable if Counvo collected full payment?
        <input
          type="number"
          name="platform_fee"
          min="0"
          max="100"
          placeholder="e.g. 10 (for 10%)"
          className="input-field"
          required
        /> %
      </label>

      <button type="submit" className="form-submit-btn">Submit</button>
    </form>
  );
}
