import React, { useState, useEffect } from 'react';
import { useSwipeable } from 'react-swipeable';
import { ChevronLeft, ChevronRight, Coffee, Utensils, Sun, Moon } from 'lucide-react';
import './MobileMealPlanner.css';

//Burada verileri çekiyorum 
const DayComponent = ({ data, animationClass }) => ( //animationClass burada öğelerin geçiş animasyonlarını yönetmek için kullanılan bir durumdur. Bu geçişler, kullanıcı "Önceki" veya "Sonraki" butonlarına tıkladığında veya kaydırma hareketi yaptığında etkinleşir.
  <div className={`day-component ${animationClass}`}>
    <h2 className="day-title">{data.gun}, {data.tarih}</h2>
    <div className="meal-section">
      <h3 className="meal-title breakfast">
        <Coffee className="meal-icon" /> Kahvaltı
      </h3>
      <p className="meal-text">{data.kahvalti.ana_urun}</p>
      <p className="meal-text">{data.kahvalti.ana_urun2}</p>
      <p className="meal-text">{data.kahvalti.kahvaltilik.join(', ')}</p>
      <p className="drink-text">{data.kahvalti.icecek}</p>
      <p className="meal-text">{data.kahvalti.ekmek}, {data.kahvalti.su}</p>
    </div>
    <div className="meal-section">
      <h3 className="meal-title dinner">
        <Utensils className="meal-icon" />Akşam Yemeği
      </h3>
      <p className="meal-text">{data.ogle_aksam.corba}</p>
      <p className="meal-text">{data.ogle_aksam.ana_yemek}</p>
      <p className="meal-text">{data.ogle_aksam.yardimci_yemek}</p>
      <p className="meal-text">{data.ogle_aksam.ek}</p>
      <p className="meal-text">{data.ogle_aksam.ekmek}, {data.ogle_aksam.su}</p>
    </div>
  </div>
);

export default function MobileMealPlanner() {
  const [mealPlan, setMealPlan] = useState([]); //bu, yemek planını (günlere göre kahvaltı ve akşam yemeği bilgilerini) depolamak için kullanılır, mealPlan, yemek verileri API veya JSON dosyasından çekildikten sonra bu veriyle güncellenir. setMealPlan fonksiyonu, mealPlan'i güncellemek için kullanılır.

  const [currentIndex, setCurrentIndex] = useState(0); //Kullanıcının şu anda hangi günü görüntülediğini belirtir, currentIndex kullanıcının yemek planında gezindiği günlerin kontrol edilmesini sağlar. setCurrentIndex, currentIndex'i güncellemek için kullanılır; böylece kullanıcı ileri veya geri gittiğinde görüntülenen gün güncellenir.
  
  const [startIndex, setStartIndex] = useState(0); //Uygulama açıldığında o günün tarihiyle başlayan bir referans indeksi saklar.0 (ilk gün). Bu değer daha sonra kullanıcının cihazındaki tarihe göre güncellenir.
  
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark' || localStorage.getItem('theme') === null;
  }); //Kullanıcının tema seçimini (koyu veya açık) saklar, localStorage'dan alınır, eğer localStorage'da tema kaydedilmemişse varsayılan olarak dark (koyu) tema seçilir.
  
  const [animationClass, setAnimationClass] = useState(''); //Geçiş animasyonlarını kontrol eder. Boş bir dize (''), yani başlangıçta animasyon uygulanmaz.  Kullanıcı önceki veya sonraki güne geçtiğinde, animasyon sınıfı (slide-in-left, slide-in-right, slide-out-left, slide-out-right) bu durum ile güncellenir. setAnimationClass, animasyon sınıfını güncellemek için kullanılır, böylece kullanıcı geçiş sırasında animasyonları görebilir. Bunlar css de tanımlı tabi.
  
  const [alertMessage, setAlertMessage] = useState(''); //Kullanıcı, yemek planında sınırların dışına çıktığında bir uyarı mesajı saklar. Kullanıcı yemek planında bugünden itibaren 5 gün ileriye veya 5 gün geriye geçtiğinde, uyarı mesajı görüntülenir. setAlertMessage, bu mesajı güncellemek için kullanılır.


  // Tema değişikliğini izler ve sayfanın temasını günceller. isDarkMode değiştiğinde tetiklenir ve data-theme özelliğini günceller. Ayrıca, kullanıcının tercih ettiği temayı localStorage'a kaydeder, böylece uygulama tekrar açıldığında aynı tema korunur.
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);


  //Bu useEffect, /kasimveriler.json dosyasından yemek verilerini alır ve uygulama açıldığında veya ilk yüklendiğinde mealPlan durumunu günceller. Aynı zamanda, kullanıcının cihazındaki tarih bilgisine göre başlangıç gününü belirler.
  useEffect(() => {
    fetch('/kasimveriler.json')
      .then(response => response.json())
      .then(data => {
        setMealPlan(data.kasim_2024);

        const today = new Date();
        const todayString = today.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' });

        const todayIndex = data.kasim_2024.findIndex(day => day.tarih === todayString);
        const initialIndex = todayIndex >= 0 ? todayIndex : 0;
        setCurrentIndex(initialIndex);
        setStartIndex(initialIndex);
      })
      .catch(error => console.error('Error fetching meal plan:', error));
  }, []);

  //Kullanıcı ileri (next) veya geri (prev) gitmek istediğinde, uygun çıkış animasyonunu (slide-out-left veya slide-out-right) tetikler. Bu sınıflar, CSS dosyasında tanımlanan kaydırma efektlerini sağlar.
  const handleNavigation = (direction) => {
    setAnimationClass(direction === 'next' ? 'slide-out-left' : 'slide-out-right');
    //Bu setTimeout, animasyonun tamamlanması için kısa bir bekleme süresi (300 ms) oluşturur. Bu süre dolduğunda, currentIndex (günlerin dizindeki mevcut konum) güncellenir ve uygun giriş animasyonu (slide-in-right veya slide-in-left) başlatılır. Bu, yeni günün ekranda görünmesini sağlar.
    setTimeout(() => {
      setCurrentIndex((prev) => {
        const newIndex = direction === 'next' ? prev + 1 : prev - 1; //İleri gidiliyorsa currentIndex değeri 1 artırılır (prev + 1), geri gidiliyorsa 1 azaltılır (prev - 1). 

        //Kullanıcının yalnızca 5 gün ileriye ve 5 gün geriye gitmesine izin verilir. maxForward, ileri gidilebilecek en yüksek gün indeksini, maxBackward ise geri gidilebilecek en düşük indeks sınırını temsil eder.
        const maxForward = Math.min(startIndex + 5, mealPlan.length - 1);
        const maxBackward = Math.max(startIndex - 5, 0);

        if (newIndex > maxForward) {
          setAlertMessage("En fazla 5 gün sonraki yemeği görebilirsiniz.");
          return prev;
        } else if (newIndex < maxBackward) {
          setAlertMessage("En fazla 5 gün önceki yemeği görebilirsiniz.");
          return prev;
        }

        setAlertMessage('');
        return newIndex;
      });
      setAnimationClass(direction === 'next' ? 'slide-in-right' : 'slide-in-left');
    }, 300);
  };

  const handlers = useSwipeable({ //Bu hook, kullanıcı kaydırma hareketlerini algılayarak handleNavigation fonksiyonunu tetikler. Bu özellik özellikle mobil cihazlarda kullanıcı deneyimini artırır.
    onSwipedLeft: () => handleNavigation('next'),
    onSwipedRight: () => handleNavigation('prev'),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  return (
    <div className="meal-planner">
     {/* theme-toggle div'i, koyu ve açık temalar arasında geçiş yapmayı sağlar, Kullanıcı tıklama yaptığında setIsDarkMode(!isDarkMode) ifadesi çalışır. isDarkMode boolean değerini tersine çevirir ve tema durumunu değiştirir. */}
      <div className="theme-toggle" onClick={() => setIsDarkMode(!isDarkMode)}> 
        
        {isDarkMode ? <Sun className="theme-toggle-icon" /> : <Moon className="theme-toggle-icon" />}
      </div>

      {/* Bu kısım yemek planı listesindeki mevcut günün yemek bilgilerini gösterir. DayComponent isimli alt bileşen, yemek bilgilerini gün bazında ekrana getirir, handlers adında bir özellik {...handlers} kullanılarak kaydırma hareketlerini algılamak için useSwipeable hook'unu etkinleştirir. Kullanıcı, bu alan içinde sağa veya sola kaydırarak günler arasında gezinebilir.*/}
      <div className="planner-container" {...handlers}>
        {mealPlan.length > 0 && (
          // mealPlan.length > 0 koşulu, mealPlan listesinin boş olup olmadığını kontrol eder. Liste boş değilse DayComponent render edilir. currentIndex ile o an gösterilen gün belirlenir, animationClass ile ise geçiş animasyonu uygulanır.
          <DayComponent
            data={mealPlan[currentIndex]} 
            animationClass={animationClass}
          />
        )}
      </div>
{/* Kullanıcı, uygulamanın izin verdiği 5 gün sınırını aşmaya çalışırsa (örneğin, ileri veya geri 5 günden fazla gitmeye çalışırsa) bir uyarı mesajı gösterir. */}
      {alertMessage && (
        <div className="alert-message">
          <p>{alertMessage}</p>
        </div>
      )}


{/* Kullanıcı, bu butonları kullanarak bir önceki veya sonraki güne geçiş yapabilir. */}
      <div className="navigation-buttons">
        <button
          className="nav-button"
          // Sol butona tıklanıldığında bir önceki güne geçiş yapılır.
          onClick={() => handleNavigation('prev')} 
          disabled={currentIndex <= Math.max(startIndex - 5, 0)}
        >
          <ChevronLeft className="button-icon" />
          Önceki
        </button>
        <button
          className="nav-button"
          onClick={() => handleNavigation('next')}
          // disabled Özelliği: Butonların disabled durumu, kullanıcının gezinme sınırlarını aşmaması için ayarlanır. Örneğin, kullanıcı 5 gün geriye gidemez veya 5 gün ileriye geçemez. Bu sınır, Math.max ve Math.min kullanılarak hesaplanır.
          disabled={currentIndex >= Math.min(startIndex + 5, mealPlan.length - 1)}
        >
          Sonraki
          <ChevronRight className="button-icon" />
        </button>
      </div>
      <div className="developer-credit">
  <p>Developed by <a target="_blank" href="https://www.linkedin.com/in/batuhanslkmm/">Batuhan Salkım</a>, <a target="_blank" href="https://www.linkedin.com/in/ahmetcaliskann/">Ahmet Çalışkan</a></p>
</div>
    </div>
  );
}
