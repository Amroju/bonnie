import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import PasswordGate  from './components/PasswordGate';
import HeroSection   from './components/HeroSection';
import FloatingElements from './components/FloatingElements';
import Qualities     from './components/Qualities';
import Gallery       from './components/Gallery';
import Reminders     from './components/Reminders';
import InsideJokes   from './components/InsideJokes';
import MusicPlayer   from './components/MusicPlayer';

function Footer() {
  return (
    <footer className="site-footer" style={{ padding: '4rem 1.5rem', textAlign: 'center', position: 'relative', zIndex: 10 }}>
      <div className="gold-rule" style={{ margin: '0 auto' }} />
      <motion.p
        initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }}
        transition={{ duration:1 }} style={{ marginTop:'1.5rem', fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', fontSize: '1.2rem', color: 'rgba(61,31,16,0.8)' }}
      >
        Fatto con <span style={{ color: '#8B1A1A' }}>♡</span> per te
      </motion.p>
      <motion.p
        initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }}
        transition={{ duration:1, delay:0.3 }}
        style={{ marginTop:'0.8rem', fontSize:'0.7rem', letterSpacing:'0.25em', color:'rgba(61,31,16,0.3)', textTransform: 'uppercase' }}
      >
        ✦ &nbsp; Solo per i nostri occhi &nbsp; ✦
      </motion.p>
    </footer>
  );
}

export default function App() {
  const [unlocked, setUnlocked] = useState(false);
  const [envelopeOpened, setEnvelopeOpened] = useState(false);
  const [showMusicPlayer, setShowMusicPlayer] = useState(false);

  useEffect(() => {
    if (!unlocked) return;
    const handleScroll = () => {
      // Show music player when scrolled past half the hero section height
      if (window.scrollY > window.innerHeight * 0.5) {
        setShowMusicPlayer(true);
      } else {
        setShowMusicPlayer(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [unlocked]);

  return (
    <>
      <AnimatePresence>
        {!unlocked && <PasswordGate onUnlock={() => setUnlocked(true)} />}
      </AnimatePresence>

      <AnimatePresence>
        {unlocked && (
          <motion.div
            className="main-bg"
            initial={{ opacity:0 }}
            animate={{ opacity:1 }}
            transition={{ duration:1.1, ease:'easeOut' }}
            style={{ position: 'relative' }}
          >
            <FloatingElements visible={envelopeOpened} />
            <div style={{ position: 'relative', zIndex: 10 }}>
              <HeroSection onOpen={() => setEnvelopeOpened(true)} />
              <Qualities />
              <Gallery />
              <Reminders />
              <InsideJokes />
              <Footer />
            </div>
            <MusicPlayer visible={showMusicPlayer} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
