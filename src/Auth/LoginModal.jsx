import React, { useState } from "react";
import "./Modal.css";
import { IoMdClose } from "react-icons/io";
import axios from "axios";
import { useAuthStore } from "../stores/authStore";

const LoginModal = ({ onClose }) => {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const { setUser, setIsAuthenticated } = useAuthStore();

  const handleSubmit = async () => {
    setError("");
    try {
      const res = await axios.post(
        "/api/login",
        { email, password },
        { withCredentials: true }
      );
      setUser(res.data.user);
      setIsAuthenticated(true);
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || "Неверный email или пароль");
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="login-card" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          <IoMdClose size={24} />
        </button>
        <h2 className="login-title">Вход в профиль</h2>
        <p className="login-subtitle">
          Введите данные для входа в ваш аккаунт
        </p>
        <input
          type="email"
          className="input-field"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          className="input-field"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="error-text">{error}</p>}
        <button className="submit-btn" onClick={handleSubmit}>
          Войти
        </button>
        <label className="checkbox-wrapper">
          <input type="checkbox" />
          <span>Запомнить меня</span>
        </label>
        <p className="legal-text">
          Авторизуясь, вы соглашаетесь с{" "}
          <a href="#">Лицензионным соглашением</a> и{" "}
          <a href="#">Политикой конфиденциальности</a>
        </p>
      </div>
    </div>
);

}
export default LoginModal;
