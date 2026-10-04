import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, BookOpen, Check, X } from 'lucide-react';
import PromptForm from '@/components/work/PromptForm';

const TONE_OPTIONS = [
  { label: 'עדין', emoji: '🌸' },
  { label: 'ישיר', emoji: '📌' },
  { label: 'קצר', emoji: '✨' },
  { label: 'מפורט', emoji: '✏️' },
  { label: 'מעודד', emoji: '🌱' },
  { label: 'רשמי', emoji: '📄' },
];

const CHANNEL_OPTIONS = [
  { label: 'אימייל', emoji: '✉️' },
  { label: 'SMS', emoji: '📱' },
  { label: 'וואטסאפ', emoji: '💬' },
  { label: 'מסנג\'ר', emoji: '📨' },
  { label: 'אינסטגרם', emoji: '📸' },
  { label: 'פייסבוק', emoji: '👍' },
];

const SAY = ['אני כאן בשבילך', 'אני חושבת עלייך', 'אין לחץ לדבר'];
const AVOID = ['הכול קרה מסיבה', 'תנסי שוב', 'לשכוח ולהמשיך הלאה'];

export default function Friends() {
  const navigate = useNavigate();

  return (
    <div className="px-6 sm:px-10 lg:px-16 py-12 max-w-3xl mx-auto">
      <button
        onClick={() => navigate('/center')}
        className="inline-flex items-center gap-2 text-[#7A7585] hover:text-[#2D2A35] transition-colors mb-5"
      >
        <ArrowRight className="w-4 h-4" />
        <span className="text-sm font-medium">חזרה</span>
      </button>

      <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[#2D2A35] mb-2">
        חברות <span className="align-middle">💜</span>
      </h1>
      <p className="text-[#7A7585] mb-8">תקשורת עם חברות בלי מאמץ רגשי.</p>

      <PromptForm
        hideTopics
        buttonText="צרי לי פרומפט ✨"
        defaultTone="עדין"
        defaultChannel="וואטסאפ"
        toneOptions={TONE_OPTIONS}
        channelOptions={CHANNEL_OPTIONS}
        contextPrompt="חברה קרובה"
      />

      <div className="mt-8 bg-white rounded-3xl p-7 sm:p-9 shadow-sm border border-[#D5D2E0]/40">
        <div className="flex items-center gap-2 mb-1">
          <BookOpen className="w-5 h-5 text-[#4B3F72]" />
          <h2 className="font-heading text-xl font-bold text-[#2D2A35]">מדריך לחברות</h2>
        </div>
        <p className="text-sm text-[#7A7585] mb-6">מה לומר ומה לא לומר לאישה שחוותה לידת שקט.</p>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="rounded-2xl bg-[#E8F5E9] p-5">
            <div className="flex items-center gap-2 mb-3">
              <Check className="w-4 h-4 text-emerald-600" />
              <span className="font-semibold text-emerald-800 text-sm">דברים שכדאי לומר</span>
            </div>
            <ul className="space-y-2 text-sm text-emerald-900/80">
              {SAY.map((s) => (
                <li key={s}>• {s}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl bg-[#FBE9E7] p-5">
            <div className="flex items-center gap-2 mb-3">
              <X className="w-4 h-4 text-rose-600" />
              <span className="font-semibold text-rose-800 text-sm">דברים שעדיף להימנע</span>
            </div>
            <ul className="space-y-2 text-sm text-rose-900/80">
              {AVOID.map((s) => (
                <li key={s}>• {s}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}