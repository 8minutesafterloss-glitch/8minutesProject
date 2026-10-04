import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function SupportPageHeader({ backTo = '/center/support', title, subtitle, icon: Icon }) {
  const navigate = useNavigate();
  return (
    <div className="mb-8">
      <button
        onClick={() => navigate(backTo)}
        className="inline-flex items-center gap-2 text-[#7A7585] hover:text-[#2D2A35] transition-colors mb-5"
      >
        <ArrowRight className="w-4 h-4" />
        <span className="text-sm font-medium">חזרה</span>
      </button>
      <div className="flex items-center gap-2 mb-2">
        {Icon && <Icon className="w-6 h-6 text-[#4B3F72]" />}
        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[#2D2A35]">{title}</h1>
      </div>
      {subtitle && <p className="text-[#7A7585]">{subtitle}</p>}
    </div>
  );
}