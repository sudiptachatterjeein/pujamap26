/* Puja Map 2026 - site settings. Everything here is PUBLIC (it ships to the browser). Never put secret keys here. */
window.PUJA_CONFIG = {
  // Supabase (public anon key only)
  SUPABASE_URL: "https://obrtopvixqemwhvzadda.supabase.co",
  SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9icnRvcHZpeHFlbXdodnphZGRhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA3NDIxNTEsImV4cCI6MjEwNjMxODE1MX0.YC39Z36MBaQ2twujKKIcU3otvmYLbF_h1mV7pxTTKAA",

  // Mahalaya live audio: paste the authorized MP3/AAC/HLS stream URL here before 10 Oct 2026
  MAHALAYA_STREAM_URL: "",
  MAHALAYA_START: "2026-10-10T04:00:00+05:30",

  // Support / donate (UPI)
  UPI_ID: "sudiptachatterjee99@ybl",
  UPI_NAME: "Sudipta Chatterjee",
  UPI_NOTE: "Durga Puja Map support",

  // Live weather (Open-Meteo, free, no key). Kolkata centre.
  WEATHER_LAT: 22.5726,
  WEATHER_LON: 88.3639,

  // Optional AI planner (Vercel function /api/concierge, needs ANTHROPIC_API_KEY on Vercel). Set "" to hide.
  AI_ENDPOINT: "/api/concierge"
};
