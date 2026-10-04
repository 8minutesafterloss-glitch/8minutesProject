import React from 'react';
import { Image } from '@/components/ui/image';

export default function ExhibitionBanner() {
  return (
    <div className="w-full bg-white px-4">
      <Image src="https://media.base44.com/images/public/6a61ab9f086a714e89ee692d/387af007b__SMALL.png"

      alt="הרגעים הריקים — תערוכה בנושא לידה שקטה ואובדן תינוק רך"
      className="w-full rounded-xl"
      fittingType="fit"
      originWidth={832}
      originHeight={181} />
      
    </div>);

}