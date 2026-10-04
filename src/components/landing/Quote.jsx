import React from 'react';
import { Infinity as InfinityIcon } from 'lucide-react';

export default function Quote() {
  return (
    <section className="px-6 lg:px-8 bg-gradient-purple relative overflow-hidden py-4 lg:py-2">
      {/* decorative circles */}
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-white/5" />
      <div className="absolute -bottom-40 -left-20 w-80 h-80 rounded-full bg-white/5" />

      <div className="max-w-3xl mx-auto text-center relative z-10">
        <InfinityIcon className="w-12 h-12 text-white/40 mx-auto mb-8" />
        <blockquote className="font-display text-3xl md:text-4xl lg:text-5xl font-medium text-white leading-relaxed">
          ״גם נוכחות בלבד לגמרי מספיקה.״
        </blockquote>
        <p className="mt-8 text-white/70 text-lg leading-relaxed max-w-xl mx-auto">
          8 דקות — קהילה שמחזיקה, בלי שיפוט ובלי לחץ.
        </p>
      </div>
    </section>);

}