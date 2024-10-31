'use client'

import React, { useState, useEffect } from 'react'
import { useSwipeable } from 'react-swipeable'
import { ChevronLeft, ChevronRight, Coffee, Utensils } from 'lucide-react'
import './MobileMealPlanner.css'


// Rastgele yemek seçenekleri ekleyin
const generateRandomMeal = (isBreakfast) => {
  const breakfastItems = [
    'Simit ve Peynir', 'Menemen', 'Sucuklu Yumurta', 'Bal ve Kaymak',
    'Börek', 'Poğaça', 'Çılbır', 'Kahvaltı Tabağı', 'Omlet',
    'Gözleme', 'Reçel ve Tereyağı', 'Zeytin ve Domates', 'Kaşarlı Tost',
    'Sahanda Yumurta', 'Peynirli Pide', 'Kuymak', 'Kavurmalı Yumurta',
    'Patatesli Yumurta', 'Kaygana', 'Bazlama'
  ]
  const dinnerItems = [
    'Mercimek Çorbası', 'Karnıyarık', 'İmam Bayıldı', 'Kuru Fasulye ve Pilav',
    'Mantı', 'Lahmacun', 'Pide', 'Köfte', 'Tavuk Şiş', 'Balık Buğulama',
    'Zeytinyağlı Dolma', 'Kısır', 'Kuzu Tandır', 'İskender', 'Patlıcan Musakka',
    'Etli Güveç', 'Tavuk Sote', 'Kıymalı Pide', 'Hünkar Beğendi', 'Çoban Kavurma',
    'Adana Kebap', 'Urfa Kebap', 'Ali Nazik', 'Tas Kebabı', 'Patlıcan Kebabı',
    'Beyti Sarma', 'Çökertme Kebabı', 'Testi Kebabı', 'Pide Çeşitleri', 'İçli Köfte'
  ]
  const items = isBreakfast ? breakfastItems : dinnerItems
  return items[Math.floor(Math.random() * items.length)]
}

const generateRandomDrink = (isBreakfast) => {
  const breakfastDrinks = ['Çay', 'Türk Kahvesi', 'Portakal Suyu', 'Ayran', 'Süt', 'Ihlamur', 'Bitki Çayı', 'Salep']
  const dinnerDrinks = ['Ayran', 'Şalgam Suyu', 'Limonata', 'Maden Suyu', 'Şerbet', 'Kola', 'Soda', 'Meyveli Soda']
  const drinks = isBreakfast ? breakfastDrinks : dinnerDrinks
  return drinks[Math.floor(Math.random() * drinks.length)]
}

const DayComponent = ({ date, breakfast, dinner }) => (
  <div className="day-component">
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
)

export default function MobileMealPlanner() {
  const [mealPlan, setMealPlan] = useState([])
  const [currentIndex, setCurrentIndex] = useState(5)

  useEffect(() => {
    const today = new Date()
    const mealPlanData = Array.from({ length: 11 }, (_, i) => {
      const date = new Date(today)
      date.setDate(today.getDate() - 5 + i)
      return {
        date,
        breakfast: {
          meal: generateRandomMeal(true),
          drink: generateRandomDrink(true)
        },
        dinner: {
          meal: generateRandomMeal(false),
          drink: generateRandomDrink(false)
        }
      }
    })
    setMealPlan(mealPlanData)
  }, [])

  const handlers = useSwipeable({
    onSwipedLeft: () => setCurrentIndex(prev => Math.min(prev + 1, 10)),
    onSwipedRight: () => setCurrentIndex(prev => Math.max(prev - 1, 0)),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true
  })

  return (
    <div className="meal-planner">
      <h1 className="main-title">Günlük Yemek Planı</h1>
      <div className="planner-container" {...handlers}>
        {mealPlan.length > 0 && (
          <DayComponent
            date={mealPlan[currentIndex].date}
            breakfast={mealPlan[currentIndex].breakfast}
            dinner={mealPlan[currentIndex].dinner}
          />
        )}
      </div>
      <div className="navigation-buttons">
        <button
          onClick={() => setCurrentIndex(prev => Math.max(prev - 1, 0))}
          disabled={currentIndex === 0}
          className="nav-button"
          aria-label="Önceki gün"
        >
          <ChevronLeft className="button-icon" />
        </button>
        <button
          onClick={() => setCurrentIndex(prev => Math.min(prev + 1, 10))}
          disabled={currentIndex === 10}
          className="nav-button"
          aria-label="Sonraki gün"
        >
          <ChevronRight className="button-icon" />
        </button>
      </div>
      <p className="date-indicator">
        {currentIndex < 5 ? `${5 - currentIndex} gün önce` :
         currentIndex > 5 ? `${currentIndex - 5} gün sonra` :
         "Bugün"}
      </p>
      <p className="developer-credit">
        Geliştirici: <a href="https://www.linkedin.com/in/batuhanslkmm/" target="_blank" rel="noopener noreferrer">Batuhan Salkım</a>
      </p>

      
    </div>
  )
}
