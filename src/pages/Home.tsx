import Header from '../components/Header';
import Hero from '../components/Hero';
import Suites from '../components/Suites';
import Legacy from '../components/Legacy';
import Features from '../components/Features';
import Location from '../components/Location';
import Footer from '../components/Footer';
import WhatsAppFAB from '../components/WhatsAppFAB';

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Suites />
        <Legacy />
        <Features />
        <Location />
      </main>
      <Footer />
      <WhatsAppFAB />
    </>
  );
}
