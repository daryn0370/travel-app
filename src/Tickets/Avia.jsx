import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Avia.css";
import { useSearchParams } from "react-router-dom";

export default function Avia() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState(null);

  const [searchParams] = useSearchParams();

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return "";
    const [h, m] = timeString.split(":");
    return `${h}:${m}`;
  };

  useEffect(() => {
    const fetchTickets = async () => {
      setLoading(true);

      const params = {
        from: searchParams.get("from") || "",
        where_to: searchParams.get("where_to") || "",
        when: searchParams.get("when") || "",
        when_back: searchParams.get("when_back") || "",
        quan_persons: searchParams.get("quan_persons") || "",
      };

      try {
        const res = await axios.get("http://localhost:5000/api/avia-tickets", {
          withCredentials: true,
          params,
        });
        setTickets(res.data);
      } catch (err) {
        console.error("Ошибка при получении билетов:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [searchParams]);

  const handleBuy = async (ticketId) => {
    setAddingId(ticketId);
    try {
      await axios.post(
        "/api/user/tickets",
        { ticketId },
        { withCredentials: true }
      );
      alert("Билет добавлен в ваш профиль!");
    } catch (err) {
      console.error("Ошибка добавления билета:", err);
      alert("Не удалось добавить билет");
    } finally {
      setAddingId(null);
    }
  };

  if (loading) return <div>Загрузка билетов...</div>;

  return (
    <div className="avia-layout">
      {/* Левая колонка с фото */}
      <div className="avia-side">
        {[...Array(8)].map((_, i) => (
          <img key={i} src={`/src/images/left-${i + 1}.jpg`} alt={`left-${i + 1}`} />
        ))}
      </div>

      {/* Центральная колонка с билетами */}
      <div className="avia-page">
        <div className="ticket-container">
          {tickets.length === 0 ? (
            <div>Билеты не найдены по заданным параметрам.</div>
          ) : (
            tickets.map((t) => (
              <div key={t.ticket_id} className="avia-ticket">
                <div className="avia-left">
                  <div className="price">{t.price} ₸</div>
                  <div className="class">Класс: {t.class}</div>
                  <button
                    className="buy-button"
                    disabled={addingId === t.ticket_id}
                    onClick={() => handleBuy(t.ticket_id)}
                  >
                    {addingId === t.ticket_id ? "Добавляем..." : "Выбрать билет"}
                  </button>
                </div>

                <div className="avia-center">
                  <div className="flight-times">
                    <div className="departure">
                      <div className="date">{formatDate(t.When)}</div>
                      <div className="city">{t.From}</div>
                      <div className="time">{formatTime(t.departure_time)}</div>
                    </div>
                    <div className="duration">
                      <div className="line"></div>
                    </div>
                    <div className="arrival">
                      <div className="date">{formatDate(t.When_back)}</div>
                      <div className="city">{t.Where_To}</div>
                      <div className="time">{formatTime(t.return_time)}</div>
                    </div>
                  </div>
                </div>

                <div className="avia-right">
                  <button className="icon-btn">♡</button>
                  <button className="icon-btn">⇪</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Правая колонка с фото */}
      <div className="avia-side">
        {[...Array(8)].map((_, i) => (
          <img key={i} src={`/src/images/right-${i + 1}.jpg`} alt={`right-${i + 1}`} />
        ))}
      </div>
    </div>
  );
}
