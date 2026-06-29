import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AppleEmoji from './AppleEmoji';
import confetti from 'canvas-confetti';

const EMOJIS = ["🍜", "✨", "🐕", "🌙", "🌧️", "🎵", "🇮🇹", "🍕"];

export default function MemoryGame() {
  const [cards, setCards] = useState([]);
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [moves, setMoves] = useState(0);
  const [isWon, setIsWon] = useState(false);

  // Initialize and shuffle cards
  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = () => {
    const shuffledEmojis = [...EMOJIS, ...EMOJIS]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({ id: index, emoji }));
    
    setCards(shuffledEmojis);
    setFlippedIndices([]);
    setMatchedPairs(0);
    setMoves(0);
    setIsWon(false);
  };

  const handleCardClick = (index) => {
    // Prevent clicking if won, if 2 cards already flipped, or if clicking the same card/matched card
    if (isWon || flippedIndices.length >= 2 || flippedIndices.includes(index)) return;
    
    // Also check if already matched
    if (cards[index].isMatched) return;

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      const [firstIndex, secondIndex] = newFlipped;
      
      if (cards[firstIndex].emoji === cards[secondIndex].emoji) {
        // Match found!
        setMatchedPairs(prev => prev + 1);
        setFlippedIndices([]);
        
        // Update cards to mark them as matched
        const newCards = [...cards];
        newCards[firstIndex].isMatched = true;
        newCards[secondIndex].isMatched = true;
        setCards(newCards);
        
        // Check win condition
        if (matchedPairs + 1 === EMOJIS.length) {
          setIsWon(true);
          launchConfetti();
        }
      } else {
        // No match, flip back after a delay
        setTimeout(() => {
          setFlippedIndices([]);
        }, 1000);
      }
    }
  };

  const launchConfetti = () => {
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#8B1A1A', '#FAECD0', '#ffffff']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#8B1A1A', '#FAECD0', '#ffffff']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  return (
    <section className="scrapbook-section" id="game" style={{ background: 'rgba(255,255,255,0.3)', paddingBottom: '4rem' }}>
      <motion.h2 
        className="scrapbook-title"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        style={{ marginBottom: '0.5rem' }}
      >
        Il Gioco dei Ricordi
      </motion.h2>
      
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        style={{
          textAlign: 'center',
          fontFamily: '"DM Sans", sans-serif',
          fontSize: '1rem',
          color: 'rgba(61,31,16,0.7)',
          maxWidth: '500px',
          margin: '0 auto 2rem auto',
          lineHeight: 1.4
        }}
      >
        Trova le coppie nascoste! Quanto sei veloce a ricordare?
      </motion.p>

      <div style={{ maxWidth: '400px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          width: '100%', 
          marginBottom: '1.5rem',
          fontFamily: '"DM Sans", sans-serif',
          fontWeight: 'bold',
          color: '#8B1A1A'
        }}>
          <span>Mosse: {moves}</span>
          <span>Coppie: {matchedPairs}/{EMOJIS.length}</span>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(4, 1fr)', 
          gap: '12px', 
          width: '100%',
          perspective: '1000px'
        }}>
          {cards.map((card, index) => {
            const isFlipped = flippedIndices.includes(index) || card.isMatched;
            
            return (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                style={{
                  width: '100%',
                  aspectRatio: '1',
                  position: 'relative',
                  cursor: 'pointer',
                  transformStyle: 'preserve-3d',
                }}
                onClick={() => handleCardClick(index)}
              >
                <motion.div
                  initial={false}
                  animate={{ rotateY: isFlipped ? 180 : 0 }}
                  transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
                  style={{
                    width: '100%',
                    height: '100%',
                    position: 'absolute',
                    transformStyle: 'preserve-3d'
                  }}
                >
                  {/* Card Back (Hidden side initially facing up) */}
                  <div style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    backfaceVisibility: 'hidden',
                    background: 'linear-gradient(135deg, #8B1A1A, #A52A2A)',
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
                    border: '2px solid rgba(255,255,255,0.2)',
                    fontSize: '2rem'
                  }}>
                    <span style={{ opacity: 0.5 }}>❓</span>
                  </div>

                  {/* Card Front (Emoji side) */}
                  <div style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    backfaceVisibility: 'hidden',
                    background: card.isMatched ? 'rgba(250, 236, 208, 0.9)' : '#fff',
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                    transform: 'rotateY(180deg)',
                    border: card.isMatched ? '2px solid #8B1A1A' : 'none',
                    fontSize: '2.5rem'
                  }}>
                    <AppleEmoji emoji={card.emoji} style={{ width: '1em', height: '1em' }} />
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {isWon && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, type: 'spring' }}
            style={{
              marginTop: '2rem',
              padding: '1.5rem',
              background: '#fff',
              borderRadius: '20px',
              textAlign: 'center',
              boxShadow: '0 10px 30px rgba(139,26,26,0.15)',
              border: '2px solid #8B1A1A'
            }}
          >
            <h3 style={{ fontFamily: "'Dancing Script', cursive", color: '#8B1A1A', fontSize: '2rem', margin: '0 0 0.5rem 0' }}>Hai Vinto! 🎉</h3>
            <p style={{ margin: '0 0 1rem 0', color: 'rgba(61,31,16,0.8)' }}>
              Non dimentichi mai i nostri momenti, vero? ❤️<br/>
              Ci hai messo {moves} mosse!
            </p>
            <button 
              onClick={startNewGame}
              style={{
                background: '#8B1A1A',
                color: '#fff',
                border: 'none',
                padding: '0.8rem 1.5rem',
                borderRadius: '50px',
                fontFamily: '"DM Sans", sans-serif',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0 4px 10px rgba(139,26,26,0.3)'
              }}
            >
              Gioca ancora
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
