import { Link } from 'react-router-dom';

export default function WelcomePage() {
  return (
    <div className="welcome-hero">
      <h1 className="welcome-title">
        WELCOME TO MY RESTAURANT
      </h1>

      <p className="welcome-subtitle">
        What would you like to have?
      </p>

      <div className="welcome-credit">
        Built by Pavani Patel
      </div>

      <Link to="/menu" className="btn-pill-outline">
        VIEW MENU
      </Link>

      <div className="soft-gradient-wash"></div>
    </div>
  );
}
