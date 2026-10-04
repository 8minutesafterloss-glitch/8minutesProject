import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Briefcase, Home, Heart, Leaf, MessageCircle } from 'lucide-react';

const CATEGORY_CARDS = [
{
  title: 'עבודה',
  description: 'משפטי פתיחה וטקסטים לעדכון בעבודה',
  icon: Briefcase,
  to: '/center/work'
},
{
  title: 'משפחה',
  description: 'משפטים מוכנים לשיתוף עם בן זוג ומשפחה',
  icon: Home,
  to: '/center/family'
},
{
  title: 'חברות',
  description: 'משפטים לעדכון חברות קרובות',
  icon: Heart,
  to: '/center/friends'
}];


function CategoryCard({ title, description, icon: Icon, to }) {
  const navigate = useNavigate();
  return (
    <button onClick={() => to && navigate(to)} className="group text-right bg-white rounded-3xl p-7 border border-border/40 shadow-sm hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-300">
      <div className="flex items-start justify-between mb-6">
        <ArrowLeft className="w-5 h-5 text-foreground/30 group-hover:text-primary transition-colors" />
        <div className="w-12 h-12 rounded-2xl bg-[#EAE8EE] flex items-center justify-center">
          <Icon className="w-6 h-6 text-[#2D293A]" />
        </div>
      </div>
      <h3 className="font-heading text-xl font-bold text-[#2D293A] mb-2">{title}</h3>
      <p className="text-sm text-foreground/55 leading-relaxed">{description}</p>
    </button>);

}

function WideCard({ title, icon: Icon, to }) {
  const navigate = useNavigate();
  return (
    <button onClick={() => to && navigate(to)} className="group w-full flex items-center gap-4 bg-white rounded-3xl p-6 border border-border/40 shadow-sm hover:shadow-xl hover:shadow-primary/10 transition-all duration-300">
      <ArrowLeft className="w-5 h-5 text-foreground/30 group-hover:text-primary transition-colors" />
      <div className="flex-1 text-right">
        <h3 className="font-heading text-lg font-bold text-[#2D293A]">{title}</h3>
      </div>
      <div className="w-12 h-12 rounded-2xl bg-[#EAE8EE] flex items-center justify-center flex-shrink-0">
        <Icon className="w-6 h-6 text-emerald-500" />
      </div>
    </button>);
}

export default function PersonalSpace() {
  return (
    <div className="px-6 sm:px-10 lg:px-16 py-14 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <p className="text-sm font-medium text-foreground/50 mb-3">המרכז האישי שלי</p>
        <h1 className="font-heading text-4xl sm:text-5xl font-bold text-[#2D293A] mb-4">
          מה את צריכה עכשיו?
        </h1>
        <p className="text-lg text-foreground/55">התנהלי בקצב שלך. בלי לחץ.</p>
      </div>

      {/* Central leaf icon */}
      <div className="flex justify-center mb-14">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-100 to-[#EAE8EE] flex items-center justify-center shadow-md shadow-primary/5">
          <Leaf className="w-10 h-10 text-emerald-500" />
        </div>
      </div>

      {/* Section title */}
      <h2 className="font-heading text-2xl font-bold text-[#2D293A] text-center mb-8">המרחב האישי</h2>

      {/* Category cards grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-5">
        {CATEGORY_CARDS.map((c) =>
        <CategoryCard key={c.title} {...c} />
        )}
      </div>

      {/* Wide cards */}
      <div className="space-y-5">
        <WideCard title="תמיכה בשבילי" icon={Leaf} to="/center/support" />
      </div>
    </div>);

}