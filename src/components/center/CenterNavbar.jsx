import React from 'react';
import { NavLink } from 'react-router-dom';
import { Leaf } from 'lucide-react';
import QuickLinks from '@/components/center/QuickLinks';

const NAV_LINKS = [
  { label: 'הגדרות', to: '/center/settings' },
  { label: 'פרופיל', to: '/center/profile' },
  { label: 'לאימונים', to: '/center/coaching' },
  { label: 'לעמוד הבית', to: '/' },
];

export default function CenterNavbar() {
  return (
    <header className="sticky top-0 z-30 bg-[#2D293A] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <QuickLinks />
          <nav aria-label="ניווט מרכז אישי" className="hidden md:flex items-center gap-7 text-sm font-medium">
            {NAV_LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  `transition-colors ${isActive ? 'text-white' : 'text-white/60 hover:text-white'}`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-1.5 rounded-full">
          <Leaf className="w-4 h-4 text-emerald-300" />
          <span className="font-heading font-bold text-sm tracking-wide">8 דקות</span>
        </div>
      </div>
    </header>
  );
}