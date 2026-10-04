import React from 'react';
import { MessageSquare, Sparkles, FolderOpen, Users } from 'lucide-react';

const items = [
{ icon: MessageSquare, title: 'עזרה בתקשורת', text: 'פרומפטים מותאמים לעבודה, משפחה וחברות — בלי למצוא את המילים לבד.' },
{ icon: Sparkles, title: 'כלים רגשיים', text: 'תרגילי נשימה, יומן אישי ומצב בטוח לרגעים שקשים.' },
{ icon: FolderOpen, title: 'ניהול מסמכים', text: 'כל ההודעות והפרומפטים שלך, שמורים ומסודרים במקום אחד.' },
{ icon: Users, title: 'ספריית תוכן', text: 'מאגר תכנים לתמיכה מידית.' }];


export default function WhatYoullFind() {
  return (
    <section id="center" className="px-6 lg:px-8 bg-white py-16 lg:py-16">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-14">
          <div className="text-center">
            <h2  className="font-heading text-4xl md:text-5xl font-bold text-primary mt-3">בקרוב: המרכז האישי</h2>
            <span className="text-sm font-medium text-primary/60 tracking-wider">מה תמצאי במרכז</span>
          </div>
          <a style={{ display: 'none' }}
            href="#cta"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-purple text-white font-medium shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity">
            
            התחילי עכשיו
          </a>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          {items.map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={i}
                className="group p-8 rounded-3xl bg-gradient-to-br from-secondary to-transparent border border-border/50 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-300">
                
                <div className="w-14 h-14 rounded-2xl bg-accent/50 flex items-center justify-center mb-5 group-hover:bg-gradient-purple transition-all duration-300">
                  <Icon className="w-7 h-7 text-primary group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-heading text-xl font-bold text-primary mb-3">{item.title}</h3>
                <p className="text-foreground/65 leading-relaxed">{item.text}</p>
              </div>);

          })}
        </div>
      </div>
    </section>);

}