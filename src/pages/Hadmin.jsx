import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Users, BarChart3, Lock, ArrowLeft, Calendar, FileText, ClipboardList, Image, BookOpen, Timer } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import AdminTodoList from '@/components/admin/AdminTodoList';

const ADMIN_CARDS = [
  {
    title: 'ניהול מפגשים',
    description: 'עריכה, הוספה ומחיקה של מפגשים ופרטיהם.',
    icon: Calendar,
    to: '/hadmin/meetings',
  },
  {
    title: 'רישומים לאירועים',
    description: 'צפי בנרשמות לכל אירוע ומפגש.',
    icon: ClipboardList,
    to: '/hadmin/registrations',
  },
  {
    title: 'ניהול משתמשים',
    description: 'צפי בחברי הקהילה ונהל את רמות הגישה שלהם.',
    icon: Users,
    to: '/hadmin/user-management',
  },
  {
    title: 'סטטיסטיקות',
    description: 'נתונים ומגמות על הפעילות במיזם.',
    icon: BarChart3,
    to: '/hadmin/analytics',
  },
  {
    title: 'ניהול תוכן',
    description: 'עריכת טקסטים ומדריכים במרכז האישי בלי לשנות קוד.',
    icon: FileText,
    to: '/hadmin/content',
  },
  {
    title: 'ניהול יצירות תערוכה',
    description: 'ייבוא יצירות מהאקסל והעלאת תמונות לכל יצירה.',
    icon: Image,
    to: '/hadmin/exhibition',
  },
  {
    title: 'ספר אורחים',
    description: 'אישור, עריכה ומחיקה של רשומות המבקרים בתערוכה.',
    icon: BookOpen,
    to: '/hadmin/guestbook',
  },
  {
    title: 'ניהול ספירה לאחור',
    description: 'תאריך יעד, תקופת ביניים עם סימון "נפתח", והפיכת השעון ללחיץ.',
    icon: Timer,
    to: '/hadmin/countdown',
  },
];

export default function Hadmin() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function check() {
      try {
        const user = await base44.auth.me();
        setIsAdmin(user?.role === 'admin');
      } catch {
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    }
    check();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="p-6 lg:p-10 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Lock className="w-12 h-12 text-primary/20 mx-auto mb-4" />
          <p className="text-foreground/60">אין לך הרשאה לצפות בדף זה</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <ShieldCheck className="w-5 h-5 text-primary/60" />
          <span className="text-sm font-medium text-primary/60">ניהול מערכת</span>
        </div>
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-primary">פאנל ניהול</h1>
        <p className="text-foreground/60 mt-3">גישה לכלי הניהול של המיזם.</p>
      </div>

      <div className="max-w-5xl">
        <div className="mb-8">
          <AdminTodoList />
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {ADMIN_CARDS.map((c) => {
            const Icon = c.icon;
            return (
              <button
                key={c.title}
                onClick={() => navigate(c.to)}
                className="group text-right bg-white rounded-3xl p-7 border border-border/40 shadow-sm hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-6">
                  <ArrowLeft className="w-5 h-5 text-foreground/30 group-hover:text-primary transition-colors" />
                  <div className="w-12 h-12 rounded-2xl bg-accent/50 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <h3 className="font-heading text-xl font-bold text-primary mb-2">{c.title}</h3>
                <p className="text-sm text-foreground/55 leading-relaxed">{c.description}</p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}