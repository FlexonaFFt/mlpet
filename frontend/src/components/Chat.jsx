import { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/Chat.css';

const Chat = ({ onLogout }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Токен отсутствует. Пожалуйста, войдите снова.');
        onLogout();
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
        } else {
          setError('Ошибка загрузки данных пользователя.');
        }
      }
    };

    fetchUser();
  }, [onLogout]);

  return (
    <div className="chat-container">
      {error && <p className="error-message">{error}</p>}
      {user ? (
        <>
          <h1>Чат</h1>
          <p>
            Добро пожаловать, <strong>{user.username || 'Пользователь'}</strong>!
          </p>
          <p>Email: {user.email}</p>
          <button onClick={onLogout} className="logout-btn">
            Выйти
          </button>
        </>
      ) : (
        <p>Загрузка...</p>
      )}
    </div>
  );
};

export default Chat;