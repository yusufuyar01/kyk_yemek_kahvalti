import React, { useState, useEffect } from 'react';
import { useSwipeable } from 'react-swipeable';
import { ChevronLeft, ChevronRight, Coffee, Utensils, Sun, Moon } from 'lucide-react';
import './MobileMealPlanner.css';

const generateRandomMeal = (isBreakfast) => {
  const breakfastItems = ['Simit ve Peynir', 'Menemen', 'Sucuklu Yumurta'];
  const dinnerItems = ['Mercimek Çorbası', 'Karnıyarık', 'Köfte'];
  const items = isBreakfast ? breakfastItems : dinnerItems;
  return items[Math.floor(Math.random() * items.length)];
};

const generateRandomDrink = (isBreakfast) => {
  const breakfastDrinks = ['Çay', 'Türk Kahvesi'];
  const dinnerDrinks = ['Ayran', 'Şalgam Suyu'];
  const drinks = isBreakfast ? breakfastDrinks : dinnerDrinks;
  return drinks[Math.floor(Math.random() * drinks.length)];
};

const DayComponent = ({ date, breakfast, dinner, animationClass }) => (
  <div className={`day-component ${animationClass}`}>
    <h2 className="day-title">{date.toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long' })}</h2>
    <div className="meal-section">
      <h3 className="meal-title breakfast">
        <Coffee className="meal-icon" /> Kahvaltı
      </h3>
      <p className="meal-text">{breakfast.meal}</p>
      <p className="drink-text">İçecek: {breakfast.drink}</p>
    </div>
    <div className="meal-section">
      <h3 className="meal-title dinner">
        <Utensils className="meal-icon" /> Akşam Yemeği
      </h3>
      <p className="meal-text">{dinner.meal}</p>
      <p className="drink-text">İçecek: {dinner.drink}</p>
    </div>
  </div>
);

export default function MobileMealPlanner() {
  const [mealPlan, setMealPlan] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(5);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [animationClass, setAnimationClass] = useState('');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  useEffect(() => {
    const today = new Date();
    const mealPlanData = Array.from({ length: 11 }, (_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() - 5 + i);
      return {
        date,
        breakfast: {
          meal: generateRandomMeal(true),
          drink: generateRandomDrink(true),
        },
        dinner: {
          meal: generateRandomMeal(false),
          drink: generateRandomDrink(false),
        },
      };
    });
    setMealPlan(mealPlanData);
  }, []);

  const handleNavigation = (direction) => {
    setAnimationClass(direction === 'next' ? 'slide-out-left' : 'slide-out-right');
    setTimeout(() => {
      setCurrentIndex((prev) => 
        direction === 'next' ? Math.min(prev + 1, mealPlan.length - 1) : Math.max(prev - 1, 0)
      );
      setAnimationClass(direction === 'next' ? 'slide-in-right' : 'slide-in-left');
    }, 300);
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => handleNavigation('next'),
    onSwipedRight: () => handleNavigation('prev'),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  return (
    <div className="meal-planner">
      <div className="theme-toggle" onClick={() => setIsDarkMode(!isDarkMode)}>
        {isDarkMode ? <Sun className="theme-toggle-icon" /> : <Moon className="theme-toggle-icon" />}
      </div>
      <h1 className="main-title">Günlük Yemek Planı</h1>
      <div className="planner-container" {...handlers}>
        {mealPlan.length > 0 && (
          <DayComponent
            date={mealPlan[currentIndex].date}
            breakfast={mealPlan[currentIndex].breakfast}
            dinner={mealPlan[currentIndex].dinner}
            animationClass={animationClass}
          />
        )}
      </div>
      <div className="navigation-buttons">
        <button
          className="nav-button"
          onClick={() => handleNavigation('prev')}
          disabled={currentIndex === 0}
        >
          <ChevronLeft className="button-icon" />
          Önceki
        </button>
        <button
          className="nav-button"
          onClick={() => handleNavigation('next')}
          disabled={currentIndex === mealPlan.length - 1}
        >
          Sonraki
          <ChevronRight className="button-icon" />
        </button>
      </div>
      <p className="date-indicator">
        {mealPlan.length > 0 && mealPlan[currentIndex].date.toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long' })}
      </p>
      <div className="developer-credit">
        <p>Developed by <a href="https://github.com/username">Your Name</a></p>
      </div>
    </div>
  );
}
