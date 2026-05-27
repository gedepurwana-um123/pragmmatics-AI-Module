import React, { useState, useEffect } from 'react';
import { MapPin, Cloud, Sun, CloudRain, Wind, Thermometer } from 'lucide-react';

const weatherIcons = {
  clear: Sun,
  clouds: Cloud,
  rain: CloudRain,
  drizzle: CloudRain,
  default: Sun,
};

export default function InfoWidget() {
  const [now, setNow] = useState(new Date());
  const [location, setLocation] = useState('Mendeteksi lokasi...');
  const [weather, setWeather] = useState(null);

  // Clock ticker
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // Geolocation + weather via open-meteo (no API key needed)
  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation('Indonesia');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        // Reverse geocode via nominatim
        try {
          const geo = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const geoData = await geo.json();
          const city =
            geoData.address?.city ||
            geoData.address?.town ||
            geoData.address?.village ||
            geoData.address?.county ||
            'Lokasi Anda';
          setLocation(city);
        } catch {
          setLocation('Indonesia');
        }

        // Weather via open-meteo
        try {
          const wx = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weathercode,windspeed_10m&timezone=auto`
          );
          const wxData = await wx.json();
          const code = wxData.current?.weathercode ?? 0;
          const temp = Math.round(wxData.current?.temperature_2m ?? 0);
          const wind = Math.round(wxData.current?.windspeed_10m ?? 0);
          // WMO code simple mapping
          let condition = 'clear';
          if (code >= 51 && code <= 67) condition = 'rain';
          else if (code >= 71 && code <= 77) condition = 'rain';
          else if (code >= 80 && code <= 82) condition = 'drizzle';
          else if (code >= 1 && code <= 3) condition = 'clouds';
          setWeather({ temp, condition, wind });
        } catch {
          setWeather(null);
        }
      },
      () => {
        setLocation('Indonesia');
      },
      { timeout: 6000 }
    );
  }, []);

  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  const dayName = days[now.getDay()];
  const date = now.getDate();
  const month = months[now.getMonth()];
  const year = now.getFullYear();
  const time = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  const WeatherIcon = weather ? (weatherIcons[weather.condition] || weatherIcons.default) : Sun;

  return (
    <div className="flex items-center gap-3 flex-wrap">
      {/* Date & time */}
      <div className="flex items-center gap-2 bg-white/80 backdrop-blur border border-indigo-100 shadow-sm rounded-xl px-3 py-1.5">
        <div className="text-right">
          <div className="text-xs font-semibold text-foreground">{dayName}, {date} {month} {year}</div>
          <div className="text-xs text-primary font-mono font-bold">{time}</div>
        </div>
      </div>

      {/* Location */}
      <div className="flex items-center gap-1.5 bg-white/80 backdrop-blur border border-indigo-100 shadow-sm rounded-xl px-3 py-1.5">
        <MapPin className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />
        <span className="text-xs font-medium text-foreground max-w-[120px] truncate">{location}</span>
      </div>

      {/* Weather */}
      {weather && (
        <div className="flex items-center gap-1.5 bg-white/80 backdrop-blur border border-indigo-100 shadow-sm rounded-xl px-3 py-1.5">
          <WeatherIcon className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
          <span className="text-xs font-medium text-foreground">{weather.temp}°C</span>
          <span className="text-xs text-muted-foreground hidden sm:inline">· {weather.wind} km/h</span>
        </div>
      )}
    </div>
  );
}