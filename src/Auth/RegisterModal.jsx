import React, { useState } from "react";
import "./Modal.css";
import { IoMdClose } from "react-icons/io";
import axios from "axios";
import { useAuthStore } from "../stores/authStore";

const RegisterModal = ({ onClose }) => {
  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");
  const [confirm, setConfirm]     = useState("");
  const [error, setError]         = useState("");
  const { setUser, setIsAuthenticated } = useAuthStore();

  const handleSubmit = async () => {
    if (password !== confirm) {
      setError("Пароли не совпадают");
      return;
    }
    setError("");
    try {
      const res = await axios.post(
        "/api/register",
        { email, password, name: "Новый пользователь" },
        { withCredentials: true }
      );
      setUser(res.data.user);
      setIsAuthenticated(true);
      onClose();
    } catch (err) {
      setError(err.response?.data?.error | "Ошибка регистрации");
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="login-card" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          <IoMdClose size={24} />
        </button>
        <h2 className="login-title">Зарегистрируйтесь</h2>
        <p className="login-subtitle">
          Создайте аккаунт…
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
        <input
          type="password"
          className="input-field"
          placeholder="Подтвердите пароль"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />
        {error && <p className="error-text">{error}</p>}
        <button className="submit-btn" onClick={handleSubmit}>
          Зарегистрироваться
        </button>
        <label className="checkbox-wrapper">
          <input type="checkbox" />
          <span>Подписаться на рассылку</span>
        </label>
        <p className="legal-text">
          Регистрируясь, вы соглашаетесь с…
        </p>
      </div>
    </div>
);
}
export default RegisterModal;
