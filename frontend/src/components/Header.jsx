import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export default function Header({ onMenuToggle }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header-left">
        <button className="header-menu-btn" onClick={onMenuToggle}>
          ☰
        </button>
      </div>
      <div className="header-right">
        <span className="text-secondary" style={{ fontSize: 'var(--fs-sm)' }}>
          {user?.email}
        </span>
        <button className="header-logout" onClick={handleLogout} id="logout-btn">
          ↪ Logout
        </button>
      </div>
    </header>
  );
}
