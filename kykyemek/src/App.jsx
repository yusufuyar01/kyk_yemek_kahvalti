/*
import PropTypes from 'prop-types';
import { useState, useEffect } from "react";
import { useSwipeable } from "react-swipeable";
import {
  ChevronLeft,
  ChevronRight,
  Coffee,
  Utensils,
  ThumbsUp,
  ThumbsDown
} from "lucide-react";
import "./MobileMealPlanner.css";
import { userTracker } from './firebase/userTracker';
import { database } from './firebase/config';
import { ref, set, onValue } from 'firebase/database';

// DayComponent Bileşeni
const DayComponent = ({ data, animationClass, onLike, onDislike, likes, dislikes }) => {
  const today = new Date();
  const todayString = today.toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const mealDate = new Date(data.tarih.split('.').reverse().join('-'));
  const isDatePassed = mealDate <= today;

  return (
    <div className={`day-component ${animationClass}`}>
      <h2 className="day-title">
        {data.gun}, {data.tarih}
      </h2>
      <div className="meal-section">
        <div className="meal-header">
          <h3 className="meal-title breakfast">
            <Coffee className="meal-icon" /> Kahvaltı
          </h3>
        </div>
        <p className="meal-text">{data.kahvalti.ana_urun}</p>
        <p className="meal-text">{data.kahvalti.ana_urun2}</p>
        <p className="meal-text">
          {Array.isArray(data.kahvalti.kahvaltilik)
            ? data.kahvalti.kahvaltilik.join(", ")
            : ""}
        </p>
        <p className="drink-text">{data.kahvalti.icecek}</p>
        <p className="meal-text">
          {data.kahvalti.ekmek}, {data.kahvalti.su}
        </p>
      </div>
      <div className="meal-section">
        <div className="meal-header">
          <h3 className="meal-title dinner">
            <Utensils className="meal-icon" /> Akşam Yemeği
          </h3>
        </div>
        <p className="meal-text">{data.ogle_aksam.corba}</p>
        <p className="meal-text">{data.ogle_aksam.ana_yemek}</p>
        <p className="meal-text">{data.ogle_aksam.yardimci_yemek}</p>
        <p className="meal-text">{data.ogle_aksam.ek}</p>
        <p className="meal-text">
          {data.ogle_aksam.ekmek}, {data.ogle_aksam.su}
        </p>
      </div>
    </div>
  );
};

DayComponent.propTypes = {
  data: PropTypes.shape({
    gun: PropTypes.string.isRequired,
    tarih: PropTypes.string.isRequired,
    kahvalti: PropTypes.shape({
      ana_urun:...
*/

import React from 'react';

const MaintenancePage = () => {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#f4f4f4',
      fontSize: '2rem',
      fontWeight: 'bold'
    }}>
      Site Bakımda
    </div>
  );
};

export default MaintenancePage;
