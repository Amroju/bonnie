import { motion } from 'framer-motion';
import AppleEmoji from './AppleEmoji';

const REMINDERS = [
  { emoji: "🌃", title: "In due sul monopattino", desc: "L'aria fredda e tu dietro che ti tieni forte." },
  { emoji: "✨", title: "Profumo di vaniglia", desc: "Impossibile non pensarti ogni volta che lo sento." },
  { emoji: "🍜", title: "Quell'Udon...", desc: "Ogni volta che vedo un ristorante asiatico, mi torni in mente tu." },
  { emoji: "🐕", title: "Quel cane per strada...", desc: 'Lo vedo e penso subito: "Quanto vorrei che fosse qui a vederlo".' },
  { emoji: "🌙", title: "La tua voce di notte", desc: "Quella che accorciava le distanze quando eri lontana." },
  { emoji: "🌧️", title: "La pioggia a Padova", desc: "E il meteo che ci odia sempre." },
  { emoji: "🎵", title: "Quella playlist infinita", desc: "Ci sono così tante canzoni in giro che mi parlano letteralmente di te." },
  { emoji: "🇮🇹", title: "Sentire l'italiano", desc: "Lo parlo lo sento tutti i giorni, ma la prima persona a cui lo associo sei sempre tu." },
];

export default function Reminders() {
  return (
    <section className="scrapbook-section" id="reminders" style={{ background: 'rgba(255,255,255,0.2)' }}>
      <motion.h2 
        className="scrapbook-title"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        style={{ marginBottom: '0.5rem' }}
      >
        Cose che mi ricordano te
      </motion.h2>
      
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
        style={{
          textAlign: 'center',
          fontFamily: '"DM Sans", sans-serif',
          fontSize: '0.95rem',
          color: 'rgba(61,31,16,0.6)',
          maxWidth: '500px',
          margin: '0 auto 2.5rem auto',
          fontStyle: 'italic',
          lineHeight: 1.4
        }}
      >
        (In realtà potrei fare una lista infinita, ma poi il server del sito esplode... quindi eccone solo alcune!)
      </motion.p>

      <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: '1.5rem', width: '100%', maxWidth: '800px' }}>
        {REMINDERS.map((r, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40, rotate: (i % 2 === 0 ? -15 : 15) }}
            whileInView={{ opacity: 1, y: 0, rotate: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, delay: i * 0.1, type: 'spring', bounce: 0.4 }}
            style={{ display: 'flex' }}
          >
            <motion.div
              animate={{ y: [0, (i % 2 === 0 ? -8 : -12), 0] }}
              transition={{ duration: 3.5 + (i % 3), repeat: Infinity, ease: 'easeInOut', delay: i * 0.2 }}
              whileHover={{ 
                scale: 1.12, 
                rotate: (i % 2 === 0 ? 4 : -4),
                boxShadow: '0 15px 35px rgba(139,26,26,0.2)',
                background: 'rgba(255, 255, 255, 0.95)'
              }}
              style={{
                background: 'rgba(255, 255, 255, 0.7)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: '1px solid rgba(255,255,255,0.5)',
                padding: '1.8rem 1.2rem',
                borderRadius: '24px',
                boxShadow: '0 8px 25px rgba(0,0,0,0.06)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                width: '150px',
                cursor: 'pointer'
              }}
            >
              <motion.div 
                style={{ fontSize: '3.5rem', marginBottom: '0.8rem', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))' }}
                whileHover={{ scale: 1.2, rotate: (i % 2 === 0 ? -10 : 10) }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <AppleEmoji emoji={r.emoji} style={{ width: '1em', height: '1em' }} />
              </motion.div>
              <h3 style={{ fontFamily: "'Dancing Script', cursive", color: 'var(--crimson)', fontSize: '1.4rem', marginBottom: '0.4rem', lineHeight: 1.1 }}>{r.title}</h3>
              <p style={{ fontSize: '0.85rem', color: 'rgba(61,31,16,0.7)', lineHeight: 1.3 }}>{r.desc}</p>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
