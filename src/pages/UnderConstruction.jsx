import React from 'react';
import { Link } from 'react-router-dom';
import { Construction, Home } from 'lucide-react';

export default function UnderConstruction() {
  return (
    <div dir="rtl" className="min-h-screen bg-soft-lavender flex items-center justify-center px-6 py-20">
      <div className="max-w-lg text-center">
        <div className="w-20 h-20 mx-auto mb-8 rounded-3xl bg-gradient-purple flex items-center justify-center shadow-lg shadow-primary/20">
          <Construction className="w-10 h-10 text-white" />
        </div>
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-primary mb-4">
          האזור בבנייה
        </h1>
        <p className="text-foreground/60 leading-relaxed mb-10">
          אנחנו עובדים על האזור האישי ומשפרים אותו עבורך.<br />
          נשמח לראותך שוב בקרוב.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-gradient-purple text-white rounded-full px-7 py-3 font-medium shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity"
        >
          <Home className="w-4 h-4" />
          חזרה לדף הבית
        </Link>
      </div>
    </div>
  );
}