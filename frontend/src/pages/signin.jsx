import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../lib/api";
import { useAuth } from "../context/AuthContext.jsx";
import "./signin.css";

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" fill="none">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

const AppleIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.7 9.05 7.4c1.28.07 2.18.74 2.94.77 1.12-.23 2.19-.93 3.38-.84 1.43.12 2.51.69 3.22 1.79-2.95 1.73-2.25 5.53.39 6.63-.57 1.48-1.32 2.94-1.93 4.53zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
  </svg>
);

const EyeIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

export default function SignIn() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      setError("All fields are required.");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/auth/sign-in", formData);
      const { token, user } = res.data.data;
      signIn(token, user);
      // Redirect based on role — admins go straight to /admin
      navigate(user.role === "admin" ? "/admin" : "/", { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = (provider) => {
    const baseUrl = import.meta.env.VITE_API_URL || "/api/v1";
    window.location.href = `${baseUrl}/auth/${provider}`;
  };

  return (
    <div className="signin-page">
      <div className="signin-card">
        <div className="signin-header">
          <h1>Sign in</h1>
          <p>Welcome back to your account</p>
        </div>

        <div className="oauth-section">
          <button
            type="button"
            className="oauth-btn"
            id="google-oauth-btn"
            onClick={() => handleOAuth("google")}
          >
            <GoogleIcon /> Continue with Google
          </button>
          <button
            type="button"
            className="oauth-btn"
            id="apple-oauth-btn"
            onClick={() => handleOAuth("apple")}
          >
            <AppleIcon /> Continue with Apple
          </button>
        </div>

        <div className="divider">
          <span>or</span>
        </div>

        <form className="signin-form" onSubmit={handleSubmit} noValidate>
          {error && (
            <div className="error-message" role="alert">
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="signin-email">Email</label>
            <input
              id="signin-email"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <div className="form-label-row">
              <label htmlFor="signin-password">Password</label>
              <Link to="/forgot-password" className="forgot-link">
                Forgot password?
              </Link>
            </div>
            <div className="password-wrapper">
              <input
                id="signin-password"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Your password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="submit-btn"
            id="signin-submit-btn"
            disabled={loading}
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="signin-footer">
          Don&#39;t have an account? <Link to="/sign-up">Sign up</Link>
        </p>
      </div>

      <div className="signin-branding">
        <div className="branding-content">
          <div className="branding-logo-row">
            <img
              src="/logo.png"
              alt="SubTracker logo"
              className="branding-logo"
            />
            <span className="branding-label">Subscription Tracker</span>
          </div>
          <p className="branding-tagline">Your subscriptions, under control.</p>

          <div className="mock-dashboard">
            <div className="mock-summary">
              <div className="mock-summary-left">
                <span className="mock-summary-label">Monthly spend</span>
                <span className="mock-summary-amount">$47.97</span>
              </div>
              <div className="mock-summary-right">
                <span className="mock-badge">3 renewing soon</span>
              </div>
            </div>
            <div className="mock-spend-bar">
              <div className="mock-spend-bar-fill" style={{ width: "62%" }} />
            </div>
            <div className="mock-spend-bar-meta">
              <span>$47.97 of $80 budget</span>
              <span>62%</span>
            </div>
            <div className="mock-sub-list">
              {[
                {
                  name: "Netflix",
                  category: "Streaming",
                  amount: "$15.99",
                  due: "Apr 3",
                  color: "#e50914",
                  initial: "N",
                },
                {
                  name: "Spotify",
                  category: "Music",
                  amount: "$9.99",
                  due: "Apr 7",
                  color: "#1db954",
                  initial: "S",
                },
                {
                  name: "GitHub",
                  category: "Dev Tools",
                  amount: "$4.00",
                  due: "Apr 12",
                  color: "#6e40c9",
                  initial: "G",
                },
                {
                  name: "Figma",
                  category: "Design",
                  amount: "$12.00",
                  due: "Apr 18",
                  color: "#f24e1e",
                  initial: "F",
                },
                {
                  name: "Notion",
                  category: "Productivity",
                  amount: "$8.00",
                  due: "Apr 22",
                  color: "#a8a8a8",
                  initial: "N",
                },
              ].map((sub) => (
                <div className="mock-sub-card" key={sub.name}>
                  <div
                    className="mock-sub-icon"
                    style={{
                      background: `${sub.color}18`,
                      border: `1px solid ${sub.color}30`,
                    }}
                  >
                    <span style={{ color: sub.color }}>{sub.initial}</span>
                  </div>
                  <div className="mock-sub-info">
                    <span className="mock-sub-name">{sub.name}</span>
                    <span className="mock-sub-category">{sub.category}</span>
                  </div>
                  <div className="mock-sub-right">
                    <span className="mock-sub-amount">{sub.amount}</span>
                    <span className="mock-sub-due">Renews {sub.due}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
