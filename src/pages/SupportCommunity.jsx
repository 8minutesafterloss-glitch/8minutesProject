import React from 'react';
import { MessageCircle, Video, Calendar, Shield, Users, Heart } from 'lucide-react';
import SupportPageHeader from '@/components/support/SupportPageHeader';

const FEATURES = [
  {
    title: 'פורום תומך',
    desc: 'מרחב משותף לשאול, לשתף ולחלוק – במקום שבו העולם בחוץ כבר ממשיך הלאה.',
    icon: MessageCircle,
  },
  {
    title: 'מפגשי זום',
    desc: 'שיחות קטנות ואינטימיות עם נשים שעברו ומכירות את הדרך.',
    icon: Video,
  },
  {
    title: 'קבוצות עמיתות',
    desc: 'חיבור לקבוצה קטנה שמלווה אותך לאורך זמן, בלי לחץ ובלי שיפוט.',
    icon: Calendar,
  },
];

const FOOTER = [
  { title: 'מדיניות וניסיון מלא', icon: Shield },
  { title: 'קהילה שמבינה באמת', icon: Users },
  { title: 'תחושת שלווה עמוקה', icon: Heart },
];

export default function SupportCommunity() {
  return (
    <div className="px-6 sm:px-10 lg:px-16 py-12 max-w-3xl mx-auto">
      <SupportPageHeader
        backTo="/center/support"
        title="קהילה תומכת"
        subtitle="מרחב משותף שבו אף אחת לא צריכה לצעוד לבד."
      />

      <div className="rounded-3xl bg-[#463768] p-8 text-center text-white mb-10">
        <p className="text-lg leading-relaxed">
          "בזכות הקהילה לא הרגשתי לבד במסע הכי קשה בחיים שלי."
        </p>
      </div>

      <div className="space-y-4 mb-10">
        {FEATURES.map((f) => {
          const Icon = f.icon;
          return (
            <div
              key={f.title}
              className="bg-white rounded-2xl p-6 border border-[#EDEDED] shadow-sm flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-[#EAE8F0] flex items-center justify-center flex-shrink-0">
                <Icon className="w-6 h-6 text-[#4B3F72]" />
              </div>
              <div className="flex-1">
                <h3 className="font-heading font-bold text-[#2D2A35] mb-1">{f.title}</h3>
                <p className="text-sm text-[#757575]">{f.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {FOOTER.map((c) => {
          const Icon = c.icon;
          return (
            <div
              key={c.title}
              className="bg-white rounded-2xl p-5 border border-[#EDEDED] shadow-sm text-center"
            >
              <div className="w-10 h-10 rounded-xl bg-[#EAE8F0] flex items-center justify-center mb-3 mx-auto">
                <Icon className="w-5 h-5 text-[#4B3F72]" />
              </div>
              <h3 className="text-sm font-semibold text-[#2D2A35]">{c.title}</h3>
            </div>
          );
        })}
      </div>
    </div>
  );
}