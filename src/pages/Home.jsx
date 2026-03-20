import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="home">
      <header className="nav">
        <div className="nav-left">
          <span className="logo-mark">EL</span>
          <span className="logo-text">EduLink</span>
        </div>
        <nav className="nav-links">
          <Link to="/" className="nav-link active">
            Home
          </Link>
          <Link to="/login" className="nav-link">
            Login
          </Link>
          <Link to="/register" className="nav-link primary-link">
            Register
          </Link>
          <Link to="/profile" className="nav-link">
            Profile
          </Link>
        </nav>
      </header>

      <main className="hero">
        <section className="hero-text">
          <p className="badge">University Student Platform</p>
          <h1>
            Smart Learning &amp; Group Formation
            <span className="highlight"> for Every Student</span>
          </h1>
          <p className="hero-subtitle">
            EduLink helps university students securely sign in, manage skills,
            and form the right project groups so that no student is left
            without a team.
          </p>

          <div className="hero-actions">
            <Link to="/register" className="btn-primary">
              Get Started – Register
            </Link>
            <Link to="/login" className="btn-secondary">
              Already have an account?
            </Link>
            <Link to="/profile" className="btn-secondary">
              View Profile
            </Link>
          </div>

          <div className="hero-meta">
            <div>
              <strong>Secure Authentication</strong>
              <p>Role-based access (student, admin) with protected data.</p>
            </div>
            <div>
              <strong>Smart Grouping</strong>
              <p>
                Group creation, join requests, skill tags and capacity control.
              </p>
            </div>
          </div>
        </section>

        <section className="hero-panel">
          <h2>Why EduLink?</h2>
          <ul className="feature-list">
            <li>
              <span className="feature-dot" /> Skill-based group formation so
              teams are balanced and productive.
            </li>
            <li>
              <span className="feature-dot" /> Simple approval workflow for
              join requests.
            </li>
            <li>
              <span className="feature-dot" /> Dashboard to see your groups and
              skills at a glance.
            </li>
            <li>
              <span className="feature-dot" /> Avoids overcrowded groups and
              ensures no student is left behind.
            </li>
          </ul>
        </section>
      </main>

      <footer className="footer">
        <span>© {new Date().getFullYear()} EduLink. Designed for university projects.</span>
      </footer>
    </div>
  );
}

