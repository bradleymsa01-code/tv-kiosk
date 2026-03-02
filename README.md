# Bradley University MSA Display

A fullscreen kiosk display for prayer times, hadiths, and announcements.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Run development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Configuration

Edit the data objects at the top of `src/App.jsx`:
- `prayerTimesData` - Prayer times and dates
- `hadithData` - Daily hadith
- `announcementsData` - MSA announcements

## Running in Kiosk Mode

Press F11 in your browser to enter fullscreen mode.
