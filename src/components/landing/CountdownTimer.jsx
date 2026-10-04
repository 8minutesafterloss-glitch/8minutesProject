import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Timer, X } from 'lucide-react';
import { useCountdownSettings } from '@/hooks/useCountdownSettings';

function getTimeLeft(target) {
  const t = new Date(target).getTime();
  const diff = t - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor(diff / 3600000) % 24,
    minutes: Math.floor(diff / 60000) % 60,
    seconds: Math.floor(diff / 1000) % 60,
  };
}

function TimeUnit({ value, label }) {
  return (
    <div className="flex flex-col items-center">
      <div className="font-heading font-bold text-gradient-purple leading-none tabular-nums min-w-[2.2ch] text-center text-xl sm:text-2xl">
        {String(value).padStart(2, '0')}
      </div>
      <div className="text-[10px] sm:text-xs text-foreground/50 mt-1">{label}</div>
    </div>
  );
}

export default function CountdownTimer() {
  const s = useCountdownSettings();
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    if (!s.enabled) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [s.enabled]);

  if (!s.enabled) return null;

  const targetMs = new Date(s.targetDate).getTime();
  const interimEndMs = s.interimEndDate ? new Date(s.interimEndDate).getTime() : null;

  // After interim period ends → hide entirely
  if (s.interimEnabled && interimEndMs && now > interimEndMs) return null;

  const pastTarget = now >= targetMs;
  // Past target with no interim → hide
  if (pastTarget && !s.interimEnabled) return null;

  const time = getTimeLeft(s.targetDate);

  const inner = (
    <div className="relative flex flex-col items-center gap-2 px-6 py-5 rounded-2xl bg-[#F8F7FA] border border-border/50 shadow-sm w-full max-w-sm mx-auto transition-transform hover:scale-[1.02]">
      <Timer className="w-5 h-5 text-primary/60 flex-shrink-0" />
      <div className="flex items-center justify-center gap-1.5" dir="ltr">
        <TimeUnit value={time.days} label="ימים" />
        <span className="text-lg text-primary/30 font-bold">:</span>
        <TimeUnit value={time.hours} label="שעות" />
        <span className="text-lg text-primary/30 font-bold">:</span>
        <TimeUnit value={time.minutes} label="דקות" />
        <span className="text-lg text-primary/30 font-bold">:</span>
        <TimeUnit value={time.seconds} label="שניות" />
      </div>

      {pastTarget && s.interimEnabled && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-white/85 backdrop-blur-sm rounded-2xl border border-primary/20">
          <X className="w-10 h-10 text-primary/70" strokeWidth={2.5} />
          <span className="font-heading text-2xl font-bold text-primary">{s.openedText}</span>
        </div>
      )}
    </div>
  );

  if (s.clickable && s.link) {
    const isExternal = /^https?:\/\//.test(s.link);
    if (isExternal) {
      return (
        <a href={s.link} target="_blank" rel="noopener noreferrer" className="block">
          {inner}
        </a>
      );
    }
    return <Link to={s.link} className="block">{inner}</Link>;
  }

  return inner;
}