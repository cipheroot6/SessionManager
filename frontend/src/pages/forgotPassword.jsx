import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../lib/api";
import "./forgotPassword.css";

const LockIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const CheckIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const ArrowLeftIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Email is required.");
      return;
    }

    setLoading(true);
    try {
      await api.post("/auth/forgot-password", { email });
      setSubmitted(true);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-page">
      <div className="forgot-card">
        {submitted ? (
          <div className="success-state">
            <div className="success-icon">
              <CheckIcon />
            </div>
            <h2>Check your inbox</h2>
            <p>
              We sent a password reset link to <span>{email}</span>. It may take
              a minute to arrive.
            </p>
            <p>Didn&#39;t receive it? Check your spam folder or try again.</p>
          </div>
        ) : (
          <>
            <div className="forgot-header">
              <div className="forgot-icon">
                <LockIcon />
              </div>
              <h1>Forgot password?</h1>
              <p>
                Enter your email and we&#39;ll send you a link to reset your
                password.
              </p>
            </div>

            <form className="forgot-form" onSubmit={handleSubmit} noValidate>
              {error && (
                <div className="error-message" role="alert">
                  {error}
                </div>
              )}

              <div className="form-group">
                <label htmlFor="forgot-email">Email</label>
                <input
                  id="forgot-email"
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError("");
                  }}
                  autoComplete="email"
                  autoFocus
                />
              </div>

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? "Sending\u2026" : "Send reset link"}
              </button>
            </form>
          </>
        )}

        <p className="forgot-footer">
          <ArrowLeftIcon />
          <Link to="/sign-in">Back to sign in</Link>
        </p>
      </div>
    </div>
  );
}
