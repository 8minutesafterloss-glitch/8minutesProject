import React from 'react';
import { ArrowLeft, Infinity as InfinityIcon } from 'lucide-react';

export default function CtaSection() {
  return (
    <section id="cta" className="px-6 lg:px-8 bg-soft-lavender py-4 lg:py-2">
      <div className="max-w-4xl mx-auto text-center">
        <InfinityIcon className="w-14 h-14 text-gradient-purple mx-auto mb-8 animate-float" />
        <h2 style={{ display: 'none' }} className="font-heading text-4xl md:text-5xl font-bold text-primary mb-6">
          מוכנה להתחיל?
        </h2>
        <p style={{ display: 'none' }} className="text-lg md:text-xl text-foreground/65 leading-relaxed mb-10 max-w-2xl mx-auto">
          פתחי את המרכז האישי שלך — מרחב בטוח, פרטי ומותאם אלייך.
        </p>
        <a style={{ display: 'none' }}
          href="#"
          className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-purple text-white text-lg font-semibold shadow-2xl shadow-primary/30 hover:opacity-90 hover:scale-105 transition-all duration-300">
          
          צרי מרכז אישי
          <ArrowLeft className="w-5 h-5" />
        </a>
      </div>
    </section>);

}