import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../hooks/useApp';
import toast from 'react-hot-toast';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useApp();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim() && password.trim()) {
      login();
      toast.success('Добро пожаловать!');
      navigate('/');
    } else {
      toast.error('Заполните все поля');
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2>Вход в RUNDEFULL</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              required
            />
          </label>
          <label>
            Пароль
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </label>
          <button type="submit">Войти</button>
        </form>
        <p className="login-hint">Любые данные — вход всегда успешен</p>
      </div>
    </div>
  );
}

export default LoginPage;