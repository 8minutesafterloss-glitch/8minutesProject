import React from 'react';
import { Clock, Leaf, Heart, BookOpen, PenLine, Wind } from 'lucide-react';
import EditableCenterText from '@/components/center/EditableCenterText';

const EXERCISES = [
  { titleKey: 'coaching_ex_0_title', titleFallback: 'נשימה בת 8 דקות', descKey: 'coaching_ex_0_desc', descFallback: 'תרגול נשימה מודרך להרגעה והתחברות לגוף.', icon: Wind, duration: '8 דקות' },
  { titleKey: 'coaching_ex_1_title', titleFallback: 'כתיבה חופשית', descKey: 'coaching_ex_1_desc', descFallback: 'כתיבה אישית על הרגשות וחוויות מהיום שעבר.', icon: PenLine, duration: '8 דקות' },
  { titleKey: 'coaching_ex_2_title', titleFallback: 'מפגש עם הלב', descKey: 'coaching_ex_2_desc', descFallback: 'תרגול מתינות וחמלה עצמית ברגעים קשים.', icon: Heart, duration: '8 דקות' },
  { titleKey: 'coaching_ex_3_title', titleFallback: 'קריאה מודרכת', descKey: 'coaching_ex_3_desc', descFallback: 'קריאת טקסט תמיכה קצר עם שאלות להרהור.', icon: BookOpen, duration: '8 דקות' },
  { titleKey: 'coaching_ex_4_title', titleFallback: 'זמן לטבע', descKey: 'coaching_ex_4_desc', descFallback: 'תרגול התבוננות וחיבור לסביבה הטבעית.', icon: Leaf, duration: '8 דקות' },
];

export default function Coaching() {
  return (
    <div className="px-6 sm:px-10 lg:px-16 py-14 max-w-4xl mx-auto">
      <div className="flex items-center gap-2 mb-2">
        <Leaf className="w-5 h-5 text-emerald-500" />
        <EditableCenterText contentKey="coaching_badge" fallback="אימונים אישיים" as="span" className="text-sm font-medium text-primary/60" category="אימונים" />
      </div>
      <EditableCenterText contentKey="coaching_title" fallback="לאימונים" as="h1" className="font-heading text-3xl sm:text-4xl font-bold text-[#2D293A] mb-2" category="אימונים" />
      <EditableCenterText contentKey="coaching_subtitle" fallback="תרגולים קצרים בני 8 דקות, בקצב שלך." as="p" className="text-foreground/55 mb-10" category="אימונים" />

      <div className="grid sm:grid-cols-2 gap-5">
        {EXERCISES.map((ex) => {
          const Icon = ex.icon;
          return (
            <button
              key={ex.titleKey}
              className="group text-right bg-white rounded-3xl p-7 border border-border/40 shadow-sm hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-5">
                <div className="flex items-center gap-1.5 text-xs font-medium text-foreground/45">
                  <Clock className="w-3.5 h-3.5" />
                  {ex.duration}
                </div>
                <div className="w-12 h-12 rounded-2xl bg-[#EAE8EE] flex items-center justify-center">
                  <Icon className="w-6 h-6 text-emerald-500" />
                </div>
              </div>
              <EditableCenterText contentKey={ex.titleKey} fallback={ex.titleFallback} as="h3" className="font-heading text-lg font-bold text-[#2D293A] mb-2" category="אימונים" />
              <EditableCenterText contentKey={ex.descKey} fallback={ex.descFallback} as="p" className="text-sm text-foreground/55 leading-relaxed" category="אימונים" />
            </button>
          );
        })}
      </div>
    </div>
  );
}