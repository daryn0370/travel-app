import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Cars.css";
import axios from "axios";

import bmw from "../images/bmw.png";
import mercedes from "../images/mercedes.png";
import audi from "../images/audi.png";
import lexus from "../images/lexus.png";
import toyota from "../images/toyota.png";
import kia from "../images/kia.png";

const carsData = [
  { name: "BMW 530 G30",     city: "Нур-Султан", price: 85000, image: bmw },
  { name: "Mercedes E class",city: "Алматы",    price: 98500, image: mercedes },
  { name: "Audi Q8",         city: "Шымкент",   price: 85000, image: audi },
  { name: "Lexus IS 350",    city: "Атырау",     price: 70000, image: lexus },
  { name: "Toyota Camry 75", city: "Караганда", price: 35000, image: toyota },
  { name: "Kia K7",          city: "Павлодар",  price: 48000, image: kia },
];


const Cars = () => {
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(200000);
  const [sort, setSort] = useState("asc");
  const [addingIndex, setAddingIndex] = useState(null);
  const navigate = useNavigate();

  const filtered = carsData
    .filter((c) => c.price >= minPrice && c.price <= maxPrice)
    .sort((a, b) => (sort === "asc" ? a.price - b.price : b.price - a.price));

  const handleSelect = async (car, idx) => {
    setAddingIndex(idx);
    try {
      await axios.post("/api/user/cars", car, { withCredentials: true });
      alert(`Авто "${car.name}" добавлено в ваш профиль`);
    } catch (err) {
      console.error(err);
      alert("Не удалось добавить авто");
    } finally {
      setAddingIndex(null);
    }
  };

  return (
    <div className="car-wrapper">
      <button className="car-back-btn" onClick={() => navigate("/")}>
        ← Назад
      </button>
      <div className="car-content">
        <aside className="car-sidebar">
          <h3>Фильтры</h3>

          <label>Цена от</label>
          <input type="number" value={minPrice} onChange={(e) => setMinPrice(+e.target.value)} />

          <label>Цена до</label>
          <input type="number" value={maxPrice} onChange={(e) => setMaxPrice(+e.target.value)} />

          <label>Сортировка</label>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="asc">По возрастанию</option>
            <option value="desc">По убыванию</option>
          </select>
        </aside>

        <div className="car-grid">
          {filtered.map((car, idx) => (
            <div className="car-card" key={idx}>
              <img src={car.image} alt={car.name} />
              <div className="car-info-row">
                <div className="car-info">
                  <h3>{car.name}</h3>
                  <p>{car.price} ₸ / день</p>
                </div>
                <button
                  disabled={addingIndex === idx}
                  className="car-select-btn"
                  onClick={() => handleSelect(car, idx)}
                >
                  {addingIndex === idx ? "Добавляем..." : "Выбрать"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Cars;
