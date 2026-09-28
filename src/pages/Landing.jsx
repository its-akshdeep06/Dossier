import { useEffect } from 'react';
import PageTransition from '@/components/shared/PageTransition';
import LandingNav from '@/components/landing/LandingNav';
import Hero from '@/components/landing/Hero';
import Marquee from '@/components/landing/Marquee';
import StoryScroll from '@/components/landing/StoryScroll';
import Principles from '@/components/landing/Principles';
import FinalCta from '@/components/landing/FinalCta';

export default function Landing() {
  useEffect(() => { document.title = 'Dossier — read any GitHub profile'; }, []);
  return (
    <PageTransition>
      <LandingNav />
      <main>
        <Hero />
        <Marquee />
        <StoryScroll />
        <Principles />
        <FinalCta />
      </main>
    </PageTransition>
  );
}