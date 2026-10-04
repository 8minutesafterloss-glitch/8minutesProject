import React from 'react';
import { Wind, Compass, HeartHandshake } from 'lucide-react';

const steps = [
{ num: '01', icon: Wind, title: 'נושמות רגע', text: 'יש לך 8 דקות — מרחב פתוח לשיתוף, התייעצות ותמיכה טלפונית מיידית ממי שמבינה.' },
{ num: '02', icon: Compass, title: 'בוחרות מה צריך', text: 'להקשיב, להיתמך או לקבל ידע — מה שנכון לך עכשיו.' },
{ num: '03', icon: HeartHandshake, title: 'מפגשים מקצועיים', text: 'מקבלת יידע וכלים פרקטיים להתמודדות.' }];


export default function HowItWorks() {
  return (
    <section id="how" className="px-6 lg:px-8 bg-soft-lavender py-16 lg:py-16 scroll-mt-24">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-sm font-medium text-primary/60 tracking-wider">התהליך</span>
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-primary mt-3">איך זה עובד</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={i} className="relative text-center group">
                {i < steps.length - 1 &&
                <div className="hidden md:block absolute top-12 right-[55%] w-[90%] h-px bg-gradient-to-l from-border to-transparent" />
                }
                <div className="relative inline-flex items-center justify-center mb-6">
                  <div className="w-24 h-24 rounded-full bg-white border-2 border-accent flex items-center justify-center group-hover:bg-gradient-purple group-hover:border-transparent transition-all duration-500 shadow-lg shadow-primary/5">
                    <Icon className="w-9 h-9 text-primary group-hover:text-white transition-colors" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-purple text-white text-sm font-bold flex items-center justify-center">
                    {step.num}
                  </span>
                </div>
                <h3 className="font-heading text-xl font-bold text-primary mb-3">{step.title}</h3>
                <p className="text-foreground/65 leading-relaxed max-w-xs mx-auto">{step.text}</p>
              </div>);

          })}
        </div>
      </div>
    </section>);

}