import React from 'react';
import { Briefcase, Check, Share2, BookOpen } from 'lucide-react';

const GUIDE_ITEMS = [
  'מה היא לידה שקטה',
  'איך לתמוך בעובדת',
  'מה לומר / מה לא לומר',
  'מדיניות ותמיכה מומלצת',
];

export default function EmployerGuideView() {
  return (
    <div className="bg-white rounded-3xl p-7 sm:p-9 shadow-sm border border-[#D5D2E0]/40">
      <div className="flex items-center gap-4 mb-7">
        <div className="w-12 h-12 rounded-2xl bg-[#F1EEF8] flex items-center justify-center flex-shrink-0">
          <Briefcase className="w-6 h-6 text-[#4A3B72]" />
        </div>
        <div>
          <h2 className="font-heading text-xl font-bold text-[#2D2A35]">מידע לארגון</h2>
          <p className="text-sm text-[#7A7585] mt-1">
            מדריך שעוזר למעסיקים להבין איך לתמוך בעובדת שחוותה לידת שקט.
          </p>
        </div>
      </div>

      <ul className="space-y-3 mb-8">
        {GUIDE_ITEMS.map((item) => (
          <li key={item} className="flex items-center gap-3">
            <span className="w-6 h-6 rounded-full bg-[#E0DDF0] flex items-center justify-center flex-shrink-0">
              <Check className="w-3.5 h-3.5 text-[#4A3B72]" />
            </span>
            <span className="text-[#2D2A35] text-sm font-medium">{item}</span>
          </li>
        ))}
      </ul>

      <div className="flex flex-col sm:flex-row gap-3">
        <button className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-[#F1EEF8] text-[#4A3B72] font-semibold text-sm hover:bg-[#E8E2F5] transition-colors">
          <Share2 className="w-4 h-4" />
          <span>שיתוף</span>
        </button>
        <button className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-[#4A3B72] text-white font-semibold text-sm hover:bg-[#3E3260] transition-colors">
          <BookOpen className="w-4 h-4" />
          <span>צפייה במדריך</span>
        </button>
      </div>
    </div>
  );
}