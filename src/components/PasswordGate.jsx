import { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AppleEmoji from './AppleEmoji';

const CORRECT_PASSWORD = '03052025';

// ── Botanical corner SVG ─────────────────────────────────────────────────
function BotanicalCorner({ style }) {
  return (
    <svg
      viewBox="0 0 120 120"
      style={{
        position: 'absolute',
        width: 100,
        height: 100,
        opacity: 0.15,
        pointerEvents: 'none',
        ...style,
      }}
      fill="none"
    >
      <path d="M10 110 Q 10 10 110 10" stroke="#8B1A1A" strokeWidth="0.8" />
      <path d="M10 110 Q 32 58 72 28" stroke="#8B1A1A" strokeWidth="0.6" strokeDasharray="2 5" />
      <circle cx="72" cy="28" r="2.5" fill="#C4943A" opacity="0.7" />
      <circle cx="42" cy="64" r="1.8" fill="#8B1A1A" opacity="0.5" />
      <circle cx="20" cy="92" r="1.3" fill="#C4943A" opacity="0.4" />
      <path d="M72 28 Q 88 18 92 8"  stroke="#8B1A1A" strokeWidth="0.6" />
      <path d="M72 28 Q 82 40 98 34" stroke="#8B1A1A" strokeWidth="0.6" />
      <path d="M42 64 Q 52 52 60 56" stroke="#8B1A1A" strokeWidth="0.5" />
      <path d="M42 64 Q 28 56 24 44" stroke="#8B1A1A" strokeWidth="0.5" />
    </svg>
  );
}

// ── Single falling petal ─────────────────────────────────────────────────
function FallingPetal({ startX, delay, duration, size, color }) {
  return (
    <motion.div
      style={{
        position: 'absolute',
        top: -20,
        left: `${startX}%`,
        width: size,
        height: size * 0.6,
        borderRadius: '60% 40% 60% 40%',
        background: color,
        pointerEvents: 'none',
        zIndex: 0,
      }}
      initial={{ y: -20, x: 0, rotate: 0, opacity: 0 }}
      animate={{
        y: ['0vh', '105vh'],
        x: [0, 18, -12, 20, -8, 14, 0],
        rotate: [0, 45, 90, 135, 200, 260, 330],
        opacity: [0, 0.55, 0.55, 0.45, 0.35, 0],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'linear',
        times: [0, 0.08, 0.4, 0.6, 0.8, 1],
      }}
    />
  );
}

// ── Grain / noise texture overlay ────────────────────────────────────────
function GrainOverlay() {
  return (
    <svg
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 5,
        opacity: 0.055,
        mixBlendMode: 'overlay',
      }}
    >
      <filter id="grain">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.72"
          numOctaves="4"
          stitchTiles="stitch"
        />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#grain)" />
    </svg>
  );
}

export default function PasswordGate({ onUnlock }) {
   const [value,   setValue]   = useState('');
  const [error,   setError]   = useState(false);
  const [shake,   setShake]   = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [gameStep, setGameStep] = useState(-1);
  const [tapScale, setTapScale] = useState(1);
  const [pluckedPetals, setPluckedPetals] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  // Generate petals config once
  const petals = useMemo(() => Array.from({ length: 14 }, (_, i) => ({
    id: i,
    startX:   Math.random() * 100,
    delay:    Math.random() * 12,
    duration: 9 + Math.random() * 8,
    size:     5 + Math.random() * 7,
    color: i % 3 === 0
      ? 'rgba(196,148,58,0.55)'    // gold
      : i % 3 === 1
      ? 'rgba(139,26,26,0.45)'     // crimson
      : 'rgba(180,90,60,0.40)',    // in-between
  })), []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.trim() === CORRECT_PASSWORD) {
      setLeaving(true);
      setTimeout(onUnlock, 1050);
    } else {
      setShake(true);
      setError(true);
      setTimeout(() => setShake(false), 500);
      setTimeout(() => setError(false), 2600);
      setValue('');
    }
  };

  return (
    <AnimatePresence>
      {!leaving && (
        <motion.div
          key="gate"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            backgroundColor: '#FAECD0',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.07, filter: 'blur(10px)' }}
          transition={{ duration: 1.05, ease: [0.4, 0, 0.2, 1] }}
        >
          {/* ── Grain texture ── */}
          <GrainOverlay />

          {/* ── Falling petals ── */}
          {petals.map(p => <FallingPetal key={p.id} {...p} />)}

          {/* ── Botanical corners ── */}
          <BotanicalCorner style={{ top: 0, left: 0 }} />
          <BotanicalCorner style={{ top: 0, right: 0,  transform: 'scaleX(-1)' }} />
          <BotanicalCorner style={{ bottom: 0, left: 0,  transform: 'scaleY(-1)' }} />
          <BotanicalCorner style={{ bottom: 0, right: 0, transform: 'scale(-1,-1)' }} />

          {/* ── Pulse rings behind flower ── */}
          {[340, 275, 210].map((size, i) => (
            <motion.div
              key={size}
              style={{
                position: 'absolute',
                width:  size,
                height: size,
                borderRadius: '50%',
                border: `1px solid rgba(196,148,58,${0.16 - i * 0.04})`,
                pointerEvents: 'none',
              }}
              animate={{ scale: [1, 1.05, 1], opacity: [0.6, 1, 0.6] }}
              transition={{
                duration: 4 + i * 0.8,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.6,
              }}
            />
          ))}

          {/* ── Main content ── */}
          <motion.div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '100%',
              maxWidth: 400,
              padding: '0 2rem',
              position: 'relative',
              zIndex: 10,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* ── Roman numeral date header ── */}
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.8 }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.3rem',
                marginBottom: '0.5rem',
              }}
            >
              {/* top line ornament */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div style={{ height: 1, width: 28, background: 'linear-gradient(to right, transparent, rgba(196,148,58,0.3))' }} />
                <motion.span
                  style={{ fontSize: '0.55rem', color: 'rgba(196,148,58,0.5)', letterSpacing: '0.15em' }}
                  animate={{ opacity: [0.5, 0.85, 0.5] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >✦ ✦ ✦</motion.span>
                <div style={{ height: 1, width: 28, background: 'linear-gradient(to left, transparent, rgba(196,148,58,0.3))' }} />
              </div>

              {/* Witty romantic Italian header */}
              <motion.p
                style={{
                  fontFamily: '"Cormorant Garamond", serif',
                  fontStyle: 'italic',
                  fontSize: 'clamp(1.1rem, 4vw, 1.35rem)',
                  letterSpacing: '0.06em',
                  color: 'rgba(139,26,26,0.65)',
                  fontWeight: 400,
                  textAlign: 'center',
                  lineHeight: 1,
                  marginTop: '0.25rem'
                }}
                animate={{ opacity: [0.7, 0.9, 0.7] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              >
                Tanto amore, zero bug
              </motion.p>
            </motion.div>

            {/* ── Flower ── responsive size & interactive game ── */}
            <motion.div
              onClick={() => {
                if (gameStep >= 0 && gameStep < 5) {
                  setGameStep(s => s + 1);
                  setTapScale(0.9);
                  setTimeout(() => setTapScale(1), 150);
                  
                  // Spawn a falling petal for the "pluck" effect
                  setPluckedPetals(prev => [...prev, {
                    id: Date.now(),
                    xOffset: (Math.random() - 0.5) * 80,
                    rotation: Math.random() * 360,
                    xTarget: (Math.random() - 0.5) * 120
                  }]);
                }
              }}
              style={{
                position: 'relative',
                width: 'min(300px, 82vw)',
                height: 'min(300px, 82vw)',
                flexShrink: 0,
                cursor: (gameStep >= 0 && gameStep < 5) ? 'pointer' : 'default',
                WebkitTapHighlightColor: 'transparent',
              }}
              initial={{ opacity: 0, scale: 0.78, rotate: -10 }}
              animate={{ opacity: 1, scale: tapScale, rotate: 0 }}
              transition={{ delay: 0.28, duration: 1.0, ease: [0.34, 1.05, 0.64, 1] }}
            >
              {/* Soft shadow */}
              <div style={{
                position: 'absolute',
                bottom: '2%', left: '12%', right: '12%',
                height: '25%',
                background: 'radial-gradient(ellipse, rgba(139,26,26,0.16) 0%, transparent 70%)',
                filter: 'blur(18px)',
                pointerEvents: 'none',
              }} />

              {/* Gold shimmer behind */}
              <motion.div
                style={{
                  position: 'absolute',
                  inset: '8%',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(196,148,58,0.22) 0%, transparent 65%)',
                  filter: 'blur(20px)',
                  pointerEvents: 'none',
                }}
                animate={{ opacity: [0.6, 1, 0.6], scale: [0.95, 1.05, 0.95] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              />

              <motion.img
                src="/rose.png"
                alt=""
                aria-hidden="true"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  mixBlendMode: 'multiply',
                  position: 'relative',
                  zIndex: 1,
                  filter: 'drop-shadow(0 6px 20px rgba(139,26,26,0.22))',
                }}
                animate={{
                  rotate: [-1.5, 1.5, -1.5],
                  scale:  [1,    1.025, 1],
                  y:      [0,   -5,    0],
                }}
                transition={{
                  duration: 7,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />

              {/* Plucked Petals Layer */}
              <AnimatePresence>
                {pluckedPetals.map(petal => (
                  <motion.div
                    key={petal.id}
                    initial={{ 
                      opacity: 1, 
                      top: '40%', 
                      left: `calc(50% + ${petal.xOffset}px)`, 
                      scale: 0.4 + Math.random() * 0.3, 
                      rotate: petal.rotation 
                    }}
                    animate={{ 
                      opacity: 0, 
                      top: '130%', 
                      left: `calc(50% + ${petal.xOffset + petal.xTarget}px)`, 
                      rotate: petal.rotation + 180 + Math.random() * 90
                    }}
                    transition={{ duration: 1.5, ease: 'easeIn' }}
                    style={{
                      position: 'absolute',
                      width: 25,
                      height: 25,
                      background: 'rgba(139,26,26,0.7)',
                      borderRadius: '50% 0 50% 50%',
                      zIndex: 20,
                      pointerEvents: 'none'
                    }}
                  />
                ))}
              </AnimatePresence>
            </motion.div>

            {/* ── Decorative dot separator ── */}
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ delay: 0.85, duration: 0.8, ease: 'easeOut' }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                margin: '0.6rem 0 1rem',
              }}
            >
              <div style={{ flex: 1, height: 1, background: 'linear-gradient(to right, transparent, rgba(196,148,58,0.2))' }} />
              {[0, 1, 2].map(i => (
                <motion.div
                  key={i}
                  style={{
                    width: i === 1 ? 5 : 3.5,
                    height: i === 1 ? 5 : 3.5,
                    borderRadius: '50%',
                    background: i === 1 ? 'rgba(139,26,26,0.45)' : 'rgba(196,148,58,0.45)',
                    flexShrink: 0,
                  }}
                  animate={{ scale: [1, 1.4, 1], opacity: [0.45, 0.85, 0.45] }}
                  transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.4, ease: 'easeInOut' }}
                />
              ))}
              <div style={{ flex: 1, height: 1, background: 'linear-gradient(to left, transparent, rgba(196,148,58,0.2))' }} />
            </motion.div>

            {/* ── Form / Game UI ── */}
            <AnimatePresence mode="wait">
              {gameStep === -1 ? (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                >
                  {/* Input */}
                  <motion.div
                    style={{ position: 'relative' }}
                    animate={shake ? { x: [-9, 9, -7, 7, -4, 4, 0] } : { x: 0 }}
                    transition={{ duration: 0.45 }}
                  >
                    <input
                      ref={inputRef}
                      type="password"
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      placeholder="Se sbagli la data il sito si autodistruggera'"
                      autoComplete="off"
                      spellCheck={false}
                      id="gate-input"
                      style={{
                        width: '100%',
                        background: 'rgba(250,236,208,0.5)',
                        border: `1.5px solid ${error ? 'rgba(139,26,26,0.7)' : 'rgba(196,148,58,0.55)'}`,
                        borderRadius: 10,
                        padding: '0.9rem 3rem 0.9rem 1.1rem',
                        fontFamily: '"DM Sans", sans-serif',
                        fontSize: '16px', // 16px explicitly prevents iOS auto-zoom on focus
                        color: '#3D1F10',
                        outline: 'none',
                        letterSpacing: '0.01em',
                        boxShadow: error ? '0 0 0 3px rgba(139,26,26,0.10)' : '0 2px 8px rgba(196,148,58,0.08)',
                        transition: 'border-color 0.25s, box-shadow 0.25s',
                      }}
                    />
                    <span style={{
                      position: 'absolute',
                      right: '0.9rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      fontSize: '0.95rem',
                      pointerEvents: 'none',
                      color: error ? 'rgba(139,26,26,0.8)' : 'rgba(196,148,58,0.75)',
                      transition: 'color 0.25s',
                    }}>
                      {error ? '✕' : '🔒'}
                    </span>
                  </motion.div>

                  {/* Error message */}
                  <AnimatePresence>
                    {error && (
                      <motion.p
                        initial={{ opacity: 0, y: -4, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        style={{
                          fontFamily: '"Cormorant Garamond", serif',
                          fontStyle: 'italic',
                          fontSize: '0.84rem',
                          color: 'rgba(139,26,26,0.75)',
                          textAlign: 'center',
                        }}
                      >
                        Non è corretto — riprova <AppleEmoji emoji="🌹" />
                      </motion.p>
                    )}
                  </AnimatePresence>

                  {/* Interactive Game Trigger */}
                  <button
                    type="button"
                    onClick={() => setGameStep(0)}
                    style={{
                      background: 'none',
                      border: 'none',
                      fontFamily: '"Cormorant Garamond", serif',
                      fontStyle: 'italic',
                      fontSize: '0.78rem',
                      color: 'rgba(139,26,26,0.6)',
                      cursor: 'pointer',
                      textAlign: 'center',
                      marginTop: '0.2rem',
                      marginBottom: '0.2rem',
                      textDecoration: 'underline',
                      textUnderlineOffset: '2px',
                      outline: 'none',
                      WebkitTapHighlightColor: 'transparent',
                    }}
                  >
                    Hai dimenticato? Male, molto male...
                  </button>

                  {/* Unlock button */}
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02, boxShadow: '0 8px 28px rgba(139,26,26,0.38)' }}
                    whileTap={{ scale: 0.97 }}
                    style={{
                      width: '100%',
                      background: 'linear-gradient(135deg, #8B1A1A 0%, #6B1212 100%)',
                      color: '#FAECD0',
                      border: 'none',
                      borderRadius: 10,
                      padding: '0.95rem',
                      fontFamily: '"DM Sans", sans-serif',
                      fontWeight: 500,
                      fontSize: '0.76rem',
                      letterSpacing: '0.24em',
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                      boxShadow: '0 4px 18px rgba(139,26,26,0.28)',
                      transition: 'box-shadow 0.25s',
                    }}
                  >
                    Entra
                  </motion.button>

                  {/* Hint */}
                  <p style={{
                    fontFamily: '"Cormorant Garamond", serif',
                    fontStyle: 'italic',
                    fontSize: '0.76rem',
                    color: 'rgba(92,26,26,0.38)',
                    textAlign: 'center',
                    letterSpacing: '0.04em',
                    marginTop: '0.5rem',
                  }}>
                    Formato: GGMMAAAA
                  </p>
                </motion.form>
              ) : (
                <motion.div
                  key="game"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.4 }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '1rem',
                    marginTop: '0.5rem',
                    minHeight: '180px',
                    justifyContent: 'center',
                  }}
                >
                  <motion.p
                    key={gameStep}
                    initial={{ opacity: 0, scale: 0.9, y: 5 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                    style={{
                      fontFamily: '"Cormorant Garamond", serif',
                      fontStyle: 'italic',
                      fontSize: gameStep === 5 ? '1.15rem' : '1.35rem',
                      color: gameStep === 5 ? 'rgba(196,148,58,0.95)' : 'rgba(139,26,26,0.85)',
                      textAlign: 'center',
                      lineHeight: 1.4,
                      margin: 0,
                      padding: '0 1rem',
                    }}
                  >
                    {gameStep === 0 && "Tocca la rosa... vediamo se te lo meriti."}
                    {gameStep === 1 && "Mi ama..."}
                    {gameStep === 2 && "Non mi ama..."}
                    {gameStep === 3 && "Mi ama..."}
                    {gameStep === 4 && "Non mi ama..."}
                    {gameStep === 5 && (
                      <>
                        <span style={{ display: 'block', marginBottom: '0.5rem' }}>forse si mi ama <AppleEmoji emoji="💖" /></span>
                        <span style={{ fontSize: '0.85rem', color: 'rgba(139,26,26,0.7)', letterSpacing: '0.05em' }}>
                          Indizio: Il giorno in cui tutto è iniziato
                        </span>
                      </>
                    )}
                  </motion.p>

                  {gameStep === 5 && (
                    <motion.button
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      onClick={() => setGameStep(-1)}
                      style={{
                        background: 'none',
                        border: '1px solid rgba(196,148,58,0.4)',
                        borderRadius: 20,
                        padding: '0.5rem 1.2rem',
                        fontFamily: '"DM Sans", sans-serif',
                        fontSize: '0.65rem',
                        letterSpacing: '0.15em',
                        textTransform: 'uppercase',
                        color: 'rgba(139,26,26,0.8)',
                        cursor: 'pointer',
                        marginTop: '0.5rem',
                        WebkitTapHighlightColor: 'transparent',
                      }}
                    >
                      Torna al login
                    </motion.button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* ── Bottom signature ── */}
          <motion.p
            style={{
              position: 'absolute',
              bottom: '1.5rem',
              fontFamily: '"Cormorant Garamond", serif',
              fontStyle: 'italic',
              fontSize: '0.7rem',
              letterSpacing: '0.28em',
              color: 'rgba(139,26,26,0.22)',
              pointerEvents: 'none',
            }}
            animate={{ opacity: [0.22, 0.42, 0.22] }}
            transition={{ duration: 5, repeat: Infinity }}
          >
            ✦ &nbsp; solo per i nostri occhi &nbsp; ✦
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
