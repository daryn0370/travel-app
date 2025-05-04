import React, { useState } from "react";
import "./ChatBot.css";

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);

  const responses = {
    билет: "Чтобы купить билет, перейдите в раздел 'Авиа-Билеты' и выберите нужное направление.",
    билеты: "Чтобы купить билет, перейдите в раздел 'Авиа-Билеты' и выберите нужное направление.",
    авиа: "Для покупки авиа-билетов, пожалуйста, откройте раздел 'Авиа-Билеты'.",
    полет: "Для покупки авиабилетов перейдите в раздел 'Авиа-Билеты'.",
    аренда: "Для аренды машины откройте вкладку 'Аренда авто', выберите авто и оформите заявку.",
    авто: "Для аренды автомобиля перейдите в раздел 'Аренда авто'.",
    машину: "Вы можете арендовать машину в разделе 'Аренда авто'.",
    машины: "Вы можете арендовать машину в разделе 'Аренда авто'.",
    аренда_машины: "Перейдите в раздел 'Аренда авто', чтобы арендовать машину.",
    гостиницы: "Вы можете забронировать гостиницу на странице 'Отели', выбрав даты и город.",
    гостиницу: "Вы можете забронировать гостиницу на странице 'Отели', выбрав даты и город.",
    отель: "Для бронирования отеля, пожалуйста, откройте раздел 'Отели'.",
    отели: "Вы можете забронировать гостиницу на странице 'Отели', выбрав даты и город.",
    жилье: "В разделе 'Отели' вы можете найти подходящее жилье для отдыха.",
    привет: "Здравствуйте! Я ваш помощник. Задайте вопрос о сайте 😊",
    помощь: "Я могу помочь вам с билетами, арендой машин и гостиницами.",
    как_забронировать: "Чтобы забронировать билет, отель или машину, перейдите в соответствующий раздел.",
    вопросы: "Как я могу помочь вам? Я могу ответить на вопросы по билетам, аренде и отелям.",
  };

  const getBotResponse = (text) => {
    text = text.toLowerCase(); // Приводим текст к нижнему регистру
    for (let key in responses) {
      // Ищем ключевые слова в тексте
      if (text.includes(key)) {
        return responses[key];
      }
    }
    return "Извините, я не понял вопрос. Попробуйте сформулировать иначе.";
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg = { sender: "user", text: input };
    const botMsg = { sender: "bot", text: getBotResponse(input) };

    setMessages([...messages, userMsg, botMsg]);
    setInput("");
  };

  return (
    <>
      <button className="chat-toggle" onClick={() => setOpen(!open)}>
        {open ? "Закрыть" : "Чат"}
      </button>

      {open && (
        <div className="chatbox">
          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`msg ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
          </div>
          <div className="chat-input">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Напишите вопрос..."
            />
            <button onClick={handleSend}>➤</button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;
