import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LandingPage.css'; // Ми створимо цей файл наступним

function LandingPage() {
  const navigate = useNavigate();

  // Функція для переходу на сторінку логіну
  const handleArrowClick = () => {
    navigate('/login');
  };

  return (
    <div className="landing-container">
      
      {/* Текст з анімацією друкування */}
      <div className="typing-effect">
        Plan your day.
      </div>

      {/* Контейнер для стрілки, що з'являється */}
      <div className="arrow-container" onClick={handleArrowClick}>
        <span className="arrow">→</span>
      </div>

    </div>
  );
}

export default LandingPage;