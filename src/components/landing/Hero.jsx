import React from 'react';
import { Link } from 'react-router-dom';
import { Image } from '@/components/ui/image';
import EditableText from '@/components/landing/EditableText';


export default function Hero() {
  return (
    <section className="bg-soft-lavender relative overflow-hidden py-16">
      {/* decorative elements */}
      <div className="absolute top-[25px] -left-32 w-72 h-72 rounded-full bg-accent/30 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-accent/20 blur-3xl pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-6xl">
        {/* Logo + Title */}
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 sm:gap-4 justify-start">
            <Image src="https://media.base44.com/images/public/6a61ab9f086a714e89ee692d/59706dccb_qr-code2.png"

            alt="קוד QR — 8 דקות"
            className="w-20 md:w-24 lg:w-28 flex-shrink-0 rounded-lg"
            fittingType="fit"
            originWidth={200}
            originHeight={200} />

            <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl font-bold text-primary leading-tight text-right">
              <EditableText contentKey="hero_title_main" fallback={'8 דקות'} as="span" />
              <br />
              <EditableText contentKey="hero_title_sub" fallback={'בשבילך.'} as="span" className="text-gradient-purple" />
            </h1>
          </div>
        </div>

        <div className="h-5" />

        {/* Subheadline */}
        <div className="text-foreground/65 mb-10 mx-auto text-lg text-right md:text-xl max-w-5xl space-y-5 leading-relaxed">
          <EditableText contentKey="hero_p1" fallback={'מיזם 8 דקות הוא מיזם תמיכה קהילתי ארצי, שייסדה ומובילה עו"ד נאורה קנובלר בעקבות הלידה השקטה של התאומים שלה.'} as="p" />
          <EditableText contentKey="hero_p2" fallback={'המיזם הוקם מתוך ההבנה שההתמודדות עם לידה שקטה או אובדן תינוק רך אינה מסתיימת בבית החולים, אלא ממשיכה ללוות משפחות לאורך שנים, בצורות שונות ובמעגלי חיים שונים.'} as="p" />
          <EditableText contentKey="hero_p3" fallback={'בלב המיזם 💜 פועלת קהילת "8 דקות", המבוססת על כוחו של חיבור אנושי ועל האמונה שנשים שחוו את האובדן הזה יכולות להחזיק, לתמוך ולהאיר את הדרך זו לזו.'} as="p" />
          <EditableText contentKey="hero_p4" fallback={'הקהילה פתוחה לכל אישה שחוותה לידה שקטה או אובדן תינוק רך, בכל שלב בחייה, ללא קשר למועד שבו התרחש האובדן, ללא עלות.'} as="p" />
          <EditableText contentKey="hero_p5" fallback={'אחת לשבועיים מתקיימים במסגרת פרויקט הדגל של המיזם — "הרגעים הריקים" — מפגשי זום עם נשות ואנשי מקצוע מתחומי הרפואה, הטיפול, המשפט, הרוח והיצירה, במטרה להעניק ידע, כלים ותקווה לנשים ולמשפחות המתמודדות עם האובדן.'} as="p" />
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center hidden">
          <Link to="/register" className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-gradient-purple text-white font-semibold shadow-xl shadow-primary/20 hover:opacity-90 hover:scale-105 transition-all duration-300">
            
            הצטרפי למרכז האישי
          </Link>
          <Link to="/login" className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-white text-primary font-semibold border-2 border-primary/30 hover:bg-secondary transition-all duration-300">
            
            כבר רשומה? התחברי
          </Link>
        </div>


      </div>

      {/* scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:block">
        

        
      </div>
    </section>);}