import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function WorkHeader() {
  const navigate = useNavigate();
  return (
    <div className="mb-8">
      <button
        onClick={() => navigate('/center')}
        className="inline-flex items-center gap-2 text-[#7A7585] hover:text-[#2D2A35] transition-colors mb-5"
      >
        <ArrowRight className="w-4 h-4" />
        <span className="text-sm font-medium">חזרה</span>
      </button>
      <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[#2D2A35] mb-2">עבודה</h1>
      <p className="text-[#7A7585]">ניהול התקשורת עם מקום העבודה שלך – בדרך שנוחה לך.</p>
    </div>
  );
}