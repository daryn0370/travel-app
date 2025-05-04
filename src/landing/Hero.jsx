import React, { useState, useEffect } from "react";
import "./Hero.css";
import { FaPlaneDeparture, FaHotel, FaCar } from "react-icons/fa";
import { IoCalendarOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const [activeTab, setActiveTab] = useState("avia");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [passengers, setPassengers] = useState("");

  const [fromOptions, setFromOptions] = useState([]);
  const [toOptions, setToOptions] = useState([]);
  const [departureOptions, setDepartureOptions] = useState([]);
  const [returnOptions, setReturnOptions] = useState([]);
  const [passengerOptions, setPassengerOptions] = useState([]);

  const navigate = useNavigate();

  const formatDate = (ds) => {
    if (!ds) return "";
    return new Date(ds).toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  useEffect(() => {
    // Загружаем все билеты, чтобы собрать опции для фильтров
    const fetchTickets = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/avia-tickets", {
          credentials: "include",
        });
        const data = await res.json();
        const uniq = (arr) => [...new Set(arr)];

        setFromOptions(uniq(data.map((t) => t.From)));
        setToOptions(uniq(data.map((t) => t.Where_To)));
        setDepartureOptions(uniq(data.map((t) => t.When)));
        setReturnOptions(uniq(data.map((t) => t.When_back)));

        const uniqNums = uniq(data.map((t) => t.quan_persons)).sort((a, b) => a - b);
        setPassengerOptions(uniqNums);

        if (uniqNums.length) {
          setPassengers(uniqNums[0]);
        }
      } catch (err) {
        console.error("Ошибка при загрузке опций:", err);
      }
    };

    fetchTickets();
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
  
    const toDateOnly = (iso) => {
      const d = new Date(iso);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");
      return `${yyyy}-${mm}-${dd}`;
    };
  
    if (from)          params.append("from", from);
    if (to)            params.append("where_to", to);
    if (departureDate) params.append("when", toDateOnly(departureDate));
    if (returnDate)    params.append("when_back", toDateOnly(returnDate));
    if (passengers)    params.append("quan_persons", passengers);
  
    navigate(`/avia?${params.toString()}`);
  };
  return (
    <div className="hero">
      <h1 className="hero-title">Куда полетим сегодня?</h1>
      <div className="tabs">
        <button
          className={`tab ${activeTab === "avia" ? "active" : ""}`}
          onClick={() => setActiveTab("avia")}
        >
          <FaPlaneDeparture className="icon" /> Авиабилеты
        </button>
        <button
          className={`tab ${activeTab === "hotel" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("hotel");
            navigate("/hotels");
          }}
        >
          <FaHotel className="icon" /> Отели
        </button>
        <button
          className={`tab ${activeTab === "cars" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("cars");
            navigate("/cars");
          }}
        >
          <FaCar className="icon" /> Аренда авто
        </button>
      </div>

      <div className="search-form">
        <select
          className="input"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
        >
          <option value="">Откуда</option>
          {fromOptions.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>

        <select
          className="input"
          value={to}
          onChange={(e) => setTo(e.target.value)}
        >
          <option value="">Куда</option>
          {toOptions.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>

        <div className="date-select">
          <IoCalendarOutline className="icon" />
          <select
            value={departureDate}
            onChange={(e) => setDepartureDate(e.target.value)}
          >
            <option value="">Когда</option>
            {departureOptions.map((d) => (
              <option key={d} value={d}>
                {formatDate(d)}
              </option>
            ))}
          </select>
        </div>

        <div className="date-select">
          <IoCalendarOutline className="icon" />
          <select
            value={returnDate}
            onChange={(e) => setReturnDate(e.target.value)}
          >
            <option value="">Обратно</option>
            {returnOptions.map((d) => (
              <option key={d} value={d}>
                {formatDate(d)}
              </option>
            ))}
          </select>
        </div>

        <select
          className="input"
          value={passengers}
          onChange={(e) => setPassengers(Number(e.target.value))}
        >
          <option value="">Пассажиры</option>
          {passengerOptions.map((n) => (
            <option key={n} value={n}>
              {n} пассажир{n > 1 ? "а" : ""}
            </option>
          ))}
        </select>

        <button className="search-button" onClick={handleSearch}>
          Найти билеты
        </button>
      </div>

      <div className="travel-section">
      <div className="travel-section">
        <div className="card">
          <span className="price-label">✈ Барселона от 89 300 ₸</span>
          <div className="card-content">
            <h2>Готика и пляжи</h2>
            <p>Узкие улочки Готического квартала и пляж Барселонета — лучшее сочетание.</p>
          </div>
        </div>
        <div className="card">
          <span className="price-label">✈ Тбилиси от 65 800 ₸</span>
          <div className="card-content">
            <h2>Старый город и серные бани</h2>
            <p>Аромат хинкали и пар серных бань создают незабываемую атмосферу.</p>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Hero;
