import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Chat.css';

const Chat = ({ onLogout }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Токен отсутствует. Пожалуйста, войдите снова.');
        onLogout();
        navigate('/');
        return;
      }

      try {
        const response = await axios.get('http://localhost:8000/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data);
      } catch (err) {
        if (err.response?.status === 401) {
          setError('Сессия истекла. Пожалуйста, войдите снова.');
          localStorage.removeItem('token');
          onLogout();
          navigate('/');
        } else {
          setError('Ошибка загрузки данных пользователя.');
        }
      }
    };

    fetchUser();
  }, [onLogout, navigate]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="chat-container">
      {error && <p className="error-message">{error}</p>}
      {user ? (
        <>
          <div className="menu-trigger" onClick={toggleSidebar}>
            <button className="menu-btn">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill="none"
                stroke="#d4d4d4"
                strokeWidth="1.5"
              >
                <path d="M2 12C2 8.31087 2 6.4663 2.81382 5.15877C3.1149 4.67502 3.48891 4.25427 3.91891 3.91554C5.08116 3 6.72077 3 10 3H14C17.2792 3 18.9188 3 20.0811 3.91554C20.5111 4.25427 20.8851 4.67502 21.1862 5.15877C22 6.4663 22 8.31087 22 12C22 15.6891 22 17.5337 21.1862 18.8412C20.8851 19.325 20.5111 19.7457 20.0811 20.0845C18.9188 21 17.2792 21 14 21H10C6.72077 21 5.08116 21 3.91891 20.0845C3.48891 19.7457 3.1149 19.325 2.81382 18.8412C2 17.5337 2 15.6891 2 12Z" />
                <path d="M9.5 3L9.5 21" strokeLinejoin="round" />
                <path d="M5 7H6M5 10H6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`} onClick={toggleSidebar}>
            <div className="sidebar-content" onClick={(e) => e.stopPropagation()}>
              <div className="sidebar-header">
                <div className="user-section">
                  <div className="user-avatar">IZ</div>
                  <div className="user-info">
                    <h3>Personal</h3>
                    <p>Le Chat Free</p>
                  </div>
                </div>
                <button className="close-sidebar-btn" onClick={toggleSidebar}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="20"
                    height="20"
                    fill="none"
                    stroke="#d4d4d4"
                    strokeWidth="1.5"
                  >
                    <path d="M2 12C2 8.31087 2 6.4663 2.81382 5.15877C3.1149 4.67502 3.48891 4.25427 3.91891 3.91554C5.08116 3 6.72077 3 10 3H14C17.2792 3 18.9188 3 20.0811 3.91554C20.5111 4.25427 20.8851 4.67502 21.1862 5.15877C22 6.4663 22 8.31087 22 12C22 15.6891 22 17.5337 21.1862 18.8412C20.8851 19.325 20.5111 19.7457 20.0811 20.0845C18.9188 21 17.2792 21 14 21H10C6.72077 21 5.08116 21 3.91891 20.0845C3.48891 19.7457 3.1149 19.325 2.81382 18.8412C2 17.5337 2 15.6891 2 12Z" />
                    <path d="M9.5 3L9.5 21" strokeLinejoin="round" />
                    <path d="M5 7H6M5 10H6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
              
              <nav className="sidebar-nav">
                <a href="#" className="nav-item active">
                  <span>Chat</span>
                  <svg viewBox="0 0 24 24" width="20" height="20">
                    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" fill="currentColor"/>
                  </svg>
                </a>
                <a href="#" className="nav-item">
                  <span>Agents</span>
                  <div className="badge">Beta</div>
                </a>
                <a href="#" className="nav-item">
                  <span>Libraries</span>
                  <div className="badge">Beta</div>
                </a>
                <a href="#" className="nav-item">
                  <span>Connections</span>
                  <div className="badge">Beta</div>
                </a>
              </nav>

              <div className="search-section">
                <input type="text" placeholder="Search" />
                <span className="shortcut">⌘K</span>
              </div>

              <div className="history-section">
                <h4>Previous 30 days</h4>
                <div className="history-items">
                  <a href="#">Загрузить Docker-образ на GitHub</a>
                  <a href="#">Matrix Eigenvalues</a>
                  <a href="#">Матрица и её собственные значения</a>
                  <a href="#">Git: Отменить Ребейз</a>
                </div>
              </div>

              <div className="upgrade-section">
                <button className="upgrade-btn">
                  <span>Upgrade to Pro</span>
                  <span className="card-icon">💳</span>
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <p>Загрузка...</p>
      )}
    </div>
  );
};

export default Chat;