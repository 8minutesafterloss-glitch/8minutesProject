import React from 'react';
import { Heart, Users, BookOpen, Moon } from 'lucide-react';

const goals = [
{ icon: Heart, text: 'ליצור מרחב בטוח ומאפשר לנשים המתמודדות עם אובדן הריון או תינוק רך.' },
{ icon: Users, text: 'להפחית את תחושת הבדידות באמצעות חיבור ותמיכה קהילתית.' },
{ icon: BookOpen, text: 'להעניק ידע וכלים מקצועיים להתמודדות בשלבים השונים של הדרך.' },
{ icon: Moon, text: 'לאפשר מקום שבו אפשר להיות – גם בלי לשתף, גם בלי להסביר.' }];


export default function Goals() {
  return (
    <section id="goals" className="px-6 lg:px-8 bg-soft-lavender py-2 lg:py-12 scroll-mt-24">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-sm font-medium text-primary/60 tracking-wider">המטרה שלנו</span>
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-primary mt-3">למה אנחנו כאן</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {goals.map((goal, i) => {
            const Icon = goal.icon;
            return (
              <div
                key={i}
                className="group flex items-start gap-5 p-7 rounded-2xl bg-white/70 backdrop-blur-sm border border-border/50 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300">
                
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-accent/50 flex items-center justify-center group-hover:bg-gradient-purple group-hover:text-white transition-all duration-300">
                  <Icon className="w-6 h-6 text-primary group-hover:text-white transition-colors" />
                </div>
                <p className="text-lg text-foreground/75 leading-relaxed pt-2">{goal.text}</p>
              </div>);

          })}
        </div>

        <p className="text-center mt-12 text-foreground/55 leading-relaxed max-w-3xl mx-auto">
          רוב פעילות המיזם מתקיימת ללא עלות, ומבוססת על התנדבות, שותפויות ואנשים שמאמינים בחשיבות של מתן מקום אמיתי להתמודדות עם אובדן הריון ולידה.
        </p>
      </div>
    </section>);

}