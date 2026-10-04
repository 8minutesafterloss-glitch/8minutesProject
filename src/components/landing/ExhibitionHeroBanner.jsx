import React from 'react';
import { Image } from '@/components/ui/image';
import CountdownTimer from '@/components/landing/CountdownTimer';

export default function ExhibitionHeroBanner() {
  return (
    <section className="w-full bg-white px-4 pt-[140px] pb-6">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-4 items-stretch">
        {/* Left column — countdown (managed via admin) */}
        <div className="md:w-[18%] flex flex-col justify-center gap-3">
          <CountdownTimer />
        </div>

        {/* Right column — big exhibition banner image */}
        <Image
          src="https://media.base44.com/images/public/6a61ab9f086a714e89ee692d/fa4a1dc38_v-final-big.png"
          alt="הרגעים הריקים — תערוכה בנועא לידה שקטה ואובדן תינוק רך"
          className="w-full block"
          fittingType="fit"
          originWidth={832}
          originHeight={181}
        />
      </div>
    </section>
  );
}