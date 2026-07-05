import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="header">
      <Link to="/" className="logo-link">
        <h1 className="logo">RUNDEFULL</h1>
      </Link>
      <nav className="main-nav">
        <Link to="/">Главная</Link>
        <Link to="/statistics">Статистика</Link>
        <Link to="/profile">Профиль</Link>
      </nav>
    </header>
  );
}

export default Header;