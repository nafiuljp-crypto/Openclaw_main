import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <button 
        className="dark-toggle" 
        id="theme-toggle"
        onClick={() => {
          const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
          document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
          localStorage.setItem('theme', isDark ? 'light' : 'dark');
          document.getElementById('theme-toggle').textContent = isDark ? '🌙' : '☀️';
        }}
        style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}
        title="Toggle dark mode"
      >
        🌙
      </button>
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo">
          <span>🇯🇵</span> Nihongo<span>BTCH</span>
        </Link>
        <div className="navbar-links">
          <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>Home</Link>
          <Link to="/flashcards" className={`nav-link ${isActive('/flashcards') ? 'active' : ''}`}>Flashcards</Link>
          <Link to="/quiz" className={`nav-link ${isActive('/quiz') ? 'active' : ''}`}>Quiz</Link>
          <Link to="/kanji" className={`nav-link ${isActive('/kanji') ? 'active' : ''}`}>Kanji</Link>
          <Link to="/progress" className={`nav-link ${isActive('/progress') ? 'active' : ''}`}>Progress</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;