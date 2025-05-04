import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Hotels.css";
import axios from "axios";

import paris1 from "../images/paris1.jpg"
import paris2 from "../images/paris2.jpg"
import paris3 from "../images/paris3.jpg"
import paris4 from "../images/paris4.jpg"
import paris5 from "../images/paris5.jpeg"
import paris6 from "../images/paris6.jpg"

import bar1 from "../images/barcelona1.jpg"
import bar2 from "../images/barcelona2.jpg"
import bar3 from "../images/barcelona3.jpg"
import bar4 from "../images/barcelona4.jpg"
import bar5 from "../images/barcelona5.jpg"
import bar6 from "../images/barcelona6.jpg"

import rome1 from "../images/rome1.jpg"
import rome2 from "../images/rome2.jpg"
import rome3 from "../images/rome3.jpg"
import rome4 from "../images/rome4.jpg"
import rome5 from "../images/rome5.jpg"
import rome6 from "../images/rome6.jpg"

import tok1 from "../images/tok1.jpeg"
import tok2 from "../images/tok2.jpg"
import tok3 from "../images/tok3.jpg"
import tok4 from "../images/tok4.jpg"
import tok5 from "../images/tok5.jpg"
import tok6 from "../images/tok6.jpg"

import ny1 from "../images/ny1.jpg"
import ny2 from "../images/ny2.jpg"
import ny3 from "../images/ny3.jpg"
import ny4 from "../images/ny4.jpg"
import ny5 from "../images/ny5.jpg"
import ny6 from "../images/ny6.jpg"

import dub1 from "../images/dub1.jpg"
import dub2 from "../images/dub2.jpg"
import dub3 from "../images/dub3.jpg"
import dub4 from "../images/dub4.jpg"
import dub5 from "../images/dub5.jpg"
import dub6 from "../images/dub6.jpg"

import si1 from "../images/si1.jpg"
import si2 from "../images/si2.jpg"
import si3 from "../images/si3.jpg"
import si4 from "../images/si4.jpg"
import si5 from "../images/si5.jpg"
import si6 from "../images/si6.jpg"

import lo1 from "../images/lo1.jpg"
import lo2 from "../images/lo2.jpg"
import lo3 from "../images/lo3.jpg"
import lo4 from "../images/lo4.jpg"
import lo5 from "../images/lo5.jpeg"
import lo6 from "../images/lo6.jpg"

import ma1 from "../images/ma1.jpg"
import ma2 from "../images/ma2.jpg"
import ma3 from "../images/ma3.jpg"
import ma4 from "../images/ma4.jpeg"
import ma5 from "../images/ma5.jpg"
import ma6 from "../images/ma6.jpg"

import sy1 from "../images/sy1.jpg"
import sy2 from "../images/sy2.jpg"
import sy3 from "../images/sy3.jpg"
import sy4 from "../images/sy4.jpg"
import sy5 from "../images/sy5.jpg"
import sy6 from "../images/sy6.jpg"

import mu1 from "../images/mu1.jpg"
import mu2 from "../images/mu2.jpg"
import mu3 from "../images/mu3.jpg"
import mu4 from "../images/mu4.jpg"
import mu5 from "../images/mu5.jpg"
import mu6 from "../images/mu6.jpg"

const allHotels = [
  // Париж
  {
    city: "Париж",
    name: "Hotel Lumière",
    price: 54000, // 120 * 450
    image: paris1,
  },
  {
    city: "Париж",
    name: "Eiffel Stay",
    price: 42750, // 95 * 450
    image: paris2,
  },
  {
    city: "Париж",
    name: "Parisian Dreams",
    price: 67500,
    image: paris5,
  },
  {
    city: "Париж",
    name: "Champs Elysees Inn",
    price: 81000,
    image: paris6,
  },
  {
    city: "Париж",
    name: "Montmartre Boutique",
    price: 49500,
    image: paris3,
  },
  {
    city: "Париж",
    name: "Le Jardin Hotel",
    price: 60750,
    image: paris4,
  },

  // Барселона
  {
    city: "Барселона",
    name: "Barcelona Bay",
    price: 58500,
    image: bar3,
  },
  {
    city: "Барселона",
    name: "Gothic Dreams",
    price: 45000,
    image: bar1,
  },
  {
    city: "Барселона",
    name: "Seaside Inn",
    price: 69750,
    image: bar4,
  },
  {
    city: "Барселона",
    name: "Catalonia Star",
    price: 78750,
    image: bar5,
  },
  {
    city: "Барселона",
    name: "La Rambla Hotel",
    price: 51750,
    image: bar2,
  },
  {
    city: "Барселона",
    name: "Sunset View",
    price: 63000,
    image: bar6,
  },

  // Рим
  { city: "Рим", name: "Roma Palace", price: 56250, image: rome1 },
  {
    city: "Рим",
    name: "Colosseum Hotel",
    price: 49500,
    image: rome2,
  },
  { city: "Рим", name: "Vatican View", price: 72000, image: rome5 },
  {
    city: "Рим",
    name: "Trastevere Stay",
    price: 47250,
    image: rome4,
  },
  {
    city: "Рим",
    name: "Ancient City Inn",
    price: 65250,
    image: rome3,
  },
  {
    city: "Рим",
    name: "Roma Centrale",
    price: 60750,
    image: rome6,
  },

  // Токио
  {
    city: "Токио",
    name: "Shibuya Hotel",
    price: 63000,
    image: tok1,
  },
  {
    city: "Токио",
    name: "Tokyo Garden",
    price: 56250,
    image: tok2,
  },
  {
    city: "Токио",
    name: "Asakusa Stay",
    price: 51750,
    image: tok3,
  },
  {
    city: "Токио",
    name: "Akihabara Inn",
    price: 49500,
    image: tok4,
  },
  {
    city: "Токио",
    name: "Shinjuku Nights",
    price: 74250,
    image: tok5,
  },
  {
    city: "Токио",
    name: "Tokyo Tower View",
    price: 85500,
    image: tok6,
  },

  // Нью-Йорк
  {
    city: "Нью-Йорк",
    name: "Times Square Inn",
    price: 90000,
    image: ny1,
  },
  {
    city: "Нью-Йорк",
    name: "Central Park Stay",
    price: 99000,
    image: ny2,
  },
  {
    city: "Нью-Йорк",
    name: "Brooklyn Loft",
    price: 81000,
    image: ny3,
  },
  {
    city: "Нью-Йорк",
    name: "Manhattan Lux",
    price: 112500,
    image: ny4,
  },
  {
    city: "Нью-Йорк",
    name: "NYC Modern",
    price: 94500,
    image: ny5,
  },
  {
    city: "Нью-Йорк",
    name: "Harlem Vibe",
    price: 76500,
    image: ny6,
  },

  // Дубай
  {
    city: "Дубай",
    name: "Burj View Hotel",
    price: 135000,
    image: dub1,
  },
  {
    city: "Дубай",
    name: "Dubai Marina Stay",
    price: 121500,
    image: dub2,
  },
  {
    city: "Дубай",
    name: "Palm Resort",
    price: 157500,
    image: dub3,
  },
  {
    city: "Дубай",
    name: "Desert Mirage",
    price: 117000,
    image: dub4,
  },
  {
    city: "Дубай",
    name: "Downtown Luxe",
    price: 130500,
    image: dub5,
  },
  {
    city: "Дубай",
    name: "Golden Sand Inn",
    price: 108000,
    image: dub6,
  },

  // Сидней
  {
    city: "Сидней",
    name: "Opera View",
    price: 72000,
    image: sy1,
  },
  {
    city: "Сидней",
    name: "Harbour Hotel",
    price: 76500,
    image: sy2,
  },
  {
    city: "Сидней",
    name: "Bondi Breeze",
    price: 67500,
    image: sy3,
  },
  {
    city: "Сидней",
    name: "City Center Inn",
    price: 63000,
    image: sy4,
  },
  {
    city: "Сидней",
    name: "Blue Bay Hotel",
    price: 74250,
    image: sy5,
  },
  {
    city: "Сидней",
    name: "Skyline Stay",
    price: 78750,
    image: sy6,
  },

  // Лондон
  {
    city: "Лондон",
    name: "London Bridge Inn",
    price: 85500,
    image: lo1,
  },
  {
    city: "Лондон",
    name: "Tower View",
    price: 83250,
    image: lo2,
  },
  {
    city: "Лондон",
    name: "Oxford Stay",
    price: 72000,
    image: lo3,
  },
  {
    city: "Лондон",
    name: "Piccadilly Hotel",
    price: 87750,
    image: lo4,
  },
  {
    city: "Лондон",
    name: "Camden Boutique",
    price: 78750,
    image: lo5,
  },
  {
    city: "Лондон",
    name: "Royal Hyde",
    price: 90000,
    image: lo6,
  },

  // Мальдивы
  {
    city: "Мальдивы",
    name: "Island Bliss",
    price: 225000,
    image: ma1,
  },
  {
    city: "Мальдивы",
    name: "Ocean View",
    price: 216000,
    image: ma2,
  },
  {
    city: "Мальдивы",
    name: "Tropical Dream",
    price: 234000,
    image: ma3,
  },
  {
    city: "Мальдивы",
    name: "Coral Resort",
    price: 238500,
    image: ma4,
  },
  {
    city: "Мальдивы",
    name: "Sunset Bungalow",
    price: 220500,
    image: ma5,
  },
  {
    city: "Мальдивы",
    name: "Azure Waters",
    price: 247500,
    image: ma6,
  },

  // Сингапур
  {
    city: "Сингапур",
    name: "Marina Bay Hotel",
    price: 99000,
    image: si1,
  },
  {
    city: "Сингапур",
    name: "Orchard Stay",
    price: 90000,
    image: si2,
  },
  {
    city: "Сингапур",
    name: "Cityscape Inn",
    price: 94500,
    image: si3,
  },
  {
    city: "Сингапур",
    name: "Sentosa Dream",
    price: 103500,
    image: si4,
  },
  {
    city: "Сингапур",
    name: "Little India Inn",
    price: 85500,
    image: si5,
  },
  {
    city: "Сингапур",
    name: "Clarke Quay Hotel",
    price: 108000,
    image: si6,
  },

  // Мюнхен
  {
    city: "Мюнхен",
    name: "Munich Central",
    price: 63000,
    image: mu1,
  },
  {
    city: "Мюнхен",
    name: "Bavarian Stay",
    price: 60750,
    image: mu2,
  },
  {
    city: "Мюнхен",
    name: "Altstadt Hotel",
    price: 67500,
    image: mu3,
  },
  {
    city: "Мюнхен",
    name: "Oktoberfest Inn",
    price: 74250,
    image: mu4,
  },
  {
    city: "Мюнхен",
    name: "Munich View",
    price: 76500,
    image: mu5,
  },
  {
    city: "Мюнхен",
    name: "Isar River Hotel",
    price: 65250,
    image: mu6,
  },
];


const Hotels = () => {
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000000);
  const [sort, setSort] = useState("asc");
  const [selectedCity, setSelectedCity] = useState("all");
  const [addingIndex, setAddingIndex] = useState(null);
  const navigate = useNavigate();

  const cities = ["all", ...new Set(allHotels.map((h) => h.city))];

  const filtered = allHotels
    .filter(
      (h) =>
        h.price >= minPrice &&
        h.price <= maxPrice &&
        (selectedCity === "all" || h.city === selectedCity)
    )
    .sort((a, b) => (sort === "asc" ? a.price - b.price : b.price - a.price));

  // Отправка в профиль
  const handleSelect = async (hotel, idx) => {
    setAddingIndex(idx);
    try {
      await axios.post("/api/user/hotels", hotel, { withCredentials: true });
      alert(`Отель "${hotel.name}" добавлен в ваш профиль`);
    } catch (err) {
      console.error(err);
      alert("Не удалось добавить отель");
    } finally {
      setAddingIndex(null);
    }
  };

  return (
    <div className="hotels-wrapper">
      <button className="back-button" onClick={() => navigate("/")}>
        ← Назад
      </button>
      <div className="hotels-content">
        <aside className="sidebar">
          <h3>Фильтры</h3>
          {/* Фильтры по городу и цене */}
          <div className="filter-group">
            <label>Город</label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
            >
              {cities.map((c) => (
                <option key={c} value={c}>
                  {c === "all" ? "Все" : c}
                </option>
              ))}
            </select>
          </div>
          <div className="filter-group">
            <label>Цена от</label>
            <input
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(+e.target.value)}
            />
          </div>
          <div className="filter-group">
            <label>Цена до</label>
            <input
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(+e.target.value)}
            />
          </div>
          <div className="filter-group">
            <label>Сортировка</label>
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="asc">По возрастанию</option>
              <option value="desc">По убыванию</option>
            </select>
          </div>
        </aside>

        <div className="hotels-grid">
          {filtered.map((hotel, idx) => (
            <div className="hotel-card" key={idx}>
              <img src={hotel.image} alt={hotel.name} />
              <div className="hotel-info-row">
                <div className="hotel-info">
                  <h3>{hotel.name}</h3>
                  <p>{hotel.city}</p>
                  <p>{hotel.price} ₸ / ночь</p>
                </div>
                <div className="hotel-actions">
                  <button
                    disabled={addingIndex === idx}
                    className="select-button"
                    onClick={() => handleSelect(hotel, idx)}
                  >
                    {addingIndex === idx ? "Добавляем..." : "Выбрать"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hotels;

