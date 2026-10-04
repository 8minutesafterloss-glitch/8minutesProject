import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Briefcase, Users, Heart, MessageCircle, Calendar } from 'lucide-react';

const SIDEBAR_LINKS = [
  { label: 'המרכז שלי', icon: Home, to: '/center' },
  { label: 'עבודה', icon: Briefcase, to: '/center/work' },
  { label: 'משפחה', icon: Users, to: '/center/family' },
  { label: 'חברות', icon: Heart, to: '/center/friends' },
  { label: 'תמיכה בשבילי', icon: MessageCircle, to: '/center/support' },
  { label: 'לוח אירועים', icon: Calendar, to: '/events' },
];

export default function CenterSidebar() {
  const location = useLocation();
  const activeIndex = SIDEBAR_LINKS.findIndex((l) => l.to === location.pathname);

  return (
    <aside className="w-full lg:w-64 lg:min-h-[calc(100vh-4rem)] bg-white lg:border-l border-border/50 p-6 lg:p-7">
      <div className="mb-7">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-5 h-5 rounded-full bg-gradient-purple" />
          <h2 className="font-heading text-lg font-bold text-[#2D293A]">המרכז שלי</h2>
        </div>
        <p className="text-sm text-foreground/50">ליווי אישי</p>
      </div>

      <nav className="flex lg:flex-col gap-1.5 overflow-x-auto">
        {SIDEBAR_LINKS.map((link, i) => {
          const Icon = link.icon;
          const isActive = i === activeIndex;
          return (
            <Link
              key={link.label}
              to={link.to}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                isActive
                  ? 'bg-[#EAE8F0] text-[#2D293A]'
                  : 'text-foreground/60 hover:bg-[#EAE8F0]/50 hover:text-[#2D293A]'
              }`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}