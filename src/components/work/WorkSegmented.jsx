import React from 'react';
import { User, ClipboardList, BookOpen } from 'lucide-react';

const SEGMENTS = [
  { id: 'manager', label: 'מנהל/ת', icon: User },
  { id: 'hr', label: 'משאבי אנוש', icon: ClipboardList },
  { id: 'guide', label: 'מדריך למעסיק', icon: BookOpen },
];

export default function WorkSegmented({ active, onChange }) {
  return (
    <div className="inline-flex items-center gap-1.5 p-1.5 rounded-2xl bg-[#F4F3F7] mb-10">
      {SEGMENTS.map((seg) => {
        const Icon = seg.icon;
        const isActive = active === seg.id;
        return (
          <button
            key={seg.id}
            onClick={() => onChange(seg.id)}
            className={`inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
              isActive
                ? 'bg-white text-[#2D2A35] shadow-sm'
                : 'text-[#7A7585] hover:text-[#2D2A35]'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span>{seg.label}</span>
          </button>
        );
      })}
    </div>
  );
}