import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Users, Heart, User, BookOpen, Check } from 'lucide-react';
import PromptForm from '@/components/work/PromptForm';

const RECIPIENTS = [
  { key: 'parents', label: 'הורים', sub: 'איך אפשר לעזור', icon: Users },
  { key: 'siblings', label: 'אחים / אחיות', sub: 'נוכחות וקרבה', icon: Users },
  { key: 'partner', label: 'בן / בת זוג', sub: 'מה אני מרגיש/ה עכשיו', icon: Heart },
  { key: 'extended', label: 'משפחה מורחבת', sub: 'נוכחות ותמיכה', icon: User },
];

const TOPIC_OPTIONS = ['עדכון קצר', 'בקשת עזרה', 'אני צריכה מרחב', 'משהו אחר'];
const GUIDE_POINTS = ['מה לומר / מה לא לומר', 'איך להיות שם בפועל', 'רעיונות לעזרה מעשית'];

export default function Family() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);

  return (
    <div className="px-6 sm:px-10 lg:px-16 py-12 max-w-3xl mx-auto">
      <button
        onClick={() => navigate('/center')}
        className="inline-flex items-center gap-2 text-[#7A7585] hover:text-[#2D2A35] transition-colors mb-5"
      >
        <ArrowRight className="w-4 h-4" />
        <span className="text-sm font-medium">חזרה</span>
      </button>

      <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[#2D2A35] mb-2">משפחה</h1>
      <p className="text-[#7A7585] mb-8">עדכן בני משפחה בדרך שנוחה לך.</p>

      <h2 className="font-heading text-lg font-semibold text-[#2D2A35] mb-4">למי ההודעה?</h2>
      <div className="grid grid-cols-2 gap-4 mb-8">
        {RECIPIENTS.map((r) => {
          const Icon = r.icon;
          const active = selected === r.key;
          return (
            <button
              key={r.key}
              onClick={() => setSelected(r.key)}
              className={`text-right p-6 rounded-2xl border transition-all ${
                active
                  ? 'border-[#4B3F72] bg-[#EAE8F0] shadow-md'
                  : 'border-[#D5D2E0]/50 bg-white hover:shadow-sm'
              }`}
            >
              <div className="w-11 h-11 rounded-xl bg-[#EAE8EE] flex items-center justify-center mb-3">
                <Icon className="w-5 h-5 text-[#2D293A]" />
              </div>
              <h3 className="font-heading font-bold text-[#2D2A35] mb-1">{r.label}</h3>
              <p className="text-xs text-[#7A7585]">{r.sub}</p>
            </button>
          );
        })}
      </div>

      {selected && (
        <PromptForm
          topicLabel="מה את רוצה להגיד?"
          topicOptions={TOPIC_OPTIONS}
          multiTopic
          buttonText="צרי לי פרומפט"
          contextPrompt={RECIPIENTS.find((r) => r.key === selected)?.label}
        />
      )}

      <div className="mt-8 bg-white rounded-3xl p-7 sm:p-9 shadow-sm border border-[#D5D2E0]/40">
        <div className="flex items-center gap-2 mb-1">
          <BookOpen className="w-5 h-5 text-[#4B3F72]" />
          <h2 className="font-heading text-xl font-bold text-[#2D2A35]">הדרכה למשפחה</h2>
        </div>
        <p className="text-sm text-[#7A7585] mb-5">איך לתמוך בפועל ולהיות שם – בלי לדרוש ובלי לשפוט.</p>
        <ul className="space-y-2.5">
          {GUIDE_POINTS.map((p) => (
            <li key={p} className="flex items-center gap-2.5 text-sm text-[#2D2A35]">
              <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{p}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}