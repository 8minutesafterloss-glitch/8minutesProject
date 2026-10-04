import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, FileText, Heart, Users, BookOpen, Wind, Folder, Bot } from 'lucide-react';
import SupportPageHeader from '@/components/support/SupportPageHeader';
import EditableCenterText from '@/components/center/EditableCenterText';

const SYSTEMS = [
  {
    titleKey: 'support_sys_0_title', titleFallback: 'תכנים והסברים',
    descKey: 'support_sys_0_desc', descFallback: 'מידע, סיפורים ומדריכים שמאירים את הדרך.',
    icon: FileText, ctaKey: 'support_sys_0_cta', ctaFallback: 'עיון במאגר', to: '/center/support/articles',
  },
  {
    titleKey: 'support_sys_1_title', titleFallback: 'כלים רגשיים',
    descKey: 'support_sys_1_desc', descFallback: 'מצב רוח, תרגילים וזמן אישי לעיבוד בקצב שלך.',
    icon: Heart, ctaKey: 'support_sys_1_cta', ctaFallback: 'לצאת לדרך', to: '/center/coaching',
  },
  {
    titleKey: 'support_sys_2_title', titleFallback: 'קהילה תומכת',
    descKey: 'support_sys_2_desc', descFallback: 'חיבור לנשים שעברו חברות - במקום שבו העולם כבר הבין אותך.',
    icon: Users, ctaKey: 'support_sys_2_cta', ctaFallback: 'שיחת תמיכה', to: '/center/support/community',
  },
];

const QUICK = [
  { titleKey: 'support_quick_0_title', titleFallback: 'יומן אישי', descKey: 'support_quick_0_desc', descFallback: 'כתיבה ורפלקציה', icon: BookOpen, to: '/center/support/journal' },
  { titleKey: 'support_quick_1_title', titleFallback: 'תרגיל נשימה', descKey: 'support_quick_1_desc', descFallback: 'הרגעה מיידית', icon: Wind, to: '/center/coaching' },
  { titleKey: 'support_quick_2_title', titleFallback: 'המסמכים שלי', descKey: 'support_quick_2_desc', descFallback: 'מסמכים ששמרת', icon: Folder, to: '/center/documents' },

];

export default function Support() {
  const navigate = useNavigate();

  return (
    <div className="px-6 sm:px-10 lg:px-16 py-12 max-w-3xl mx-auto">
      <SupportPageHeader
        backTo="/center"
        title="תמיכה בשבילי"
        subtitle="ליווי הלמתי - לא נועד לענות בכל רגע, בקצב שלך"
      />

      <div className="rounded-3xl bg-[#4B3F72] p-8 text-center text-white mb-10">
        <EditableCenterText
          contentKey="support_quote"
          fallback={'"אני עברתי לידה שקטה. אני לא צריכה עצות. אני צריכה הבנה, זמן ותמיכה."'}
          as="p"
          className="text-lg leading-relaxed"
          category="תמיכה"
        />
      </div>

      <h2 className="font-heading text-xl font-bold text-[#2D2A35] mb-4">הערכת תמיכה</h2>
      <div className="space-y-4 mb-10">
        {SYSTEMS.map((s) => {
          const Icon = s.icon;
          return (
            <button
              key={s.titleKey}
              onClick={() => s.to && navigate(s.to)}
              className="w-full text-right bg-white rounded-2xl p-6 border border-[#EDEDED] shadow-sm hover:shadow-md transition-all flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-[#EAE8F0] flex items-center justify-center flex-shrink-0">
                <Icon className="w-6 h-6 text-[#4B3F72]" />
              </div>
              <div className="flex-1">
                <EditableCenterText contentKey={s.titleKey} fallback={s.titleFallback} as="h3" className="font-heading font-bold text-[#2D2A35]" category="תמיכה" />
                <EditableCenterText contentKey={s.descKey} fallback={s.descFallback} as="p" className="text-sm text-[#757575]" category="תמיכה" />
              </div>
              <span className="text-sm text-[#5E548E] font-medium flex items-center gap-1 whitespace-nowrap">
                <EditableCenterText contentKey={s.ctaKey} fallback={s.ctaFallback} as="span" category="תמיכה" /> <ArrowRight className="w-4 h-4" />
              </span>
            </button>
          );
        })}
      </div>

      <h2 className="font-heading text-xl font-bold text-[#2D2A35] mb-4">כלים מהירים</h2>
      <div className="grid grid-cols-2 gap-4">
        {QUICK.map((q) => {
          const Icon = q.icon;
          return (
            <button
              key={q.titleKey}
              onClick={() => q.to && navigate(q.to)}
              className="text-right bg-white rounded-2xl p-5 border border-[#EDEDED] shadow-sm hover:shadow-md transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-[#EAE8F0] flex items-center justify-center mb-3">
                <Icon className="w-5 h-5 text-[#4B3F72]" />
              </div>
              <EditableCenterText contentKey={q.titleKey} fallback={q.titleFallback} as="h3" className="font-heading font-bold text-[#2D2A35]" category="תמיכה" />
              <EditableCenterText contentKey={q.descKey} fallback={q.descFallback} as="p" className="text-xs text-[#757575]" category="תמיכה" />
            </button>
          );
        })}
      </div>
    </div>
  );
}