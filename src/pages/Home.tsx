import { useEffect } from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Suites from '../components/Suites';
import Legacy from '../components/Legacy';
import Features from '../components/Features';
import MenuCTA from '../components/MenuCTA';
import Location from '../components/Location';
import Footer from '../components/Footer';
import WhatsAppFAB from '../components/WhatsAppFAB';

export default function Home() {
  useEffect(() => {
    document.title =
      'Dallas Motel em Pitangueiras, SP | Privacidade, Conforto e Tradição';
  }, []);

  return (
    <>
      <Header />
      <main>
        <Hero />
        <Suites />
        <Legacy />
        <Features />
        <MenuCTA />
        <Location />
      </main>
      <Footer />
      <WhatsAppFAB />
    </>
  );
}
