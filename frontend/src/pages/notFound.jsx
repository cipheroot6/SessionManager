import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './notFound.css';

export default function NotFound() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="nf-page">
      {/* Ambient grid background */}
      <div className="nf-grid" aria-hidden="true" />

      <div className="nf-content">
        {/* Glitchy 404 number */}
        <div className="nf-code-wrap">
          <span className="nf-code" data-text="404">404</span>
        </div>

        <div className="nf-divider" />

        <h1 className="nf-title">Page not found</h1>
        <p className="nf-body">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="nf-actions">
          <button className="nf-btn-primary" onClick={() => navigate(-1)}>
            ← Go back
          </button>
          <Link
            to={isAuthenticated ? '/' : '/sign-in'}
            className="nf-btn-secondary"
          >
            {isAuthenticated ? 'Dashboard' : 'Sign in'}
          </Link>
        </div>
      </div>
    </div>
  );
}
