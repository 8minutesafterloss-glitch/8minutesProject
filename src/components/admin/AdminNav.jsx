import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, BarChart3, Calendar, FileText, ClipboardList, BookOpen, Timer } from 'lucide-react';

const NAV_ITEMS = [
  { to: '/hadmin', label: 'ראשי', icon: LayoutDashboard, end: true },
  { to: '/hadmin/user-management', label: 'משתמשים', icon: Users },
  { to: '/hadmin/registrations', label: 'רישומים', icon: ClipboardList },
  { to: '/hadmin/guestbook', label: 'ספר אורחים', icon: BookOpen },
  { to: '/hadmin/analytics', label: 'סטטיסטיקות', icon: BarChart3 },
  { to: '/hadmin/meetings', label: 'מפגשים', icon: Calendar },
  { to: '/hadmin/content', label: 'תוכן', icon: FileText },
  { to: '/hadmin/countdown', label: 'ספירה', icon: Timer },
];

export default function AdminNav() {
  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex gap-1 p-1.5 rounded-2xl bg-white/90 backdrop-blur-md shadow-xl shadow-primary/10 border border-border/40">
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 sm:px-4 py-2.5 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-purple text-white shadow-md shadow-primary/20'
                  : 'text-foreground/55 hover:text-primary hover:bg-accent/40'
              }`
            }
          >
            <Icon className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm font-medium hidden sm:inline">{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}