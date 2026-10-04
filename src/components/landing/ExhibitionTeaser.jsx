import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Timer } from 'lucide-react';
import { Image } from '@/components/ui/image';

function getTimeLeft() {
  const target = new Date('2026-10-15T00:00:00');
  const now = new Date();
  const diff = target - now;
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor(diff / (1000 * 60 * 60) % 24),
    minutes: Math.floor(diff / (1000 * 60) % 60),
    seconds: Math.floor(diff / 1000 % 60)
  };
}

function TimeUnit({ value, label }) {
  return (
    <div className="flex flex-col items-center">
      <div className="font-heading text-2xl sm:text-3xl font-bold text-gradient-purple leading-none tabular-nums min-w-[2.2ch] text-center">
        {String(value).padStart(2, '0')}
      </div>
      <div className="text-[10px] sm:text-xs text-foreground/50 mt-1">{label}</div>
    </div>);

}

export default function ExhibitionTeaser() {
  const [time, setTime] = useState(getTimeLeft());

  useEffect(() => {
    const interval = setInterval(() => setTime(getTimeLeft()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mt-10 max-w-2xl mx-auto space-y-4">
      {/* Countdown timer */}
      <div className="flex items-center justify-center gap-4 sm:gap-6 px-6 py-5 rounded-3xl bg-gradient-to-l from-accent/50 to-secondary/60 border border-border/50 shadow-lg shadow-primary/5">
        <Timer className="w-6 h-6 text-primary/60 flex-shrink-0" />
        <div className="flex items-center gap-3 sm:gap-5" dir="ltr">
          <TimeUnit value={time.days} label="ימים" />
          <span className="text-2xl text-primary/30 font-bold">:</span>
          <TimeUnit value={time.hours} label="שעות" />
          <span className="text-2xl text-primary/30 font-bold">:</span>
          <TimeUnit value={time.minutes} label="דקות" />
          <span className="text-2xl text-primary/30 font-bold">:</span>
          <TimeUnit value={time.seconds} label="שניות" />
        </div>
      </div>

      {/* Teaser banner image + CTA */}
      <Link to="/exhibition" className="group block rounded-3xl overflow-hidden border border-border/50 shadow-lg shadow-primary/10 hover:shadow-xl hover:shadow-primary/20 hover:scale-[1.01] transition-all duration-300">
        <div className="relative">
          <Image src="https://media.base44.com/images/public/6a61ab9f086a714e89ee692d/97c5f95d2__SMALL.png"

          alt="הרגעים הריקים — תערוכה בנושא לידה שקטה ואובדן תינוק רך"
          className="w-full hidden"
          fittingType="fit"
          originWidth={781}
          originHeight={260} />
          
        </div>
      </Link>

      {/* CTA button */}
      <Link
        to="/exhibition"
        className="group flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gradient-to-l from-[#5D36A8] to-[#3A69B7] text-white font-semibold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02] transition-all duration-300">
        
        <span className="text-base">לפרטים על התערוכה</span>
        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
      </Link>

      {/* Attached exhibition banner image */}
      <div className="mt-2 rounded-2xl overflow-hidden border border-border/40 shadow-md shadow-primary/5">
        <Image
          src="https://media.base44.com/images/public/6a61ab9f086a714e89ee692d/6c7722e95_smallTizer.png"
          alt="הרגעים הריקים — תערוכה בנושא לידה שקטה ואובדן תינוק רך"
          className="w-full"
          fittingType="fit"
          originWidth={781}
          originHeight={260} />
        
      </div>
    </div>);

}