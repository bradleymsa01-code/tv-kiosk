import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// =============================
// CONFIG JSON (Editable by MSA)
// =============================
const prayerTimesData = {
  month: "Ramadan",
  date_range: "March 1 - March 30",
  timings: {
    fajr: "5:20 AM",
    dhuhr: "1:30 PM",
    asr: "4:30 PM",
    maghrib: "6:03 PM",
    isha: "7:40 PM",
    jummah: ["12:30 PM", "1:15 PM"],
    suhoor: "5:22 AM",
    iftar: "5:53 PM",
  },
};

const hadithData = {
  text: "The best among you are those who have the best manners and character.",
  source: "Sahih Bukhari",
};

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

  const slides = useMemo(
    () => [
      <PrayerTimesSlide key="prayer" />,
      <HadithSlide key="hadith" />,
      <AnnouncementSlide key="announcement" />,
    ],
    []
  );

  // Live Clock (Central Time)
  useEffect(() => {
    const clockInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(clockInterval);
  }, []);

  // Slide Rotation Timer
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
          Bradley University MSA
        </h1>

        <div className="text-3xl font-semibold" style={{
          color: colors.darkGrey,
          fontFamily: "'Museo Sans', 'Lato', sans-serif",
        }}>
          {formattedTime}
        </div>
      </div>

      {/* Slide Content */}
      <div className="w-full h-full flex items-center justify-center px-16">
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
      <div className="text-center mb-4">
        <h2
          className="text-5xl mb-1 font-bold uppercase tracking-tight"
          style={{
            color: colors.bradleyRed,
            fontFamily: "'Bricolage Grotesque', 'Arial', sans-serif",
            letterSpacing: '-1px',
          }}
        >
          Daily Salat Timings
        </h2>
        <p
          className="text-xl mb-4"
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
        className="relative mx-auto max-w-5xl mb-6 overflow-hidden"
        style={{
          borderRadius: '12px',
        }}
      >
        <div className="flex flex-col items-center justify-center">
          <p
            className="text-sm mb-3 uppercase tracking-wider"
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
      <div className="grid grid-cols-5 gap-4 mb-6">
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
                padding: '20px 16px',
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
              <div className="flex justify-center mb-3">
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
                className="text-center mb-3 text-lg"
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
function HadithSlide() {
  return (
    <div className="max-w-5xl text-center">
      <h2
        className="text-6xl mb-12 font-bold uppercase tracking-tight"
        style={{
          color: colors.bradleyRed,
          fontFamily: "'Bebas Neue', 'Arial Narrow', sans-serif",
          letterSpacing: '-1px',
        }}
      >
        Hadith of the Day
      </h2>

      <p
        className="text-4xl leading-relaxed mb-10"
        style={{
          color: colors.darkGrey,
          fontFamily: "'Lora', 'Cambria', serif",
          lineHeight: '1.6',
        }}
      >
        "{hadithData.text}"
      </p>

      <p
        className="text-2xl"
        style={{
          color: colors.mediumGrey,
          fontFamily: "'Museo Sans', 'Lato', sans-serif",
          fontWeight: 300,
        }}
      >
        — {hadithData.source}
      </p>
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
        className="text-6xl mb-12 font-bold uppercase tracking-tight"
        style={{
          color: colors.bradleyRed,
          fontFamily: "'Bebas Neue', 'Arial Narrow', sans-serif",
          letterSpacing: '-1px',
        }}
      >
        Announcements
      </h2>

      <div className="space-y-6">
        {announcementsData.map((announcement, index) => (
          <div
            key={index}
            className="p-6 rounded-2xl shadow-md text-3xl"
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
