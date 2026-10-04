import React from 'react';
import { Calendar, Users, Clock } from 'lucide-react';
import EditableText from '@/components/landing/EditableText';

const stats = [
{ icon: Calendar, value: "16", label: 'מפגשים' },
{ icon: Users, value: 'עשרות', label: 'נשים משתתפות' },
{ icon: Clock, value: 'אחת לשבועיים', label: 'תדירות' }];


export default function EmptyMoments() {
  return (
    <section id="empty-moments" className="px-6 lg:px-8 bg-soft-lavender py-2 lg:py-12 scroll-mt-24">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <EditableText contentKey="em_badge" fallback={'פרויקט דגל'} as="span" className="text-sm font-medium text-primary/60 tracking-wider" />
          <EditableText contentKey="em_title" fallback={'הרגעים הריקים'} as="h2" className="font-heading text-4xl md:text-5xl font-bold text-gradient-purple mt-3 block" />
        </div>

        <div className="prose prose-lg max-w-none text-center">
          <EditableText contentKey="em_p1" fallback={'פרויקט «הרגעים הריקים» הוא פרויקט דגל של מיזם 8 דקות, ובו מתקיימים אחת לשבועיים מפגשי זום עם נשות ואנשי מקצוע מתחומים שונים, במטרה לתת כלים להתמודדות עם האובדן (האבל), הטראומה וההחלמה מלידה. בפרויקט התקיימו עד כה 14 מפגשים ולקחו בהן חלק עשרות נשים.'} as="p" className="text-lg md:text-xl text-foreground/70 leading-relaxed text-right" />

          <div className="text-lg md:text-xl text-foreground/70 leading-relaxed mt-6 text-right space-y-5">
            <EditableText contentKey="em_p2" fallback={'כל פעילות המיזם מתקיימת ללא עלות, ומבוססת על התנדבות, שותפויות ואנשים שמאמינים בחשיבות של מתן מקום אמיתי להתמודדות עם אובדן הריון ולידה, במטרה:'} as="p" />
            <ul className="space-y-3 pr-2">
              <li className="flex items-start gap-3">
                <span className="mt-2.5 flex-shrink-0 w-2 h-2 rounded-full bg-gradient-purple" />
                <EditableText contentKey="em_bullet_1" fallback={'ליצור מרחב בטוח ומאפשר לנשים המתמודדות עם אובדן הריון או תינוק רך.'} as="span" className="flex-1" />
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-2.5 flex-shrink-0 w-2 h-2 rounded-full bg-gradient-purple" />
                <EditableText contentKey="em_bullet_2" fallback={'להפחית את תחושת הבדידות באמצעות חיבור ותמיכה קהילתית.'} as="span" className="flex-1" />
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-2.5 flex-shrink-0 w-2 h-2 rounded-full bg-gradient-purple" />
                <EditableText contentKey="em_bullet_3" fallback={'להעניק ידע וכלים מקצועיים להתמודדות בשלבים השונים של הדרך.'} as="span" className="flex-1" />
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-2.5 flex-shrink-0 w-2 h-2 rounded-full bg-gradient-purple" />
                <EditableText contentKey="em_bullet_4" fallback={'לאפשר מקום שבו אפשר להיות – גם בלי לשתף, גם בלי להסביר.'} as="span" className="flex-1" />
              </li>
            </ul>
            <EditableText contentKey="em_p3" fallback={'המפגשים מתקיימים בזום, באווירה רכה, בטוחה ולא שיפוטית, ומוחזקים ברגישות על ידי נאורה ונשות ואנשי המקצוע. ההשתתפות אינה מחייבת שיתוף בסיפור האישי. גם נוכחות בלבד לגמרי מספיקה.'} as="p" />
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mt-8">
          {['אחת לשבועיים', 'בזום', 'עלות סמלית'].map((tag) =>
          <span key={tag} className="px-4 py-1.5 rounded-full bg-accent/50 text-sm font-medium text-primary">
              {tag}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="text-center p-8 rounded-3xl bg-gradient-to-b from-accent/40 to-transparent border border-border/40">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-purple flex items-center justify-center mb-4">
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <div className="font-heading text-3xl font-bold text-primary mb-1">{stat.value}</div>
                <div className="text-sm text-foreground/60">{stat.label}</div>
              </div>);

          })}
        </div>
      </div>
    </section>);

}