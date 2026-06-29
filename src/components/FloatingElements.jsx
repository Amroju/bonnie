import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import AppleEmoji from './AppleEmoji';

// Increased red emojis (❤️, 🌹), removed pink and cherry
const ELEMENTS = ['❤️', '❤️', '🌹', '🌹', '✨', '🤍', '🍓', '🧸'];

function getSidePosition(i) {
  if (i % 2 === 0) return Math.random() * 26;
  return 74 + Math.random() * 26;
}

export default function FloatingElements({ visible = true }) {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const p = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      emoji: ELEMENTS[Math.floor(Math.random() * ELEMENTS.length)],
      left: getSidePosition(i),
      size: Math.random() * 1.2 + 0.7,
      duration: Math.random() * 15 + 15, // Slower: 15-30 seconds to cross the screen
      delay: Math.random() * 4,
    }));
    setParticles(p);
  }, []);

  if (!visible) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 1,
        overflow: 'hidden'
      }}
    >
      {particles.map((p) => (
        <motion.div
          key={p.id}
          style={{
            position: 'absolute',
            bottom: '-10%',
            left: `${p.left}%`,
            fontSize: '1.4rem',
            opacity: 0.55,
          }}
          initial={{ y: '0vh' }}
          animate={{ y: '-115vh' }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: 'linear'
          }}
        >
          <span style={{ transform: `scale(${p.size})`, display: 'inline-block' }}>
            <AppleEmoji emoji={p.emoji} />
          </span>
        </motion.div>
      ))}
    </motion.div>
  );
}
