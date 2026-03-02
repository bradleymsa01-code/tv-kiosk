import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// =============================
// CONFIG JSON (Editable by MSA)
// =============================
const prayerTimesData = {
  month: "Ramadan",
  date_range: "March 1 - March 30",
  timings: {
    fajr: "5:12 AM",
    dhuhr: "12:15 PM",
    asr: "3:45 PM",
    maghrib: "6:01 PM",
    isha: "7:30 PM",
    jummah: ["1:15 PM", "2:15 PM"],
    suhoor: "4:45 AM",
    iftar: "6:01 PM",
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

// Bradley MSA Color Palette
const colors = {
  red: "#e11837",
  skyblue: "#a2bde0",
  lightGrey: "#D2D3D4",
  mediumGrey: "#939598",
  darkGrey: "#5a5a5c",
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
        fontFamily: "'Musio Sans', 'Open Sans', sans-serif",
      }}
    >
      {/* Mosque Silhouette Background */}
      <MosqueBackground />

      {/* Top Bar */}
      <div className="absolute top-0 left-0 w-full flex justify-between items-center px-10 py-6 z-10">
        <h1
          className="text-4xl font-bold"
          style={{
            color: colors.red,
            fontFamily: "'Capra Neue', 'Poppins', sans-serif",
          }}
        >
          Bradley University MSA
        </h1>

        <div className="text-3xl font-semibold" style={{ color: colors.darkGrey }}>
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
            style={{ backgroundColor: colors.red }}
          />
        </div>

        <div className="text-center py-2 text-lg" style={{ color: colors.darkGrey }}>
          Next Slide In: {timeLeft}s
        </div>
      </div>
    </div>
  );
}

// =============================
// SLIDE 1: PRAYER TIMES
// =============================
function PrayerTimesSlide() {
  const { month, date_range, timings } = prayerTimesData;

  const prayerList = [
    { name: "Fajr", time: timings.fajr },
    { name: "Dhuhr", time: timings.dhuhr },
    { name: "Asr", time: timings.asr },
    { name: "Maghrib", time: timings.maghrib },
    { name: "Isha", time: timings.isha },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto text-center">
      <h2
        className="text-6xl mb-4 font-bold"
        style={{
          color: colors.red,
          fontFamily: "'Capra Neue', 'Poppins', sans-serif",
        }}
      >
        Daily Salat Timings
      </h2>

      <p
        className="text-2xl mb-10"
        style={{
          color: colors.mediumGrey,
          fontFamily: "'Bricolage Grotesque', 'Inter', sans-serif",
        }}
      >
        {month} • {date_range}
      </p>

      <div className="grid grid-cols-5 gap-6 mb-10">
        {prayerList.map((prayer) => (
          <div
            key={prayer.name}
            className="rounded-2xl p-8 shadow-lg"
            style={{ backgroundColor: "white" }}
          >
            <h3 className="text-3xl mb-3" style={{ color: colors.darkGrey }}>
              {prayer.name}
            </h3>
            <p className="text-4xl font-bold" style={{ color: colors.red }}>
              {prayer.time}
            </p>
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-12 text-3xl">
        <div>
          <span style={{ color: colors.darkGrey }}>Jummah:</span>{" "}
          <span style={{ color: colors.red }}>
            {timings.jummah.join(" & ")}
          </span>
        </div>
        <div>
          <span style={{ color: colors.darkGrey }}>Suhoor:</span>{" "}
          <span style={{ color: colors.red }}>{timings.suhoor}</span>
        </div>
        <div>
          <span style={{ color: colors.darkGrey }}>Iftar:</span>{" "}
          <span style={{ color: colors.red }}>{timings.iftar}</span>
        </div>
      </div>
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
        className="text-6xl mb-12 font-bold"
        style={{
          color: colors.red,
          fontFamily: "'Capra Neue', 'Poppins', sans-serif",
        }}
      >
        Hadith of the Day
      </h2>

      <p
        className="text-4xl leading-relaxed mb-10"
        style={{ color: colors.darkGrey }}
      >
        "{hadithData.text}"
      </p>

      <p
        className="text-2xl"
        style={{
          color: colors.mediumGrey,
          fontFamily: "'Bricolage Grotesque', 'Inter', sans-serif",
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
        className="text-6xl mb-12 font-bold"
        style={{
          color: colors.red,
          fontFamily: "'Capra Neue', 'Poppins', sans-serif",
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
