import { useState } from 'react';
import { motion } from 'framer-motion';
import AppleEmoji from './AppleEmoji';

const QUALITIES = [
  { text: "il tuo grande cuore, che mi fa sentire quasi in imbarazzo per quanto sia immenso, anche quando non faccio nulla.", rotate: -4, color: "#FFFBCC" },
  { text: "la tua comprensione per le cose, che riesce sempre a sorprendermi.", rotate: 3, color: "#FFE6E6" },
  { text: "il fatto che tu prema per ogni minimo dettaglio o per qualsiasi parola io dica.", rotate: -2, color: "#E6F3FF" },
  { text: "il modo in cui mi guardi, come se fossi l'unico uomo al mondo per te.", rotate: 5, color: "#E6FFE6" },
  { text: "che tu sia pronta a fare qualsiasi cosa per le persone che ami.", rotate: -3, color: "#FFFBCC" },
  { text: "i tuoi occhi, il tuo sorriso e i tuoi messaggi vocali, che mi fanno sorridere involontariamente ogni volta che ci penso.", rotate: 4, color: "#FFE6E6" },
  { text: "il senso di sicurezza e serenità quando sono con te.", rotate: -5, color: "#E6F3FF" },
  { text: "le lettere e le cose che mi scrivevi senza che io te lo chiedessi.", rotate: 2, color: "#E6FFE6" },
  { text: "quella gioia inspiegabile che provavo ogni volta, fin dal primo istante in cui ti vedevo.", rotate: -4, color: "#FFFBCC" },
  { text: "come tu riesca a capire cosa provo senza che io dica una parola.", rotate: 3, color: "#FFE6E6" },
];

export default function Qualities() {
  const [stamped, setStamped] = useState({});

  const handleStamp = (index) => {
    if (!stamped[index]) {
      setStamped(prev => ({ ...prev, [index]: true }));
    }
  };

  return (
    <section className="scrapbook-section" id="qualities">
      <motion.h2 
        className="scrapbook-title"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        Cosa apprezzo di te...
      </motion.h2>
      
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5, duration: 1 }}
        style={{
          fontFamily: '"Cormorant Garamond", serif',
          fontStyle: 'italic',
          fontSize: '0.9rem',
          color: 'rgba(139,26,26,0.5)',
          textAlign: 'center',
          marginTop: '-1rem',
          marginBottom: '1rem'
        }}
      >
        (tocca i bigliettini per un bacio segreto)
      </motion.p>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
        gap: '2.5rem', 
        width: '100%', 
        maxWidth: '900px',
        paddingTop: '1rem'
      }}>
        {QUALITIES.map((q, i) => (
          <motion.div
            key={i}
            animate={{ 
              y: [0, -6, 0],
              rotate: [0, 1.5, -1.5, 0]
            }}
            transition={{
              duration: 5 + (i % 3),
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.2
            }}
            style={{ display: 'flex', justifyContent: 'center' }}
          >
            <motion.div
              className="sticky-note"
              style={{ backgroundColor: q.color, transform: `rotate(${q.rotate}deg)`, cursor: 'pointer', width: '100%' }}
              initial={{ opacity: 0, scale: 0.8, rotate: q.rotate - 10 }}
              whileInView={{ opacity: 1, scale: 1, rotate: q.rotate }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: (i % 3) * 0.15, type: 'spring' }}
              whileHover={{ scale: 1.05, rotate: 0, zIndex: 10 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleStamp(i)}
            >
              <div className="tape"></div>
              <p style={{ fontSize: '1.25rem', lineHeight: '1.4', position: 'relative', zIndex: 1 }}>{q.text}</p>
              
              {stamped[i] && (
                <motion.div
                  initial={{ scale: 3, opacity: 0, rotate: -30 }}
                  animate={{ scale: 1, opacity: 0.8, rotate: (i % 2 === 0 ? 15 : -15) }}
                  transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    marginTop: '-3rem',
                    marginLeft: '-3rem',
                    fontSize: '6rem',
                    pointerEvents: 'none',
                    zIndex: 2,
                    filter: 'drop-shadow(0 4px 8px rgba(139,26,26,0.2))'
                  }}
                >
                  <AppleEmoji emoji="💋" style={{ width: '1em', height: '1em' }} />
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
