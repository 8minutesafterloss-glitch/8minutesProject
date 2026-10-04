import React from 'react';
import Navbar from '@/components/landing/Navbar';
import ExhibitionHeroBanner from '@/components/landing/ExhibitionHeroBanner';
import Hero from '@/components/landing/Hero';
import About from '@/components/landing/About';
import Goals from '@/components/landing/Goals';
import EmptyMoments from '@/components/landing/EmptyMoments';
import HowItWorks from '@/components/landing/HowItWorks';
import WhatYoullFind from '@/components/landing/WhatYoullFind';
import Quote from '@/components/landing/Quote';
import CtaSection from '@/components/landing/CtaSection';
import Footer from '@/components/landing/Footer';
import { HomeContentProvider } from '@/hooks/useHomeContent';

export default function Home() {
  return (
    <HomeContentProvider>
      <div className="min-h-screen bg-white">
        <Navbar />
        <ExhibitionHeroBanner />
        <main>
          <Hero />
          <About />
          <Goals />
          <HowItWorks />
          <EmptyMoments />
          <WhatYoullFind />
          <Quote />
          <CtaSection />
        </main>
        <Footer />
      </div>
    </HomeContentProvider>
  );
}