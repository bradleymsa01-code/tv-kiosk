import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import timingsData from "../timings.json";

// =============================
// DYNAMIC PRAYER TIMES LOGIC
// =============================
// Function to get current Ramadan day (you can modify this to match your logic)
const getCurrentRamadanDay = () => {
  // For now, return day 1. You can modify this to calculate based on current date
  // Example: const ramadanStartDate = new Date(2025, 1, 28); // Feb 28, 2025
  // const today = new Date();
  // const daysDiff = Math.floor((today - ramadanStartDate) / (1000 * 60 * 60 * 24)) + 1;
  // return Math.max(1, Math.min(30, daysDiff));
  return 12; // Current day for testing - change this or use date calculation
};

// Function to apply special rules and format times
const getPrayerTimesForDay = (ramadanDay) => {
  const dayData = timingsData.find(d => d.ramadanDay === ramadanDay) || timingsData[0];

  // Convert 24-hour format to 12-hour AM/PM format
  const formatTime = (time24, forcePM = false) => {
    const [hours, minutes] = time24.split(':').map(Number);
    const period = forcePM ? 'PM' : (hours >= 12 ? 'PM' : 'AM');
    const hours12 = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
    return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  // Add minutes to a time string (24-hour format)
  const addMinutes = (time24, minutesToAdd) => {
    const [hours, minutes] = time24.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes + minutesToAdd;
    const newHours = Math.floor(totalMinutes / 60) % 24;
    const newMinutes = totalMinutes % 60;
    return `${newHours}:${newMinutes.toString().padStart(2, '0')}`;
  };

  // Apply special rules
  const dhuhr = "1:30 PM"; // Always fixed
  const asr = ramadanDay <= 17 ? "4:30 PM" : "5:30 PM";
  const isha = ramadanDay <= 17 ? "7:40 PM" : "8:50 PM";

  // Fajr is always 10 minutes after Suhoor
  const fajr = formatTime(addMinutes(dayData.suhoor, 10));

  // Maghrib is always 10 minutes after Iftar (force PM)
  const maghrib = formatTime(addMinutes(dayData.iftar, 10), true);

  return {
    month: "Ramadan",
    date_range: `Day ${ramadanDay} • ${dayData.date}`,
    timings: {
      fajr: fajr,
      dhuhr: dhuhr,
      asr: asr,
      maghrib: maghrib,
      isha: isha,
      jummah: ["12:30 PM", "1:15 PM"],
      suhoor: formatTime(dayData.suhoor),
      iftar: formatTime(dayData.iftar, true), // Force PM for iftar
    },
  };
};

// Get prayer times based on current Ramadan day
const prayerTimesData = getPrayerTimesForDay(getCurrentRamadanDay());

const hadithData = [
  {
    narrator: "Abu Hurairah (رضي الله عنه)",
    intro: "Abu Hurairah narrated that the Messenger of Allah ﷺ said:",
    english:
      '“The Muslim is the brother of the Muslim: he does not cheat him, lie to him, nor deceive him...”',
    arabic:
      'حَدَّثَنَا عُبَيْدُ بْنُ أَسْبَاطِ ...',
    grade: "Hasan (Darussalam)",
    reference: "Jami` at-Tirmidhi 1927",
    inBook: "Book 27, Hadith 33",
    englishTranslation: "Vol. 4, Book 1, Hadith 1927",
  },
  {
    narrator: "Umar ibn al-Khattab (رضي الله عنه)",
    intro: "The Messenger of Allah ﷺ said:",
    english: "“Actions are only by intentions, and each person will have only what they intended.”",
    arabic: "إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ ...",
    grade: "Sahih",
    reference: "Sahih al-Bukhari 1; Sahih Muslim 1907",
    inBook: "Bukhari: Book 1, Hadith 1",
    englishTranslation: "Commonly cited as Hadith of Intentions",
  },
];

const announcementsData = [
  "Iftar & Dinner at Bradley MSA from Monday to Thursday",
  "Please maintain the cleanliness and sanctity of the masjid. Please ensure that you dispose of trash properly and leave the prayer area, and restrooms clean for others.",
  "Please do not park on private property or in restricted areas around the masjid. Kindly use only the designated parking spaces to respect our neighbors and avoid inconvenience."
];

// =============================
// GLOBAL CONSTANTS
// =============================
const SLIDE_DURATION = 10000; // 5 seconds

// Bradley Official Brand Color Palette
const colors = {
  bradleyRed: "#E11837",      // Primary - CMYK 0/100/80/5
  skyBlue: "#A2BDE0",         // CMYK 35/18/1/0
  darkRed: "#A50000",         // CMYK 0/100/80/35
  lightGrey: "#D2D3D4",       // CMYK 0/0/0/20
  mediumGrey: "#939598",      // CMYK 0/0/0/50
  darkGrey: "#5A5A5C",        // CMYK 0/0/0/80
};

// =============================
// MAIN APP (KIOSK MODE)
// =============================
export default function MosqueDisplayApp() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [timeLeft, setTimeLeft] = useState(5);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [hadithIndex, setHadithIndex] = useState(0);
  const [prevSlide, setPrevSlide] = useState(0);

const slides = useMemo(
  () => [
    <PrayerTimesSlide key="prayer" />,
    <HadithSlide key="hadith" hadith={hadithData[hadithIndex]} />,
    <AnnouncementSlide key="announcement" />,
  ],
  [hadithIndex]
);

  // Live Clock (Central Time)
  useEffect(() => {
    const clockInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(clockInterval);
  }, []);


  useEffect(() => {
    const handleKeyDown = async (event) => {
      if (
        event.key === "4" ||
        event.code === "Digit4" ||
        event.code === "Numpad4"
      ) {
        try {
          if (!document.fullscreenElement) {
            await document.documentElement.requestFullscreen();
          } else {
            await document.exitFullscreen();
          }
        } catch (err) {
          // Silently ignore fullscreen errors
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setCurrentSlide((s) => (s + 1) % slides.length);
          return 5;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [slides.length]);

// Rotate hadith when entering Hadith slide
  useEffect(() => {
    if (currentSlide === 1 && prevSlide !== 1) {
      setHadithIndex((i) => (i + 1) % hadithData.length);
    }

    setPrevSlide(currentSlide);
  }, [currentSlide, prevSlide]);

  const formattedTime = currentTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
    timeZone: "America/Chicago",
  });

  return (
    <div
      className="w-screen h-screen overflow-hidden relative"
      style={{
        background: `linear-gradient(135deg, ${colors.lightGrey}, #ffffff)`,
        fontFamily: "'Museo Sans', 'Lato', 'Open Sans', sans-serif",
      }}
    >
      {/* Mosque Silhouette Background */}
      <MosqueBackground />

      {/* Top Bar */}
      <div className="absolute top-0 left-0 w-full flex justify-between items-center px-10 py-6 z-10">
        <h1
          className="text-4xl font-bold uppercase tracking-tight"
          style={{
            color: colors.bradleyRed,
            fontFamily: "'Bebas Neue', 'Arial Narrow', sans-serif",
            letterSpacing: '-0.5px',
          }}
        >
          MSA Masjid
        </h1>

        <div className="text-3xl font-semibold" style={{
          color: colors.darkGrey,
          fontFamily: "'Museo Sans', 'Lato', sans-serif",
        }}>
          {formattedTime}
        </div>
      </div>

      {/* Slide Content */}
      <div className="w-full h-full flex items-start justify-center px-16 pt-24 pb-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full"
          >
            {slides[currentSlide]}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Progress Bar + Timer */}
      <div className="absolute bottom-0 left-0 w-full">
        <div
          className="h-2"
          style={{ backgroundColor: colors.mediumGrey }}
        >
          <motion.div
            key={currentSlide}
            initial={{ width: "100%" }}
            animate={{ width: "0%" }}
            transition={{ duration: 5, ease: "linear" }}
            className="h-2"
            style={{ backgroundColor: colors.bradleyRed }}
          />
        </div>

        <div className="text-center py-2 text-lg" style={{
          color: colors.darkGrey,
          fontFamily: "'Museo Sans', 'Lato', sans-serif",
        }}>
          Next Slide In: {timeLeft}s
        </div>
      </div>
    </div>
  );
}

// =============================
// SLIDE 1: PRAYER TIMES (Professional Design)
// =============================
function PrayerTimesSlide() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const { month, date_range, timings } = prayerTimesData;

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const prayerList = [
    { name: "Fajr", arabic: "الفجر", time: timings.fajr, icon: "/fajr.svg" },
    { name: "Dhuhr", arabic: "الظهر", time: timings.dhuhr, icon: "/zuhr.svg" },
    { name: "Asr", arabic: "العصر", time: timings.asr, icon: "/asr.svg" },
    { name: "Maghrib", arabic: "المغرب", time: timings.maghrib, icon: "/maghrib.svg" },
    { name: "Isha", arabic: "العشاء", time: timings.isha, icon: "/isha.svg" },
  ];

  // Calculate next prayer
  const getNextPrayer = () => {
    const now = currentTime;
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    for (let prayer of prayerList) {
      const [time, period] = prayer.time.split(' ');
      const [hours, minutes] = time.split(':').map(Number);
      let prayerHours = hours;
      if (period === 'PM' && hours !== 12) prayerHours += 12;
      if (period === 'AM' && hours === 12) prayerHours = 0;
      const prayerMinutes = prayerHours * 60 + minutes;

      if (prayerMinutes > currentMinutes) {
        const diff = prayerMinutes - currentMinutes;
        const hoursLeft = Math.floor(diff / 60);
        const minutesLeft = diff % 60;
        return { name: prayer.name, hours: hoursLeft, minutes: minutesLeft };
      }
    }

    // If no prayer left today, next is Fajr tomorrow
    const [time, period] = prayerList[0].time.split(' ');
    const [hours, minutes] = time.split(':').map(Number);
    let prayerHours = hours;
    if (period === 'PM' && hours !== 12) prayerHours += 12;
    if (period === 'AM' && hours === 12) prayerHours = 0;
    const prayerMinutes = prayerHours * 60 + minutes;
    const diff = (24 * 60 - currentMinutes) + prayerMinutes;
    const hoursLeft = Math.floor(diff / 60);
    const minutesLeft = diff % 60;
    return { name: prayerList[0].name, hours: hoursLeft, minutes: minutesLeft };
  };

  const nextPrayer = getNextPrayer();

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="text-center mb-2">
        <h2
          className="text-4xl mb-1 font-bold uppercase tracking-tight"
          style={{
            color: colors.bradleyRed,
            fontFamily: "'Bricolage Grotesque', 'Arial', sans-serif",
            letterSpacing: '-1px',
          }}
        >
          Daily Salat Timings
        </h2>
        <p
          className="text-xl mb-2"
          style={{
            color: colors.mediumGrey,
            fontFamily: "'Museo Sans', 'Lato', sans-serif",
            fontWeight: 300,
          }}
        >
          {month} • {date_range}
        </p>
      </div>

      {/* Next Prayer Banner - Centralized */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative mx-auto max-w-5xl mb-3 overflow-hidden"
        style={{
          borderRadius: '12px',
        }}
      >
        <div className="flex flex-col items-center justify-center">
          <p
            className="text-sm mb-1 uppercase tracking-wider"
            style={{
              color: colors.mediumGrey,
              fontWeight: 500,
              fontFamily: "'Museo Sans', 'Lato', sans-serif",
            }}
          >
            Next Prayer
          </p>

          <div className="flex items-center gap-6">
            <h3 className="text-5xl font-bold uppercase" style={{
              fontFamily: "'Bebas Neue', 'Arial Narrow', sans-serif",
              color: colors.bradleyRed,
            }}>
              {nextPrayer.name}
            </h3>

            <div className="flex items-center gap-2">
              <div className="text-center px-5 py-2" style={{
                backgroundColor: colors.lightGrey,
                borderRadius: '10px',
              }}>
                <div className="text-4xl font-bold" style={{
                  fontFamily: "'Museo Sans', 'Lato', sans-serif",
                  color: colors.bradleyRed,
                }}>
                  {String(nextPrayer.hours).padStart(2, '0')}
                </div>
                <div className="text-xs uppercase tracking-wide" style={{
                  color: colors.darkGrey,
                  fontFamily: "'Museo Sans', 'Lato', sans-serif",
                }}>
                  Hours
                </div>
              </div>
              <div className="text-3xl font-bold" style={{
                fontFamily: "'Museo Sans', 'Lato', sans-serif",
                color: colors.darkGrey,
              }}>:</div>
              <div className="text-center px-5 py-2" style={{
                backgroundColor: colors.lightGrey,
                borderRadius: '10px',
              }}>
                <div className="text-4xl font-bold" style={{
                  fontFamily: "'Museo Sans', 'Lato', sans-serif",
                  color: colors.bradleyRed,
                }}>
                  {String(nextPrayer.minutes).padStart(2, '0')}
                </div>
                <div className="text-xs uppercase tracking-wide" style={{
                  color: colors.darkGrey,
                  fontFamily: "'Museo Sans', 'Lato', sans-serif",
                }}>
                  Minutes
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Prayer Times Grid - Clean & Corporate */}
      <div className="grid grid-cols-5 gap-4 mb-3">
        {prayerList.map((prayer, index) => {
          const isNext = prayer.name === nextPrayer.name;
          return (
            <motion.div
              key={prayer.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.5 }}
              className="relative"
              style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '14px 16px',
                boxShadow: isNext
                  ? `0 6px 20px rgba(225, 24, 55, 0.2)`
                  : '0 3px 12px rgba(0, 0, 0, 0.08)',
                border: isNext ? `2px solid ${colors.bradleyRed}` : '2px solid transparent',
                transition: 'all 0.3s ease',
              }}
            >
              {/* Next Prayer Indicator */}
              {isNext && (
                <div
                  className="absolute top-3 right-3 px-2 py-1 text-xs font-bold uppercase tracking-wider"
                  style={{
                    backgroundColor: colors.bradleyRed,
                    color: 'white',
                    borderRadius: '4px',
                    fontFamily: "'Museo Sans', 'Lato', sans-serif",
                  }}
                >
                  Next
                </div>
              )}

              {/* SVG Icon */}
              <div className="flex justify-center mb-2">
                <img
                  src={prayer.icon}
                  alt={prayer.name}
                  style={{
                    width: '48px',
                    height: '48px',
                    opacity: isNext ? 1 : 0.7,
                  }}
                />
              </div>

              {/* Prayer Name */}
              <h3
                className="text-2xl font-bold text-center mb-1 uppercase"
                style={{
                  color: colors.darkGrey,
                  fontFamily: "'Bricolage Grotesque', 'Arial', sans-serif",
                }}
              >
                {prayer.name}
              </h3>

              {/* Arabic Name */}
              <p
                className="text-center mb-2 text-lg"
                style={{
                  color: colors.mediumGrey,
                  fontFamily: "'Lora', 'Cambria', serif",
                }}
              >
                {prayer.arabic}
              </p>

              {/* Time */}
              <p
                className="text-4xl font-bold text-center"
                style={{
                  color: colors.bradleyRed,
                  fontFamily: "'Museo Sans', 'Lato', sans-serif",
                }}
              >
                {prayer.time}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Additional Times - Professional Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="grid grid-cols-3 gap-4 max-w-4xl mx-auto"
      >
        <div
          className="p-4 text-center"
          style={{
            backgroundColor: 'white',
            borderRadius: '10px',
            boxShadow: '0 3px 12px rgba(0, 0, 0, 0.08)',
          }}
        >
          <p className="text-base mb-1 uppercase" style={{
            color: colors.mediumGrey,
            fontFamily: "'Museo Sans', 'Lato', sans-serif",
          }}>
            Jummah
          </p>
          <p className="text-xl font-bold" style={{
            color: colors.bradleyRed,
            fontFamily: "'Museo Sans', 'Lato', sans-serif",
          }}>
            {Array.isArray(timings.jummah) ? timings.jummah.join(" & ") : timings.jummah}
          </p>
        </div>
        <div
          className="p-4 text-center"
          style={{
            backgroundColor: 'white',
            borderRadius: '10px',
            boxShadow: '0 3px 12px rgba(0, 0, 0, 0.08)',
          }}
        >
          <p className="text-base mb-1 uppercase" style={{
            color: colors.mediumGrey,
            fontFamily: "'Museo Sans', 'Lato', sans-serif",
          }}>
            Suhoor Ends
          </p>
          <p className="text-xl font-bold" style={{
            color: colors.bradleyRed,
            fontFamily: "'Museo Sans', 'Lato', sans-serif",
          }}>
            {timings.suhoor}
          </p>
        </div>
        <div
          className="p-4 text-center"
          style={{
            backgroundColor: 'white',
            borderRadius: '10px',
            boxShadow: '0 3px 12px rgba(0, 0, 0, 0.08)',
          }}
        >
          <p className="text-base mb-1 uppercase" style={{
            color: colors.mediumGrey,
            fontFamily: "'Museo Sans', 'Lato', sans-serif",
          }}>
            Iftar Begins
          </p>
          <p className="text-xl font-bold" style={{
            color: colors.bradleyRed,
            fontFamily: "'Museo Sans', 'Lato', sans-serif",
          }}>
            {timings.iftar}
          </p>
        </div>
      </motion.div>
    </div>
  );
}

// =============================
// SLIDE 2: HADITH
// =============================
function useFitText({ minPx = 18, maxPx = 44, step = 2, deps = [] } = {}) {
  const ref = React.useRef(null);
  const [fontPx, setFontPx] = React.useState(maxPx);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let raf = 0;

    const fit = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        // Start from max and shrink until it fits
        let size = maxPx;
        el.style.fontSize = `${size}px`;

        // If content overflows the box, shrink
        while (size > minPx && el.scrollHeight > el.clientHeight) {
          size -= step;
          el.style.fontSize = `${size}px`;
        }

        setFontPx(size);
      });
    };

    fit();

    const ro = new ResizeObserver(fit);
    ro.observe(el);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { ref, fontPx };
}

function HadithSlide({ hadith }) {
  if (!hadith) return null;

  return (
    <div className="w-full max-w-7xl mx-auto px-6">
      {/* Title */}
      <h2
        className="text-4xl mb-4 font-bold text-center"
        style={{
          color: colors.bradleyRed,
          fontFamily: "'Bebas Neue', 'Arial Narrow', sans-serif",
          letterSpacing: '-1px',
        }}
      >
        Hadith of the Day
      </h2>

      {/* Narrator */}
      <p className="text-lg mb-6 text-center" style={{ color: colors.mediumGrey }}>
        <span className="font-semibold">{hadith.narrator}</span>
        {hadith.intro ? <span> — {hadith.intro}</span> : null}
      </p>

      {/* Two Columns */}
      <div className="grid grid-cols-2 gap-6 items-start">
        {/* ENGLISH */}
        <div className="rounded-xl shadow-md p-6" style={{ backgroundColor: "white" }}>
          <h3
            className="text-xl font-semibold mb-3"
            style={{ color: colors.darkGrey }}
          >
            English
          </h3>

          <p
            className="text-lg leading-relaxed"
            style={{ color: colors.darkGrey }}
          >
            {hadith.english}
          </p>
        </div>

        {/* ARABIC */}
        <div className="rounded-xl shadow-md p-6" style={{ backgroundColor: "white" }}>
          <h3
            className="text-xl font-semibold mb-3 text-right"
            style={{ color: colors.darkGrey }}
          >
            العربية
          </h3>

          <p
            className="text-xl leading-relaxed"
            dir="rtl"
            lang="ar"
            style={{
              color: colors.darkGrey,
              fontFamily: "'Amiri', 'Scheherazade New', serif",
            }}
          >
            {hadith.arabic}
          </p>
        </div>
      </div>

      {/* References */}
      <div
        className="mt-6 p-4 rounded-xl shadow-md text-sm"
        style={{ backgroundColor: "white", color: colors.darkGrey }}
      >
        <div className="grid grid-cols-2 gap-x-8 gap-y-2">
          <div>
            <span className="font-semibold" style={{ color: colors.mediumGrey }}>
              Grade:
            </span>{" "}
            {hadith.grade}
          </div>
          <div>
            <span className="font-semibold" style={{ color: colors.mediumGrey }}>
              Reference:
            </span>{" "}
            {hadith.reference}
          </div>
          <div>
            <span className="font-semibold" style={{ color: colors.mediumGrey }}>
              In-book:
            </span>{" "}
            {hadith.inBook}
          </div>
          <div>
            <span className="font-semibold" style={{ color: colors.mediumGrey }}>
              English translation:
            </span>{" "}
            {hadith.englishTranslation}
          </div>
        </div>
      </div>
    </div>
  );
}
// =============================
// SLIDE 3: ANNOUNCEMENTS
// =============================
function AnnouncementSlide() {
  return (
    <div className="w-full max-w-6xl mx-auto text-center">
      <h2
        className="text-5xl mb-6 font-bold uppercase tracking-tight"
        style={{
          color: colors.bradleyRed,
          fontFamily: "'Bebas Neue', 'Arial Narrow', sans-serif",
          letterSpacing: '-1px',
        }}
      >
        Announcements
      </h2>

      <div className="space-y-3">
        {announcementsData.map((announcement, index) => (
          <div
            key={index}
            className="p-4 rounded-2xl shadow-md text-2xl"
            style={{
              backgroundColor: "white",
              color: colors.darkGrey,
              fontFamily: "'Museo Sans', 'Lato', sans-serif",
            }}
          >
            {announcement}
          </div>
        ))}
      </div>
    </div>
  );
}

// =============================
// MOSQUE SVG BACKGROUND
// =============================
function MosqueBackground() {
  return (
    <div className="absolute inset-0 opacity-5 flex items-end justify-center pointer-events-none">
      <svg
        width="900"
        height="400"
        viewBox="0 0 900 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M100 350 Q200 200 300 350 T500 350 T700 350 T900 350"
          stroke="#5a5a5c"
          strokeWidth="8"
          fill="none"
        />
        <rect x="420" y="150" width="60" height="200" fill="#5a5a5c" />
        <circle cx="450" cy="140" r="40" fill="#5a5a5c" />
      </svg>
    </div>
  );
}
