import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AppleEmoji from './AppleEmoji';

const JOKES = [
  { hint: "Citazioni storiche", punchline: <>Entrare al pub e dire "Fa caldo, che facciamo?". Un vero capolavoro. <AppleEmoji emoji="🍻" /></> },
  { hint: "Strategie geniali", punchline: <>Provare a ricordare il nome di un amico per mezz'ora e risolvere la crisi chiamandolo "Habibi". Una vera mossa da maestro. <AppleEmoji emoji="😂" /></> },
  { hint: "Titoli onorari", punchline: <>"Sei tu la responsabile dell'associazione?". La nostra figura migliore al ristorante. <AppleEmoji emoji="👩‍💼" /></> },
  { hint: "Verità assolute", punchline: <>La mia faccia sconvolta alla domanda del barista. L'acqua è "ovviamente naturale". Un dogma indiscutibile. <AppleEmoji emoji="💧" /></> },
];

export default function InsideJokes() {
  const [revealed, setRevealed] = useState([]);
  const [typing, setTyping] = useState(null);

  const handleReveal = (i) => {
    if (revealed.includes(i) || typing === i) return;
    setTyping(i);
    setTimeout(() => {
      setTyping(null);
      setRevealed(prev => [...prev, i]);
    }, 1200);
  };

  return (
    <section className="scrapbook-section" id="inside-jokes" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <motion.h2 
        className="scrapbook-title"
        initial={{ opacity: 0, scale: 1.1 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
      >
        Solo noi <AppleEmoji emoji="🤫" />
      </motion.h2>

      <div style={{
        background: 'rgba(255,255,255,0.6)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.4)',
        borderRadius: '24px',
        width: '100%',
        maxWidth: '450px',
        padding: '1.5rem 1rem',
        boxShadow: '0 8px 32px rgba(0,0,0,0.05)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.2rem'
      }}>
        {JOKES.map((joke, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {/* Incoming Message (Hint) */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              onClick={() => handleReveal(i)}
              style={{
                alignSelf: 'flex-start',
                background: '#e5e5ea',
                color: '#000',
                padding: '0.8rem 1.2rem',
                borderRadius: '18px',
                borderBottomLeftRadius: '4px',
                maxWidth: '80%',
                cursor: revealed.includes(i) ? 'default' : 'pointer',
                fontFamily: '"DM Sans", sans-serif',
                fontSize: '0.95rem',
                lineHeight: 1.4,
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
              }}
              whileHover={!revealed.includes(i) && typing !== i ? { scale: 1.02, background: '#d1d1d6' } : {}}
            >
              {joke.hint}
              {!revealed.includes(i) && typing !== i && (
                <span style={{ display: 'block', fontSize: '0.7rem', marginTop: '0.3rem', color: '#8e8e93' }}>Tocca per rispondere...</span>
              )}
            </motion.div>

            {/* Typing Indicator */}
            {typing === i && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, transformOrigin: 'bottom right' }}
                animate={{ opacity: 1, scale: 1 }}
                style={{
                  alignSelf: 'flex-end',
                  background: 'linear-gradient(135deg, #8B1A1A, #A52A2A)',
                  color: '#fff',
                  padding: '0.6rem 1rem',
                  borderRadius: '18px',
                  borderBottomRightRadius: '4px',
                  display: 'flex',
                  gap: '4px',
                  alignItems: 'center'
                }}
              >
                <motion.span animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} style={{ width: '6px', height: '6px', background: '#fff', borderRadius: '50%' }} />
                <motion.span animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} style={{ width: '6px', height: '6px', background: '#fff', borderRadius: '50%' }} />
                <motion.span animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} style={{ width: '6px', height: '6px', background: '#fff', borderRadius: '50%' }} />
              </motion.div>
            )}

            {/* Outgoing Message (Punchline) */}
            <AnimatePresence>
              {revealed.includes(i) && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, transformOrigin: 'bottom right' }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: 'spring', bounce: 0.4 }}
                  style={{
                    alignSelf: 'flex-end',
                    background: 'linear-gradient(135deg, #8B1A1A, #A52A2A)',
                    color: '#fff',
                    padding: '0.8rem 1.2rem',
                    borderRadius: '18px',
                    borderBottomRightRadius: '4px',
                    maxWidth: '85%',
                    fontFamily: '"DM Sans", sans-serif',
                    fontSize: '0.95rem',
                    lineHeight: 1.4,
                    boxShadow: '0 2px 5px rgba(139,26,26,0.2)'
                  }}
                >
                  {joke.punchline}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  );
}
