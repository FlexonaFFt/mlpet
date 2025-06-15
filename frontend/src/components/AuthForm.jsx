import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Silk from "./Silk";
import "../styles/AuthForm.css";

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!isLogin && username.trim().length < 3) {
      setError("Имя пользователя должно быть не короче 3 символов");
      setLoading(false);
      return;
    }

    if (!validateEmail(email)) {
      setError("Введите корректный email");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Пароль должен быть не менее 6 символов");
      setLoading(false);
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      setError("Пароли не совпадают");
      setLoading(false);
      return;
    }

    try {
      const endpoint = isLogin ? "/login" : "/register";
      const payload = isLogin
        ? {
            email_or_username: email,
            password,
          }
        : {
            email,
            username,
            password,
          };

      const response = await axios.post(`http://localhost:8000${endpoint}`, payload);

      const { access_token } = response.data;
      localStorage.setItem("token", access_token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.detail || "Ошибка при обработке запроса");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="login-box">
        <div className="left">
          <div className="circle" />
          <button className="signup-btn" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Sign Up" : "Sign In"}
          </button>
          <h1>{isLogin ? "Welcome Back" : "Create Account"}</h1>
          <p>
            Please enter your {isLogin ? "credentials to continue" : "details to register"}.
          </p>
          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            )}
            <input
              type="email"
              placeholder={isLogin ? "Email or Username" : "Email"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {!isLogin && (
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            )}
            {error && <p className="error-message">{error}</p>}
            <button className="continue-btn" type="submit" disabled={loading}>
              {loading ? "Loading..." : isLogin ? "Continue" : "Sign Up"}
            </button>
          </form>
          <div className="divider">or continue with</div>
          <div className="socials">
            <button className="social-btn">G</button>
            <button className="social-btn">F</button>
            <button className="social-btn">T</button>
          </div>
          <div className="terms">
            By continuing, you agree to our <a href="#">Terms</a> and{" "}
            <a href="#">Privacy Policy</a>.
          </div>
        </div>
        <div className="right">
          <Silk
            speed={5}
            scale={1}
            color="#7B7481"
            noiseIntensity={1.5}
            rotation={0}
          />
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
