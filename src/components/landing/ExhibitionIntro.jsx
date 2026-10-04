import React from 'react';
import { CalendarDays, MapPin, Users, Sparkles, Heart, Palette } from 'lucide-react';
import EditableText from '@/components/landing/EditableText';
import { Image } from '@/components/ui/image';

export default function ExhibitionIntro() {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Overview */}
      <EditableText contentKey="ex_intro_overview" fallback={'מיזם 8 דקות, בשיתוף גלריית ZOA ע"ש דבורה פישר ועמותת ניצוצות ענבר, מזמין אמנים ואמניות לקחת חלק בתערוכה ייחודית שתעניק מקום לחוויה האנושית של לידה שקטה ואובדן תינוק רך. התערוכה תתקיים במהלך החודשים ספטמבר–אוקטובר בגלריה המרכזית של בית ציוני אמריקה.'} as="p" className="text-lg text-foreground/70 leading-relaxed text-center" />

      {/* Meta badges */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/40 text-primary text-sm font-medium">
          <CalendarDays className="w-4 h-4" /> <EditableText contentKey="ex_intro_date" fallback={'ספטמבר–אוקטובר 2026'} as="span" />
        </span>
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/40 text-primary text-sm font-medium">
          <MapPin className="w-4 h-4" /> <EditableText contentKey="ex_intro_location" fallback={'גלריית ZOA, בית ציוני אמריקה'} as="span" />
        </span>
      </div>

      {/* על התערוכה */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-primary/50" />
          <EditableText contentKey="ex_intro_about_title" fallback={'על התערוכה'} as="h2" className="font-heading text-2xl font-bold text-primary" />
        </div>
        <div className="space-y-4 text-foreground/70 leading-relaxed">
          <EditableText contentKey="ex_intro_about_p1" fallback={'כולנו מכירים את רגע האובדן. פחות מדברים על הרגעים שאחריו.'} as="p" />
          <EditableText contentKey="ex_intro_about_p2" fallback={'על החיים שממשיכים להתקיים לצד הגעגוע. על התקווה שמבוששת לחזור, כשהלב עדיין כואב. על הדרך שבה אנו נדרשים ללמוד לשאת את האובדן מבלי לוותר על החיים.'} as="p" />
          <EditableText contentKey="ex_intro_about_p3" fallback={'תערוכת "הרגעים הריקים" מבקשת לתת מקום בדיוק לרגעים האלה — לא רק לרגעי השבר, אלא גם לרגעי החוסן, התקווה, האהבה והצמיחה שנולדים לצדו.'} as="p" />
          <EditableText contentKey="ex_intro_about_p4" fallback={'אנחנו מאמינות שכאב אינו נעלם, אבל כאשר הוא זוכה להכרה, לנראות ולשפה הוא יכול להתחיל להשתנות, ואמנות היא אחת הדרכים העמוקות ביותר לאפשר את השינוי הזה.'} as="p" />
        </div>
      </section>

      {/* על מיזם 8 דקות */}
      <section className="space-y-4">
        


        
        <div className="space-y-4 text-foreground/70 leading-relaxed">
          
          
          
          
        </div>
      </section>

      {/* השותפות לדרך */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <Heart className="w-5 h-5 text-primary/50" />
          <EditableText contentKey="ex_intro_partners_title" fallback={'השותפות לדרך'} as="h2" className="font-heading text-2xl font-bold text-primary" />
        </div>
        <div className="space-y-4 text-foreground/70 leading-relaxed">
          <EditableText contentKey="ex_intro_partners_p1" fallback={'התערוכה יוצאת לפועל בזכות שותפות משמעותית של אנשים וארגונים שבחרו להאמין בחשיבותה.'} as="p" />
          <EditableText contentKey="ex_intro_partners_p2" fallback={'משפחת פישר הייתה הראשונה לפתוח את הדלת ולהעניק במה ציבורית לנושא, באמצעות תרומת גלריית ZOA ע"ש דבורה פישר, הממוקמת בחלל המרכזי של בית ציוני אמריקה.'} as="p" />
          <EditableText contentKey="ex_intro_partners_p3" fallback={'עמותת ניצוצות ענבר מובילה את מעטפת "ניצוצות של שקט" ופועלת לקידום תמיכה במשפחות, הכשרה והעלאת מודעות בתחום אובדן הריון ולידה שקטה לצוותים רפואיים ואנשי מקצוע בתחום. שותפותה בתערוכה היא חלק ממחויבותה הערכית להמשיך להעלות מודעות לנושא ובה בעת להפיץ ניצוצות של חיבור, כוח ותקווה.'} as="p" />
        </div>
        <img
          src="https://media.base44.com/images/public/6a61ab9f086a714e89ee692d/c2f3dd253_partners.png"
          alt='השותפות לדרך - לוגואים'
          className="w-full h-auto rounded-2xl"
        />
      </section>

      {/* הקול הקורא */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <Palette className="w-5 h-5 text-primary/50" />
          <EditableText contentKey="ex_intro_call_title" fallback={'הקול הקורא'} as="h2" className="font-heading text-2xl font-bold text-primary" />
        </div>
        <EditableText contentKey="ex_intro_call_p1" fallback={'אנו מזמינות אמנים ואמניות להגיש עבודות בציור, צילום, רישום, הדפס, רקמה וטכניקות נוספות, העוסקות בנושאים של:'} as="p" className="text-foreground/70 leading-relaxed" />
        <ul className="grid sm:grid-cols-2 gap-2 text-foreground/70 leading-relaxed">
          {[
          'אובדן וגעגוע',
          'חוסן וצמיחה מתוך משבר',
          'תקווה והתחדשות',
          'אהבה, זיכרון והמשכיות',
          'חיים לצד האובדן'].
          map((topic, i) =>
          <li key={topic} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent/30">
              <span className="w-1.5 h-1.5 rounded-full bg-primary/40" />
              <EditableText contentKey={`ex_intro_call_topic_${i}`} fallback={topic} as="span" />
            </li>
          )}
        </ul>
        <EditableText contentKey="ex_intro_call_p2" fallback={'העבודות ייבחרו על ידי אוצר הגלריה ויוצגו במשך חודש שלם במסגרת תערוכת "הרגעים הריקים".'} as="p" className="text-foreground/70 leading-relaxed" />
        <div className="flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-gradient-to-l from-accent/50 to-secondary/60 border border-border/50">
          <CalendarDays className="w-5 h-5 text-primary/60" />
          <EditableText contentKey="ex_intro_call_deadline" fallback={'מועד אחרון להגשה: 8/8/2026'} as="p" className="text-primary font-semibold" />
        </div>
      </section>
    </div>);

}