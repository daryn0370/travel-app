import React from "react";
import "./TravelCards.css";
import { FaPlane } from "react-icons/fa";

const TravelCards = () => {
  return (
    <div className="travel-section">
      <div className="cards-grid">
        <div className="card">
          <div className="card-overlay"></div>
          <div className="card-badge">
            <FaPlane /> Пхукет от 56 410 ₸
          </div>
          <h2 className="card-title">Увидеть лучшие закаты на острове</h2>
          <p className="card-text">
            Если разбудить тайца посреди ночи и спросить про лучший закатный спот на Пхукете,...
          </p>
        </div>

        <div className="card card-second">
          <div className="card-overlay"></div>
          <div className="card-badge">
            <FaPlane /> Анталья от 78 948 ₸
          </div>
          <h2 className="card-title">Грин Каньон</h2>
          <p className="card-text">
            В прошлом веке турки строили ГЭС, а в придачу получили озёра с изумрудной водой. Местност...
          </p>
        </div>
      </div>
    </div>
  );
};

export default TravelCards;
