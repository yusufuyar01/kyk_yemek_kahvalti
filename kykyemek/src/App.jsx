import PropTypes from 'prop-types';
import { useState, useEffect } from "react";
import { useSwipeable } from "react-swipeable";
import axios from 'axios';
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


const DayComponent = ({ data, animationClass, onLike, onDislike, likes, dislikes, isUniversity = false }) => {
  const today = new Date();
  const todayString = today.toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const mealDate = new Date(data.tarih.split('.').reverse().join('-'));
  const isDatePassed = mealDate <= today;

  // Üniversite verisi için farklı render
  if (isUniversity) {
    return (
      <div className={`day-component ${animationClass}`}>
        <h2 className="day-title">
          {data.gun}, {data.tarih}
        </h2>
        <div className="meal-section">
          <div className="meal-header">
            <h3 className="meal-title dinner">
              <Utensils className="meal-icon" />
              Öğle Yemeği
            </h3>
          </div>
          <p className="meal-text">{data.ogle || "Menü bilgisi bulunamadı"}</p>
        </div>
      </div>
    );
  }

  // KYK verisi için mevcut render
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
            <Utensils className="meal-icon" />
            Akşam Yemeği
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
    kahvalti: PropTypes.oneOfType([
      PropTypes.shape({
        corba: PropTypes.string.isRequired,
        ana_urun: PropTypes.string.isRequired,
        ana_urun2: PropTypes.string.isRequired,
        kahvaltilik: PropTypes.arrayOf(PropTypes.string),
        icecek: PropTypes.string.isRequired,
        ekmek: PropTypes.string.isRequired,
        su: PropTypes.string.isRequired
      }),
      PropTypes.string
    ]).isRequired,
    ogle_aksam: PropTypes.shape({
      corba: PropTypes.string.isRequired,
      ana_yemek: PropTypes.string.isRequired,
      yardimci_yemek: PropTypes.string.isRequired,
      ek: PropTypes.string.isRequired,
      ekmek: PropTypes.string.isRequired,
      su: PropTypes.string.isRequired
    }),
    ogle: PropTypes.string,
    aksam: PropTypes.string
  }).isRequired,
  animationClass: PropTypes.string.isRequired,
  onLike: PropTypes.func.isRequired,
  onDislike: PropTypes.func.isRequired,
  likes: PropTypes.object.isRequired,
  dislikes: PropTypes.object.isRequired,
  isUniversity: PropTypes.bool
};

export default function MobileMealPlanner() {
  const [mealPlan, setMealPlan] = useState([]);
  const [universityMeals, setUniversityMeals] = useState([]);
  const [universityCurrentIndex, setUniversityCurrentIndex] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [startIndex, setStartIndex] = useState(0);
  const [animationClass, setAnimationClass] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [likes, setLikes] = useState({});
  const [dislikes, setDislikes] = useState({});
  const [activeTab, setActiveTab] = useState('kyk'); // 'kyk' veya 'university'
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "dark");
    localStorage.setItem("theme", "dark");
  }, []);

  useEffect(() => {
    const loadRatings = async () => {
      try {
        const likesRef = ref(database, 'ratings/likes');
        const dislikesRef = ref(database, 'ratings/dislikes');
        
        onValue(likesRef, (snapshot) => {
          setLikes(snapshot.val() || {});
        });
        
        onValue(dislikesRef, (snapshot) => {
          setDislikes(snapshot.val() || {});
        });
      } catch (error) {
        console.error('Beğeni verileri yüklenemedi:', error);
      }
    };

    loadRatings();
  }, []);

  const handleLike = async (date, meal) => {
    try {
      const likesRef = ref(database, `ratings/likes/${date}/${meal}`);
      const dislikesRef = ref(database, `ratings/dislikes/${date}/${meal}`);
      
      const currentLikes = (likes[`${date}_${meal}`] || 0);
      const currentDislikes = (dislikes[`${date}_${meal}`] || 0);
      
      console.log(`Beğeni ekleniyor: ${date} - ${meal}`);
      await set(likesRef, currentLikes + 1);
      console.log('Beğeni başarıyla eklendi');
      
      if (currentDislikes > 0) {
        await set(dislikesRef, currentDislikes - 1);
        console.log('Dislike sayısı azaltıldı');
      }
    } catch (error) {
      console.error('Beğeni eklenirken hata:', error);
    }
  };

  const handleDislike = async (date, meal) => {
    try {
      const likesRef = ref(database, `ratings/likes/${date}/${meal}`);
      const dislikesRef = ref(database, `ratings/dislikes/${date}/${meal}`);
      
      const currentLikes = (likes[`${date}_${meal}`] || 0);
      const currentDislikes = (dislikes[`${date}_${meal}`] || 0);
      
      console.log(`Dislike ekleniyor: ${date} - ${meal}`);
      await set(dislikesRef, currentDislikes + 1);
      console.log('Dislike başarıyla eklendi');
      
      if (currentLikes > 0) {
        await set(likesRef, currentLikes - 1);
        console.log('Like sayısı azaltıldı');
      }
    } catch (error) {
      console.error('Beğenmeme eklenirken hata:', error);
    }
  };


  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setAlertMessage("");
  };

  useEffect(() => {
    fetch("/aralik.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error('Veri yüklenemedi');
        }
        return response.json();
      })
      .then((data) => {
        if (!data || !data.Ekim_2025 || !Array.isArray(data.Ekim_2025)) {
          throw new Error('Veri formatı geçersiz');
        }

        setMealPlan(data.Ekim_2025);
        
        // Tarih formatlama
        const today = new Date();
        const day = String(today.getDate()).padStart(2, '0');
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const year = today.getFullYear();
        const todayString = `${day}.${month}.${year}`;

        console.log("Bugünün tarihi:", todayString);
        console.log("Yüklenen veri sayısı:", data.Ekim_2025.length);
        console.log("İlk tarih:", data.Ekim_2025[0]?.tarih);
        console.log("Son tarih:", data.Ekim_2025[data.Ekim_2025.length - 1]?.tarih);

        const todayIndex = data.Ekim_2025.findIndex(
          (day) => day && day.tarih === todayString
        );

        const initialIndex = todayIndex >= 0 ? todayIndex : 0;
        setCurrentIndex(initialIndex);
        setStartIndex(initialIndex);
      })
      .catch((error) => {
        console.error("Yemek planı yüklenirken hata oluştu:", error);
        setMealPlan([]);
      });
  }, []);

  // Üniversite menülerini yükle
  useEffect(() => {
    fetch("/aralikveriler.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error('Üniversite verisi yüklenemedi');
        }
        return response.json();
      })
      .then((data) => {
        if (data.university_menus && Array.isArray(data.university_menus)) {
          setUniversityMeals(data.university_menus);
          
          // Bugünün tarihini bul
          const today = new Date();
          const todayString = today.toLocaleDateString("tr-TR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          });
          
          const todayIndex = data.university_menus.findIndex(
            (menu) => menu.tarih === todayString
          );
          
          const initialIndex = todayIndex >= 0 ? todayIndex : 0;
          setUniversityCurrentIndex(initialIndex);
        }
      })
      .catch((error) => {
        console.error("Üniversite menüleri yüklenirken hata:", error);
      });
  }, []);


  const handleNavigation = (direction) => {
    setAnimationClass(
      direction === "next" ? "slide-out-left" : "slide-out-right"
    );
    setTimeout(() => {
      if (activeTab === 'kyk') {
        setCurrentIndex((prev) => {
          const newIndex = direction === "next" ? prev + 1 : prev - 1;
          const maxForward = Math.min(startIndex + 5, mealPlan.length - 1);
          const maxBackward = Math.max(startIndex - 5, 0);
          if (newIndex > maxForward) {
            setAlertMessage("En fazla 5 gün sonraki yemeği görebilirsiniz.");
            return prev;
          } else if (newIndex < maxBackward) {
            setAlertMessage("En fazla 5 gün önceki yemeği görebilirsiniz.");
            return prev;
          }
          setAlertMessage("");
          return newIndex;
        });
      } else if (activeTab === 'university') {
        setUniversityCurrentIndex((prev) => {
          const newIndex = direction === "next" ? prev + 1 : prev - 1;
          if (newIndex < 0) {
            setAlertMessage("İlk menüye ulaştınız.");
            return prev;
          } else if (newIndex >= universityMeals.length) {
            setAlertMessage("Son menüye ulaştınız.");
            return prev;
          }
          setAlertMessage("");
          return newIndex;
        });
      }
      setAnimationClass(
        direction === "next" ? "slide-in-right" : "slide-in-left"
      );
    }, 300);
  };
  const handlers = useSwipeable({
    onSwipedLeft: () => handleNavigation("next"),
    onSwipedRight: () => handleNavigation("prev"),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  useEffect(() => {
    const initializeFirebase = async () => {
      try {
        await userTracker.incrementActiveUsers();
        await userTracker.incrementTotalVisits();
      } catch (error) {
        console.error('Firebase işlemleri başlatılamadı:', error);
      }
    };

    initializeFirebase();

    return () => {
      userTracker.decrementActiveUsers().catch(error => {
        console.error('Aktif kullanıcı sayısı azaltılamadı:', error);
      });
    };
  }, []);

  return (
    <div className="meal-planner">
      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button
          className={`tab-button ${activeTab === 'kyk' ? 'active' : ''}`}
          onClick={() => handleTabChange('kyk')}
        >
          KYK
        </button>
        <button
          className={`tab-button ${activeTab === 'university' ? 'active' : ''}`}
          onClick={() => handleTabChange('university')}
        >
          Üniversite
        </button>
      </div>

      <div className="planner-container" {...handlers}>
        {activeTab === 'kyk' ? (
          // KYK Menüsü
          Array.isArray(mealPlan) && mealPlan.length > 0 && currentIndex >= 0 && mealPlan[currentIndex] ? (
            <>
              <DayComponent
                data={mealPlan[currentIndex]}
                animationClass={animationClass}
                onLike={handleLike}
                onDislike={handleDislike}
                likes={likes}
                dislikes={dislikes}
                isUniversity={false}
              />
              {alertMessage && (
                <div className="alert-message">
                  <p>{alertMessage}</p>
                </div>
              )}
            </>
          ) : (
            <div className="error-message">
              <p>Yemek planı yüklenemedi. Lütfen daha sonra tekrar deneyiniz.</p>
            </div>
          )
        ) : (
          // Üniversite Menüsü
          universityMeals.length > 0 && universityCurrentIndex >= 0 && universityMeals[universityCurrentIndex] ? (
            <DayComponent
              data={universityMeals[universityCurrentIndex]}
              animationClass={animationClass}
              onLike={handleLike}
              onDislike={handleDislike}
              likes={likes}
              dislikes={dislikes}
              isUniversity={true}
            />
          ) : (
            <div className="error-message">
              <p>Üniversite menüsü yüklenemedi. Lütfen daha sonra tekrar deneyiniz.</p>
            </div>
          )
        )}
        
        {alertMessage && activeTab === 'university' && (
          <div className="alert-message">
            <p>{alertMessage}</p>
          </div>
        )}
      </div>

      {/* Navigation buttons - her iki tab için de göster */}
      <div className="navigation-buttons">
        <button
          className="nav-button"
          onClick={() => handleNavigation("prev")}
          disabled={
            activeTab === 'kyk' 
              ? currentIndex <= Math.max(startIndex - 5, 0)
              : universityCurrentIndex <= 0
          }
        >
          <ChevronLeft className="button-icon" />
          Önceki
        </button>
        <button
          className="nav-button"
          onClick={() => handleNavigation("next")}
          disabled={
            activeTab === 'kyk' 
              ? currentIndex >= Math.min(startIndex + 5, mealPlan.length - 1)
              : universityCurrentIndex >= universityMeals.length - 1
          }
        >
          Sonraki
          <ChevronRight className="button-icon" />
        </button>
      </div>

      <div className="developer-credit">
        Developed by{" "}
        <a href="https://www.linkedin.com/in/batuhanslkmm/" target="_blank" rel="noopener noreferrer">
          Batuhan Salkım
        </a>
        {" , "}
        <a href="https://www.linkedin.com/in/ahmetcaliskann/" target="_blank" rel="noopener noreferrer">
          Ahmet Çalışkan
        </a>
       {" & "}
        <a href="https://www.linkedin.com/in/yusuf-uyr/" target="_blank" rel="noopener noreferrer">
          Yusuf Uyar
        </a>
      </div>
    </div>
  );
}


// export default function MobileMealPlanner() {
//   return (
//     <div style={{
//       display: 'flex',
//       flexDirection: 'column',
//       alignItems: 'center',
//       justifyContent: 'center',
//       minHeight: '100vh',
//       minWidth: '100vw',
//       margin: 0,
//       padding: 0,
//       position: 'fixed',
//       top: 0,
//       left: 0,
//       right: 0,
//       bottom: 0,
//       backgroundColor: '#1a1a1a',
//       color: '#ffffff'
//     }}>
//       <div style={{
//         backgroundColor: '#f8d7da',
//         color: '#721c24',
//         padding: '1.5rem',
//         borderRadius: '12px',
//         width: '85%',
//         maxWidth: '400px',
//         margin: '0 auto',
//         fontWeight: 'bold',
//         fontSize: 'clamp(1.2rem, 4vw, 1.8rem)',
//         boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
//         textAlign: 'center',
//         lineHeight: '1.4'
//       }}>
//         Hayırlı Ramazanlar!<br />Site Bakımda
//       </div>
//     </div>
//   );
// }
