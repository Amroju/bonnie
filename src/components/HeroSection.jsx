import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

const FULL_TEXT = "Ci sono cose che non sono riuscito a dirti.\nQuesto è il mio modo di provarci.";
const SUBTITLE = "L'ho costruito pensando a te, sperando che lo sentissi.";

function TypewriterText({ text, start = false, onDone }) {
  const [displayed, setDisplayed] = useState('');

  useEffect(() => {
    if (!start) return;
    if (displayed.length >= text.length) {
      onDone && onDone();
      return;
    }
    const t = setTimeout(() => {
      setDisplayed(text.slice(0, displayed.length + 1));
    }, 38);
    return () => clearTimeout(t);
  }, [start, displayed, text, onDone]);

  return (
    <span>
      {displayed.split('\n').map((line, i) => (
        <span key={i}>
          {i > 0 && <br />}
          {line}
        </span>
      ))}
      {displayed.length < text.length && start && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.6, repeat: Infinity }}
          style={{ borderRight: '2px solid #8B1A1A', marginLeft: '2px' }}
        />
      )}
    </span>
  );
}

const ROSES_CONFIG = [
  { w: 250, top: '-5%', left: '-10%', rot: 135, blur: 2, op: 0.15 },
  { w: 320, bottom: '-10%', right: '-15%', rot: -45, blur: 3, op: 0.12 },
  { w: 180, top: '15%', right: '-5%', rot: -110, blur: 4, op: 0.1 },
  { w: 220, bottom: '20%', left: '-8%', rot: 45, blur: 2, op: 0.1 },
  { w: 150, top: '5%', left: '40%', rot: 20, blur: 5, op: 0.08 },
  { w: 190, bottom: '-5%', left: '30%', rot: -20, blur: 4, op: 0.08 }
];

function FloatingRoses() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5 }}
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}
    >
      {ROSES_CONFIG.map((r, i) => (
        <motion.img
          key={i}
          src="/rose.png"
          style={{
            position: 'absolute',
            width: r.w,
            top: r.top,
            bottom: r.bottom,
            left: r.left,
            right: r.right,
            opacity: r.op,
            filter: `blur(${r.blur}px)`,
            transformOrigin: 'center'
          }}
          animate={{
            rotate: [r.rot, r.rot + 15, r.rot],
            y: [0, -15, 0],
            x: [0, 10, 0]
          }}
          transition={{ duration: 15 + i * 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </motion.div>
  );
}

export default function HeroSection({ onOpen }) {
  const [stage, setStage] = useState('sealed'); // sealed, opening, opened
  const [typingDone, setTypingDone] = useState(false);

  const handleOpen = () => {
    if (stage !== 'sealed') return;
    setStage('opening');
    onOpen && onOpen();
    setTimeout(() => {
      setStage('opened');
    }, 900);
  };

  return (
    <section
      id="home"
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 1.5rem',
        position: 'relative',
        overflow: 'hidden',
        textAlign: 'center',
      }}
    >
      {/* Avatar - hidden during envelope, shown when opened */}
      <AnimatePresence>
        {stage === 'opened' && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.4 }}
            style={{ marginBottom: '3.5rem', position: 'relative' }}
          >
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                style={{
                  position: 'absolute',
                  inset: '-12px',
                  borderRadius: '50%',
                  border: '1px dashed rgba(196,148,58,0.4)',
                  pointerEvents: 'none',
                }}
              />
              <img
                src="/video-avatar.gif"
                alt="Avatar"
                style={{
                  width: 'min(300px, 68vw)',
                  height: 'min(300px, 68vw)',
                  objectFit: 'contain',
                  borderRadius: '50%',
                  border: '3px solid rgba(196,148,58,0.5)',
                  padding: '6px',
                  background: 'rgba(255,255,255,0.6)',
                  position: 'relative',
                  zIndex: 1
                }}
              />
            </div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.9 }}
              style={{
                fontFamily: '"Dancing Script", cursive',
                fontSize: '1.4rem',
                color: '#8B1A1A',
                marginTop: '0.4rem',
                opacity: 0.85
              }}
            >
              Creato apposta per te
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ position: 'relative', width: '100%', maxWidth: '600px', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, perspective: '1200px' }}>
        
        {/* Gold Shimmer Behind Envelope (Matching Rose) */}
        <AnimatePresence>
          {stage === 'sealed' && (
            <>
              <motion.div
                exit={{ opacity: 0, scale: 0.8 }}
                style={{
                  position: 'absolute',
                  width: '600px',
                  height: '600px',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(196,148,58,0.2) 0%, rgba(196,148,58,0.05) 40%, transparent 65%)',
                  pointerEvents: 'none',
                  zIndex: 0,
                }}
                animate={{ opacity: [0.4, 0.8, 0.4], scale: [0.9, 1.05, 0.9] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              />
              <FloatingRoses />
            </>
          )}
        </AnimatePresence>

        {/* The Envelope */}
        <AnimatePresence>
          {stage !== 'opened' && (
            <motion.div
              exit={{ opacity: 0, scale: 0.9, y: -30 }}
              transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
              style={{
                position: 'relative',
                marginTop: '-5vh', // Lift envelope up slightly
                width: '95%',
                maxWidth: '480px',
                aspectRatio: '480 / 340', // Taller, more substantial proportion
                cursor: stage === 'sealed' ? 'pointer' : 'default',
                zIndex: 10,
                boxShadow: '0 15px 35px rgba(139,26,26,0.3)',
                borderRadius: '8px'
              }}
              onClick={handleOpen}
              whileHover={stage === 'sealed' ? { scale: 1.02, boxShadow: '0 25px 45px rgba(139,26,26,0.45)' } : {}}
            >
              {/* Back of Envelope (Inside Depth) */}
              <div style={{ position: 'absolute', inset: 0, background: '#d1c7b1', borderRadius: '8px' }} />

              {/* Side and Bottom Flaps (SVG) */}
              <svg viewBox="0 0 480 340" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 3, pointerEvents: 'none' }}>
                <defs>
                  <linearGradient id="sideGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#f4ebd8" />
                    <stop offset="100%" stopColor="#e3d6b8" />
                  </linearGradient>
                  <linearGradient id="bottomGrad" x1="0" y1="1" x2="0" y2="0">
                    <stop offset="0%" stopColor="#fdfbf7" />
                    <stop offset="100%" stopColor="#e8dcc4" />
                  </linearGradient>
                </defs>
                {/* Left Flap */}
                <path d="M 0,0 L 210,170 L 0,340 Z" fill="url(#sideGrad)" />
                {/* Right Flap */}
                <path d="M 480,0 L 270,170 L 480,340 Z" fill="url(#sideGrad)" />
                {/* Bottom Flap with rounded tip */}
                <path d="M 0,340 L 480,340 L 260,185 Q 240,165 220,185 Z" fill="url(#bottomGrad)" />
              </svg>

              {/* Top Flap Container */}
              <motion.div
                initial={{ scaleY: 0 }}
                animate={{ scaleY: stage === 'opening' ? -1 : 1 }}
                transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
                style={{
                  position: 'absolute', inset: 0,
                  transformOrigin: 'top',
                  zIndex: 5,
                  transformBox: 'fill-box',
                }}
              >
                <svg viewBox="0 0 480 340" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
                  <defs>
                    <linearGradient id="topGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#fdfbf7" />
                      <stop offset="100%" stopColor="#eae0c8" />
                    </linearGradient>
                  </defs>
                  {/* Elegant curved top flap */}
                  <path d="M 0,0 L 480,0 L 270,180 Q 240,210 210,180 Z" fill="url(#topGrad)" />
                </svg>
              </motion.div>

              {/* Wax Seal */}
              <AnimatePresence>
                {stage === 'sealed' && (
                  <motion.div
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: '65px',
                      height: '65px',
                      background: 'radial-gradient(circle at 30% 30%, #9C1D1D, #8B1A1A, #5c0e0e)',
                      borderRadius: '50%',
                      zIndex: 6,
                      boxShadow: '0 4px 10px rgba(0,0,0,0.2), inset 0 2px 4px rgba(255,255,255,0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'rgba(255,255,255,0.9)',
                      fontFamily: '"Dancing Script", cursive',
                      fontSize: '2rem',
                      userSelect: 'none'
                    }}
                  >
                    B
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Instruction Text */}
              <AnimatePresence>
                {stage === 'sealed' && (
                  <motion.div
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                    exit={{ opacity: 0 }}
                    style={{
                      position: 'absolute',
                      bottom: '-50px',
                      width: '100%',
                      color: 'rgba(61,31,16,0.8)',
                      fontFamily: '"Cormorant Garamond", serif',
                      fontStyle: 'italic',
                      fontSize: '1.25rem',
                      fontWeight: 400,
                      pointerEvents: 'none'
                    }}
                  >
                    Tocca per aprire...
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {/* The Letter */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ 
            y: stage === 'opened' ? 0 : 30, 
            opacity: stage === 'opened' ? 1 : 0,
            zIndex: stage === 'opened' ? 20 : 2
          }}
          transition={{ duration: 0.65, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{
            position: 'absolute',
            width: '100%',
            padding: '2rem 2.2rem',
            background: 'rgba(255,255,255,0.65)',
            backdropFilter: 'blur(12px)',
            borderRadius: '2px',
            boxShadow: '0 8px 40px rgba(139,26,26,0.08), 0 2px 8px rgba(0,0,0,0.04)',
            overflow: 'hidden',
            pointerEvents: stage === 'opened' ? 'auto' : 'none'
          }}
        >
          {/* Glass Shine Effect */}
          <motion.div
            animate={{ left: ['-100%', '200%'] }}
            transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 6, ease: 'easeInOut' }}
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              width: '150px',
              background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.9), transparent)',
              transform: 'skewX(-25deg)',
              pointerEvents: 'none',
              zIndex: 0,
            }}
          />
          
          {/* Corner decorations */}
          {['top-left','top-right','bottom-left','bottom-right'].map((corner) => {
            const isTop = corner.includes('top');
            const isLeft = corner.includes('left');
            return (
              <div key={corner} style={{
                position: 'absolute',
                top: isTop ? 10 : 'auto',
                bottom: isTop ? 'auto' : 10,
                left: isLeft ? 10 : 'auto',
                right: isLeft ? 'auto' : 10,
                width: 18,
                height: 18,
                borderTop: isTop ? '1.5px solid rgba(196,148,58,0.7)' : 'none',
                borderBottom: !isTop ? '1.5px solid rgba(196,148,58,0.7)' : 'none',
                borderLeft: isLeft ? '1.5px solid rgba(196,148,58,0.7)' : 'none',
                borderRight: !isLeft ? '1.5px solid rgba(196,148,58,0.7)' : 'none',
                zIndex: 1,
              }} />
            );
          })}

          {/* Salutation */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={stage === 'opened' ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: 'italic',
              fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)',
              color: '#C4943A',
              marginBottom: '1.5rem',
              letterSpacing: '0.05em',
              position: 'relative',
              zIndex: 1,
            }}
          >
            ✦ &nbsp; Luna mia &nbsp; ✦
          </motion.p>

          {/* Typewriter main text */}
          <h1
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(1.6rem, 5vw, 2.8rem)',
              fontWeight: 300,
              color: '#3D1F10',
              lineHeight: 1.35,
              marginBottom: '1.8rem',
              minHeight: '4em',
              position: 'relative',
              zIndex: 1,
            }}
          >
            <TypewriterText
              text={FULL_TEXT}
              start={stage === 'opened'}
              onDone={() => setTypingDone(true)}
            />
          </h1>

          {/* Gold divider */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={typingDone ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            style={{
              height: '1px',
              background: 'linear-gradient(90deg, transparent, #C4943A, transparent)',
              marginBottom: '1.5rem',
              transformOrigin: 'center',
              position: 'relative',
              zIndex: 1,
            }}
          />

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={typingDone ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: 'italic',
              fontSize: 'clamp(0.95rem, 2.5vw, 1.2rem)',
              color: 'rgba(61,31,16,0.65)',
              lineHeight: 1.7,
              position: 'relative',
              zIndex: 1,
            }}
          >
            {SUBTITLE}
          </motion.p>

          {/* Signature */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={typingDone ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 1, delay: 0.9 }}
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: 'italic',
              fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
              color: '#8B1A1A',
              marginTop: '2rem',
              textAlign: 'right',
              position: 'relative',
              zIndex: 1,
            }}
          >
            — con amore ♡
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
