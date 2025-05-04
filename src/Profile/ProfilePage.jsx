// ProfilePage.jsx
import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import "./UserProfile.css";

const ProfilePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { clearAuth, isAuthenticated } = useAuthStore();

  const initialTab = location.state?.tab || "profile";
  const [activeTab, setActiveTab] = useState(initialTab);

  // Профиль
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [country, setCountry] = useState("");
  const [language, setLanguage] = useState("");

  // Мои данные
  const [myTickets, setMyTickets] = useState([]);
  const [loadingTickets, setLoadingTickets] = useState(false);
  const [myHotels, setMyHotels] = useState([]);
  const [loadingHotels, setLoadingHotels] = useState(false);
  const [myCars, setMyCars] = useState([]);
  const [loadingCars, setLoadingCars] = useState(false);

  // Оплата
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const tabLabels = {
    profile: "Профиль",
    tickets: "Билеты",
    hotels: "Отели",
    cars: "Машины",
    payment: "Оплата",
  };

  // Загрузка профиля
  useEffect(() => {
    axios
      .get("/api/check-auth", { withCredentials: true })
      .then((res) => {
        if (res.data.isAuthenticated) {
          const u = res.data.user;
          setUser(u);
          setName(u.name);
          setEmail(u.email);
          setAvatarPreview(u.avatar);
          setCountry(u.country || "");
          setLanguage(u.language || "");
        } else {
          navigate("/");
        }
      })
      .catch(() => navigate("/"));
  }, [navigate]);

  // Загрузка всех сохранённых данных (для оплаты и табов)
  useEffect(() => {
    // Тикеты
    setLoadingTickets(true);
    axios
      .get("/api/user/tickets", { withCredentials: true })
      .then((res) => setMyTickets(res.data))
      .finally(() => setLoadingTickets(false));

    // Отели
    setLoadingHotels(true);
    axios
      .get("/api/user/hotels", { withCredentials: true })
      .then((res) => setMyHotels(res.data))
      .finally(() => setLoadingHotels(false));

    // Машины
    setLoadingCars(true);
    axios
      .get("/api/user/cars", { withCredentials: true })
      .then((res) => setMyCars(res.data))
      .finally(() => setLoadingCars(false));
  }, []);

  // Выход
  const logout = async () => {
    await axios.post("/api/logout", {}, { withCredentials: true });
    clearAuth();
    navigate("/");
  };

  // Сохранение профиля
  const handleSave = async () => {
    const formData = new FormData();
    formData.append("name", name);
    if (currentPassword) formData.append("currentPassword", currentPassword);
    if (newPassword) formData.append("newPassword", newPassword);
    formData.append("country", country);
    formData.append("language", language);
    if (avatarFile) formData.append("avatar", avatarFile);

    await axios.post("/api/user/profile", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true,
    });
    alert("Профиль обновлён");
  };

  // Изменение аватара
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  // Удаление сохранённых сущностей
  const handleDeleteTicket = async (ticketId) => {
    if (!window.confirm("Удалить этот билет?")) return;
    await axios.delete(`/api/user/tickets/${ticketId}`, { withCredentials: true });
    setMyTickets((prev) => prev.filter((t) => t.ticket_id !== ticketId));
  };
  const handleDeleteHotel = async (id) => {
    if (!window.confirm("Удалить этот отель?")) return;
    await axios.delete(`/api/user/hotels/${id}`, { withCredentials: true });
    setMyHotels((prev) => prev.filter((h) => h.id !== id));
  };
  const handleDeleteCar = async (id) => {
    if (!window.confirm("Удалить эту машину?")) return;
    await axios.delete(`/api/user/cars/${id}`, { withCredentials: true });
    setMyCars((prev) => prev.filter((c) => c.id !== id));
  };

  // Валидация карт
  const isValidCardNumber = (number) => /^(\d{4} ?){4}$/.test(number.trim());
  const isValidExpiry = (exp) => {
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(exp)) return false;
    const [m, y] = exp.split("/").map(Number);
    const now = new Date();
    const currY = now.getFullYear() % 100;
    const currM = now.getMonth() + 1;
    return y > currY || (y === currY && m >= currM);
  };
  const isValidCVC = (c) => /^\d{3}$/.test(c);

  // Расчёт итоговой суммы (без ведущих нулей)
  const totalAmount = useMemo(() => {
    const allPrices = [
    ...myTickets.map(t => Number(t.price) || 0),
    ...myHotels.map(h => Number(h.price) || 0),
    ...myCars.map(c => Number(c.price) || 0),
    ];
    const sum = allPrices.reduce((a, b) => a + b, 0);
    return sum.toLocaleString("ru-RU");
    }, [myTickets, myHotels, myCars]);

  // Обработка оплаты (эмуляция)
  const handlePayment = async (e) => {
    e.preventDefault();
  try {
  await axios.post("/api/payment", {}, { withCredentials: true });  
  // (на сервере в /api/payment после успешной оплаты вызывается отправка письма)
  setPaymentSuccess(true);
  } catch (err) {
  console.error("Ошибка при оплате:", err);
  alert("Не удалось провести оплату. Попробуйте снова.");
   }
  };
  return (
    <div className="user-container">
      <div className="user-sidebar">
        {Object.entries(tabLabels).map(([key, label]) => (
          <div
            key={key}
            className={`user-sidebar-item ${activeTab === key ? "active" : ""}`}
            onClick={() => setActiveTab(key)}
          >
            {label}
          </div>
        ))}
      </div>

      <div className="user-content">
        <button className="back-button" onClick={() => navigate("/")}>
          ← Назад
        </button>

        {/* Профиль */}
        {activeTab === "profile" && (
          <>
            <h1>Профиль</h1>
            <div className="user-section">
              <h2>Аватар</h2>
              <div className="user-avatar-upload">
                <img
                  src={avatarPreview || "https://via.placeholder.com/100"}
                  alt="avatar"
                  className="user-avatar-img"
                />
                <input type="file" accept="image/*" onChange={handleAvatarChange} />
              </div>
            </div>
            <div className="user-section">
              <h2>Имя и почта</h2>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="user-input"
              />
              <input type="email" value={email} disabled className="user-input" />
            </div>
            <div className="user-section">
              <h2>Смена пароля</h2>
              <input
                type="password"
                placeholder="Текущий пароль"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="user-input"
              />
              <input
                type="password"
                placeholder="Новый пароль"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="user-input"
              />
            </div>
            <div className="user-section">
              <h2>Настройки региона</h2>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="user-select"
              >
                <option value="">— выбор страны —</option>
                <option>Россия</option>
                <option>Казахстан</option>
                <option>Украина</option>
                <option>Грузия</option>
              </select>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="user-select"
              >
                <option value="">— выбор языка —</option>
                <option>Русский</option>
                <option>English</option>
                <option>Қазақша</option>
                <option>Українська</option>
              </select>
            </div>
            <div className="buttons-group">
              <button className="user-save-btn" onClick={handleSave}>
                Сохранить
              </button>
              {isAuthenticated && (
                <button className="user-logout-btn" onClick={logout}>
                  Выйти
                </button>
              )}
            </div>
          </>
        )}

        {/* Мои билеты */}
        {activeTab === "tickets" && (
          <>
            <h1>Мои билеты</h1>
            {loadingTickets ? (
              <div>Загрузка…</div>
            ) : myTickets.length > 0 ? (
              <ul className="ticket-list">
                {myTickets.map((t) => (
                  <li key={t.ticket_id} className="ticket-card">
                    <div className="ticket-info">
                      <h3>
                        {t.From} → {t.Where_To}
                      </h3>
                      <p>Дата: {new Date(t.When).toLocaleDateString("ru-RU")}</p>
                      <p>Цена: {t.price} ₸</p>
                    </div>
                    <button className="delete-btn" onClick={() => handleDeleteTicket(t.ticket_id)}>
                      Удалить
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>Нет билетов</p>
            )}
          </>
        )}

        {/* Мои отели */}
        {activeTab === "hotels" && (
          <>
            <h1>Мои отели</h1>
            {loadingHotels ? (
              <div>Загрузка…</div>
            ) : myHotels.length > 0 ? (
              <ul className="hotel-list">
                {myHotels.map((h) => (
                  <li key={h.id} className="hotel-card">
                    <img src={h.image} alt={h.name} className="hotel-image" />
                    <div className="hotel-info">
                      <h3>{h.name}</h3>
                      <p>{h.city}</p>
                      <p>{h.price} ₸ / ночь</p>
                    </div>
                    <button className="delete-btn" onClick={() => handleDeleteHotel(h.id)}>
                      Удалить
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>Нет сохранённых отелей</p>
            )}
          </>
        )}

        {/* Мои машины */}
        {activeTab === "cars" && (
          <>
            <h1>Мои машины</h1>
            {loadingCars ? (
              <div>Загрузка…</div>
            ) : myCars.length > 0 ? (
              <ul className="car-list">
                {myCars.map((car) => (
                  <li key={car.id} className="car-card">
                    <img src={car.image} alt={car.name} className="car-image" />
                    <div className="car-info">
                      <h3>{car.name}</h3>
                      <p>{car.city}</p>
                      <p>{car.price} ₸ / день</p>
                    </div>
                    <button className="car-delete-btn" onClick={() => handleDeleteCar(car.id)}>
                      Удалить
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>Нет сохранённых машин</p>
            )}
          </>
        )}

        {/* Оплата */}
        {activeTab === "payment" && (
          <div className="payment-tab">
            <h1>Оплата</h1>
            <p>
              Всего к оплате: <strong>{totalAmount} ₸</strong>
            </p>

            {paymentSuccess ? (
              <div className="payment-success">
                <h2>Оплата прошла успешно!</h2>
                <button onClick={() => setPaymentSuccess(false)}>Ещё раз оплатить</button>
              </div>
            ) : (
              <form className="payment-form" onSubmit={handlePayment}>
                <div className="form-group">
                  <label>Номер карты</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="0000 0000 0000 0000"
                    maxLength={19}
                    required
                  />
                  {!isValidCardNumber(cardNumber) && cardNumber && (
                    <p className="error-message">Некорректный номер карты</p>
                  )}
                </div>
                <div className="form-group">
                  <label>Срок действия</label>
                  <input
                    type="text"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    placeholder="MM/YY"
                    maxLength={5}
                    required
                  />
                  {!isValidExpiry(expiry) && expiry && (
                    <p className="error-message">Некорректный срок действия</p>
                  )}
                </div>
                <div className="form-group">
                  <label>CVC</label>
                  <input
                    type="text"
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value)}
                    placeholder="123"
                    maxLength={3}
                    required
                  />
                  {!isValidCVC(cvc) && cvc && (
                    <p className="error-message">Некорректный CVC</p>
                  )}
                </div>
                <button
                  type="submit"
                  className="payment-btn"
                  disabled={
                    !isValidCardNumber(cardNumber) ||
                    !isValidExpiry(expiry) ||
                    !isValidCVC(cvc)
                  }
                >
                  Оплатить {totalAmount} ₸
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;