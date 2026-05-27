import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Cloud, Sun, CloudRain, Smile, Meh, Frown } from 'lucide-react';

const WMO_CONDITION = (code) => {
  if (code === 0) return { label: 'Cerah', icon: Sun };
  if (code <= 3) return { label: 'Berawan', icon: Cloud };
  if (code <= 67) return { label: 'Hujan', icon: CloudRain };
  if (code <= 82) return { label: 'Gerimis', icon: CloudRain };
  return { label: 'Mendung', icon: Cloud };
};

const DAYS = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
const MONTHS = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

const GREETINGS = (h) => {
  if (h < 5) return 'Selamat Malam';
  if (h < 12) return 'Selamat Pagi';
  if (h < 15) return 'Selamat Siang';
  if (h < 18) return 'Selamat Sore';
  return 'Selamat Malam';
};

const MOODS = [
  { icon: '😊', label: 'Semangat', color: 'text-emerald-500' },
  { icon: '😐', label: 'Biasa', color: 'text-amber-500' },
  { icon: '😔', label: 'Kurang', color: 'text-rose-500' },
];

export default function InfoWidget() {
  const [now, setNow] = useState(new Date());
  const [city, setCity] = useState('Indonesia');
  const [timezone, setTimezone] = useState('WIB (UTC+7)');
  const [weather, setWeather] = useState(null);
  const [mood, setMood] = useState(null);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      try {
        const r = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
        const d = await r.json();
        const c = d.address?.city || d.address?.town || d.address?.village || 'Indonesia';
        setCity(c);
        // Timezone offset
        const off = -now.getTimezoneOffset() / 60;
        setTimezone(`UTC${off >= 0 ? '+' : ''}${off}`);
      } catch { }
      try {
        const r = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weathercode&timezone=auto`);
        const d = await r.json();
        const code = d.current?.weathercode ?? 0;
        const temp = Math.round(d.current?.temperature_2m ?? 28);
        const { label, icon } = WMO_CONDITION(code);
        setWeather({ temp, label, icon });
      } catch {
        setWeather({ temp: 28, label: 'Cerah', icon: Sun });
      }
    }, () => {
      setWeather({ temp: 28, label: 'Cerah', icon: Sun });
    }, { timeout: 6000 });
  }, []);

  const h = now.getHours();
  const m = String(now.getMinutes()).padStart(2, '0');
  const s = String(now.getSeconds()).padStart(2, '0');
  const hStr = String(h).padStart(2, '0');
  const dayName = DAYS[now.getDay()];
  const dateStr = `${dayName}, ${now.getDate()} ${MONTHS[now.getMonth()]} ${now.getFullYear()}`;
  const semester = now.getMonth() < 6 ? 'Semester Ganjil' : 'Semester Genap';
  const year = `${now.getFullYear()}/${now.getFullYear() + 1}`;
  const WeatherIcon = weather?.icon || Sun;

  return (
    <div className="flex flex-wrap gap-3 justify-center">
      {/* Tanggal */}
      <div className="bg-white rounded-2xl shadow-md border border-blue-100 px-4 py-3 min-w-[160px]">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-7 h-7 rounded-lg bg-blue-500 flex items-center justify-center flex-shrink-0">
            <Calendar className="w-4 h-4 text-white" />
          </div>
          <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">Tanggal</span>
        </div>
        <p className="text-sm font-bold text-foreground leading-tight">{dateStr}</p>
        <p className="text-[11px] text-muted-foreground mt-0.5">{semester} &nbsp;{year}</p>
      </div>

      {/* Waktu */}
      <div className="bg-white rounded-2xl shadow-md border border-amber-100 px-4 py-3 min-w-[140px]">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-7 h-7 rounded-lg bg-amber-500 flex items-center justify-center flex-shrink-0">
            <Clock className="w-4 h-4 text-white" />
          </div>
          <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">Waktu</span>
        </div>
        <p className="text-xl font-extrabold font-montserrat text-foreground tracking-tight">{hStr}.{m}.<span className="text-amber-500">{s}</span></p>
        <p className="text-[11px] text-muted-foreground mt-0.5">☀️ {GREETINGS(h)}</p>
      </div>

      {/* Lokasi */}
      <div className="bg-white rounded-2xl shadow-md border border-emerald-100 px-4 py-3 min-w-[140px]">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center flex-shrink-0">
            <MapPin className="w-4 h-4 text-white" />
          </div>
          <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Lokasi</span>
        </div>
        <p className="text-sm font-bold text-foreground leading-tight truncate max-w-[130px]">{city}</p>
        <p className="text-[11px] text-muted-foreground mt-0.5">Zona Waktu: {timezone}</p>
      </div>

      {/* Cuaca */}
      <div className="bg-white rounded-2xl shadow-md border border-cyan-100 px-4 py-3 min-w-[140px]">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-7 h-7 rounded-lg bg-cyan-500 flex items-center justify-center flex-shrink-0">
            <Cloud className="w-4 h-4 text-white" />
          </div>
          <span className="text-[10px] font-bold text-cyan-600 uppercase tracking-wider">Cuaca</span>
        </div>
        <p className="text-sm font-bold text-foreground">{weather ? `${weather.temp}°C ${weather.label}` : 'Memuat...'}</p>
        <p className="text-[11px] text-muted-foreground mt-0.5">≡ Checklist persiapan</p>
      </div>

      {/* Suasana Hati */}
      <div className="bg-white rounded-2xl shadow-md border border-purple-100 px-4 py-3 min-w-[150px]">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-7 h-7 rounded-lg bg-purple-500 flex items-center justify-center flex-shrink-0">
            <span className="text-white text-sm">😊</span>
          </div>
          <span className="text-[10px] font-bold text-purple-600 uppercase tracking-wider">Suasana Hati</span>
        </div>
        <div className="flex gap-1.5 mt-1">
          {MOODS.map((m, i) => (
            <button
              key={i}
              onClick={() => setMood(i)}
              className={`w-8 h-8 rounded-lg text-base transition-all ${mood === i ? 'bg-purple-100 scale-110 ring-2 ring-purple-400' : 'hover:bg-secondary'}`}
              title={m.label}
            >
              {m.icon}
            </button>
          ))}
        </div>
        <p className="text-[11px] text-muted-foreground mt-1">⏰ Riwayat 7 hari</p>
      </div>
    </div>
  );
}