import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AppleEmoji from './AppleEmoji';

// A demonstration of 9 photos with varied proportions to test the Pinterest masonry effect.
// User will later replace these with their 40+ photos from Google Drive.
const PHOTOS = [
  { id: 0, src: "/images/gallery/gal_0.jpg", caption: <>Solo due giorni insieme, eppure i tuoi occhi sapevano già tutto. <AppleEmoji emoji="✨" /></>, rotate: 1.1 },
  { id: 1, src: "/images/gallery/gal_1.jpg", caption: <>Il primo mercato insiemee. <AppleEmoji emoji="🥺" /></>, rotate: -3.8 },
  { id: 2, src: "/images/gallery/gal_2.jpg", caption: <>Enta el 3askereem mwaa7. <AppleEmoji emoji="💋" /></>, rotate: -2.0 },
  { id: 3, src: "/images/gallery/gal_3.jpg", caption: <>Il mio compleanno e la tua famosa torta fatta a casa. <AppleEmoji emoji="🎂" /></>, rotate: -2.9 },
  { id: 4, src: "/images/gallery/gal_4.jpg", caption: <>Mi sono presentato con i fiori solo per fare bella figura (spolier... ha funzionato ). <AppleEmoji emoji="🌹" /></>, rotate: -3.2 },
  { id: 5, src: "/images/gallery/gal_5.jpg", caption: <>Casa dolce casa... e decisamente meglio delle videochiamate. <AppleEmoji emoji="🫶" /></>, rotate: 1.9 },
  { id: 6, src: "/images/gallery/gal_6.jpg", caption: <>Basta brasile basta chiamate ora ti vedo in 3d davanti a me. <AppleEmoji emoji="💫" /></>, rotate: -3.3 },
  { id: 7, src: "/images/gallery/gal_7.jpg", caption: <>Tutta la casa per noi... il miglior regalo di natale possible. <AppleEmoji emoji="💖" /></>, rotate: -3.7 },
  { id: 8, src: "/images/gallery/gal_8.jpg", caption: <>A casa tuaaa. <AppleEmoji emoji="✨" /></>, rotate: -3.3 },
  { id: 9, src: "/images/gallery/gal_9.jpg", caption: <>Il mio capodanno preferito. <AppleEmoji emoji="🤍" /></>, rotate: 0.0 },
  { id: 10, src: "/images/gallery/gal_10.jpg", caption: <>Il tuo compleannooo. <AppleEmoji emoji="🎂" /></>, rotate: 0.5 },
  { id: 11, src: "/images/gallery/gal_11.jpg", caption: <>Un saluto a papà. <AppleEmoji emoji="🫶" /></>, rotate: 1.7 },
  { id: 12, src: "/images/gallery/gal_12.jpg", caption: <>Presi da qualche parte. <AppleEmoji emoji="💫" /></>, rotate: -0.6 },
  { id: 13, src: "/images/gallery/gal_13.jpg", caption: <>Lei guarda il lago io guardo lei. <AppleEmoji emoji="🤍" /></>, rotate: 0.7 },
  { id: 14, src: "/images/gallery/gal_14.jpg", caption: <>A Trento con i tuoi amici. <AppleEmoji emoji="✨" /></>, rotate: 2.1 },
  { id: 15, src: "/images/gallery/gal_15.jpg", caption: <>Ancora noi ancora a casa da solii. <AppleEmoji emoji="🥺" /></>, rotate: 1.6 },
  { id: 16, src: "/images/gallery/gal_16.jpg", caption: <>Baci al gusto di bubble tea. <AppleEmoji emoji="💋" /></>, rotate: -1.8 },
  { id: 17, src: "/images/gallery/gal_17.jpg", caption: <>Batteria scarica al lago..., ma con una vista decente (e non parlo del paesaggio). <AppleEmoji emoji="🥺" /></>, rotate: -2.3 },
  { id: 18, src: "/images/gallery/gal_18.jpg", caption: <>Castelvecchio prima volta per lei millesima volta per me (ma con la compagnia migliore). <AppleEmoji emoji="💫" /></>, rotate: -3.2 },
  { id: 19, src: "/images/gallery/gal_19.jpg", caption: <>Dolomitii. <AppleEmoji emoji="🥺" /></>, rotate: -3.2 },
  { id: 20, src: "/images/gallery/gal_20.jpg", caption: <>Fiori per un fiore. <AppleEmoji emoji="🌹" /></>, rotate: 0.8 },
  { id: 21, src: "/images/gallery/gal_21.jpg", caption: <>Giro osteriee insieme. <AppleEmoji emoji="🍷" /></>, rotate: 2.5 },
  { id: 22, src: "/images/gallery/gal_22.jpg", caption: <>I primi giorni di noi... quando ogni scusa era buona per non salutarsi mai. <AppleEmoji emoji="🫶" /></>, rotate: 1.8 },
  { id: 23, src: "/images/gallery/gal_23.jpg", caption: <>Io che cucino e tu che fai il controllo di qualità. <AppleEmoji emoji="👨‍🍳" /></>, rotate: -3.0 },
  { id: 24, src: "/images/gallery/gal_24.jpg", caption: <>Io in ritardo per il lavoro, ma per un bacio il tempo si trova sempre (e il capo capirà). <AppleEmoji emoji="💋" /></>, rotate: 3.4 },
  { id: 25, src: "/images/gallery/gal_25.jpg", caption: <>La foto non e' venuta come volevamo, ma la corsa per farla e' stata bella. <AppleEmoji emoji="✨" /></>, rotate: -3.4 },
  { id: 26, src: "/images/gallery/gal_26.jpg", caption: <>Le nostre chiamate... lei bellissima io che dormo profondamente. <AppleEmoji emoji="🌙" /></>, rotate: -1.7 },
  { id: 27, src: "/images/gallery/gal_27.jpg", caption: <>Montagna buon cibo e la mia persona preferita. <AppleEmoji emoji="⛰️" /></>, rotate: 1.0 },
  { id: 28, src: "/images/gallery/gal_28.jpg", caption: <>Mwaaa7. <AppleEmoji emoji="💋" /></>, rotate: 3.1 },
  { id: 29, src: "/images/gallery/gal_29.jpg", caption: <>Nessun motivo solo un bacio a caso. <AppleEmoji emoji="💋" /></>, rotate: -1.1 },
  { id: 30, src: "/images/gallery/gal_30.jpg", caption: <>Noi- trenitalia e il solito ritardo. Un classico. <AppleEmoji emoji="🚂" /></>, rotate: -2.5 },
  { id: 31, src: "/images/gallery/gal_31.jpg", caption: <>Non era cosi buono il tiramisù comunque. <AppleEmoji emoji="🍰" /></>, rotate: -3.4 },
  { id: 32, src: "/images/gallery/gal_32.jpg", caption: <>Siiii. <AppleEmoji emoji="🥺" /></>, rotate: 1.3 },
  { id: 33, src: "/images/gallery/gal_33.jpg", caption: <>Trattato come un orsetto. <AppleEmoji emoji="🧸" /></>, rotate: 3.9 },
  { id: 34, src: "/images/gallery/gal_34.jpg", caption: <>Trova le differenze. <AppleEmoji emoji="🤍" /></>, rotate: 2.8 },
  { id: 35, src: "/images/gallery/gal_35.jpg", caption: <>Tu in brasilee io qui che aspettavo solo le tue foto a caso per svoltare la giornata. <AppleEmoji emoji="☀️" /></>, rotate: -1.0 },
  { id: 36, src: "/images/gallery/gal_36.jpg", caption: <>Un pomeriggio perfetto tra il sole e il tuo sorriso. <AppleEmoji emoji="☀️" /></>, rotate: -0.4 },
  { id: 37, src: "/images/gallery/gal_37.jpg", caption: <>Un'altra gita un altro disastro meteorologico. ormai e' una tradizione. <AppleEmoji emoji="🌧️" /></>, rotate: 2.7 },
  { id: 38, src: "/images/gallery/gal_38.jpg", caption: <>Una delle prime volte che sei venuta da me. <AppleEmoji emoji="🥺" /></>, rotate: -2.7 }
];

function LightboxModal({ activePhoto, onClose, onNext, onPrev }) {
  const [isFlipped, setIsFlipped] = useState(false);

  // Reset flip state when photo changes
  useEffect(() => {
    setIsFlipped(false);
  }, [activePhoto.id]);

  return (
    <motion.div
      className="lightbox-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(26, 12, 6, 0.88)',
        backdropFilter: 'blur(8px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
      }}
    >
      {/* Close Button */}
      <button 
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '1.5rem',
          right: '1.5rem',
          background: 'none',
          border: 'none',
          color: '#FAECD0',
          fontSize: '2.5rem',
          cursor: 'pointer',
          zIndex: 1010
        }}
      >
        ✕
      </button>

      {/* Left Navigation Arrow */}
      <button
        onClick={(e) => { e.stopPropagation(); onPrev(e); }}
        style={{
          position: 'absolute',
          left: '1rem',
          background: 'rgba(250, 236, 208, 0.15)',
          border: 'none',
          borderRadius: '50%',
          width: '45px',
          height: '45px',
          color: '#FAECD0',
          fontSize: '1.8rem',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1010,
          transition: 'background 0.2s',
          outline: 'none'
        }}
      >
        ‹
      </button>

      {/* Main Polaroid Card in Lightbox with 3D Flip */}
      <div 
        style={{ 
          perspective: '1500px', 
          width: '100%', 
          maxWidth: '480px', 
          margin: 'auto',
          display: 'flex',
          justifyContent: 'center'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <motion.div
          key={activePhoto.id}
          initial={{ scale: 0.9, y: 20, rotateY: 0 }}
          animate={{ scale: 1, y: 0, rotateY: isFlipped ? 180 : 0 }}
          exit={{ scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 20, stiffness: 100 }}
          onClick={() => setIsFlipped(!isFlipped)}
          style={{
            width: '100%',
            maxWidth: '480px',
            aspectRatio: '3/4',
            position: 'relative',
            transformStyle: 'preserve-3d',
            cursor: 'pointer',
            boxShadow: isFlipped ? '0 10px 30px rgba(0,0,0,0.4)' : '0 20px 45px rgba(0,0,0,0.6)',
            borderRadius: '4px'
          }}
        >
          {/* Front of Polaroid (Photo) */}
          <div style={{
            position: 'absolute',
            inset: 0,
            backfaceVisibility: 'hidden',
            background: '#fff',
            padding: '1.2rem 1.2rem 3rem 1.2rem',
            borderRadius: '4px',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <img 
              src={activePhoto.src} 
              alt="" 
              style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '4px' }} 
            />
          </div>

          {/* Back of Polaroid (Message) */}
          <div style={{
            position: 'absolute',
            inset: 0,
            backfaceVisibility: 'hidden',
            background: '#f4ebd8',
            transform: 'rotateY(180deg)',
            padding: '2.5rem 1.5rem',
            borderRadius: '4px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid #e3d6b8',
            backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")' // subtle texture
          }}>
            {/* Fake tape on the back */}
            <div style={{
              position: 'absolute',
              top: '-15px',
              left: '50%',
              transform: 'translateX(-50%) rotate(-3deg)',
              width: '100px',
              height: '35px',
              backgroundColor: 'rgba(255, 255, 255, 0.4)',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}></div>
            
            <div 
              className="polaroid-caption" 
              style={{ 
                fontSize: '1.8rem', 
                textAlign: 'center',
                color: '#3D1F10',
                lineHeight: 1.4
              }}
            >
              {activePhoto.caption}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right Navigation Arrow */}
      <button
        onClick={(e) => { e.stopPropagation(); onNext(e); }}
        style={{
          position: 'absolute',
          right: '1rem',
          background: 'rgba(250, 236, 208, 0.15)',
          border: 'none',
          borderRadius: '50%',
          width: '45px',
          height: '45px',
          color: '#FAECD0',
          fontSize: '1.8rem',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1010,
          transition: 'background 0.2s',
          outline: 'none'
        }}
      >
        ›
      </button>
    </motion.div>
  );
}

export default function Gallery() {
  const [activeId, setActiveId] = useState(null);
  const [cols, setCols] = useState(2);

  // Responsive columns
  useEffect(() => {
    const handleResize = () => setCols(window.innerWidth >= 768 ? 3 : 2);
    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Disable page scroll when lightbox is open
  useEffect(() => {
    if (activeId !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [activeId]);

  const activePhoto = PHOTOS.find(p => p.id === activeId);

  const handleNext = (e) => {
    e.stopPropagation();
    setActiveId((prev) => (prev + 1) % PHOTOS.length);
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    setActiveId((prev) => (prev - 1 + PHOTOS.length) % PHOTOS.length);
  };

  // Split photos into columns (Top-to-bottom, then left-to-right like CSS column-count)
  const columns = Array.from({ length: cols }, () => []);
  const itemsPerCol = Math.ceil(PHOTOS.length / cols);
  PHOTOS.forEach((photo, i) => {
    const colIndex = Math.floor(i / itemsPerCol);
    if (columns[colIndex]) {
      columns[colIndex].push(photo);
    }
  });

  return (
    <section className="scrapbook-section" id="gallery" style={{ maxWidth: '900px', width: '100%', padding: '2rem 1.5rem' }}>
      <motion.h2 
        className="scrapbook-title"
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        style={{ transform: 'rotate(1deg)', marginBottom: '2.5rem' }}
      >
        Momenti indimenticabili
      </motion.h2>

      <div style={{ display: 'flex', gap: cols === 3 ? '2rem' : '1.2rem', width: '100%', alignItems: 'flex-start' }}>
        {columns.map((colPhotos, colIndex) => (
          <div key={colIndex} style={{ display: 'flex', flexDirection: 'column', gap: '2rem', flex: 1 }}>
            {colPhotos.map((photo, i) => (
              <motion.div
                key={photo.id}
                className="polaroid"
                onClick={() => setActiveId(photo.id)}
                style={{ 
                  transform: `rotate(${photo.rotate}deg)`,
                  WebkitTransform: `rotate(${photo.rotate}deg)`,
                  width: '100%',
                  cursor: 'pointer',
                  boxSizing: 'border-box',
                  willChange: 'transform' // Performance boost
                }}
                initial={{ opacity: 0, y: 30, rotate: photo.rotate - 5 }}
                whileInView={{ opacity: 1, y: 0, rotate: photo.rotate }}
                viewport={{ once: true, amount: 0.05 }}
                transition={{ duration: 0.5, delay: (i % 4) * 0.1 }}
                whileHover={{ scale: 1.03, rotate: 0, zIndex: 5 }}
              >
                <div className="tape"></div>
                <img 
                  src={photo.src} 
                  alt="" 
                  loading="lazy"
                  className="gallery-img-vintage"
                  style={{ width: '100%', display: 'block', borderRadius: '4px 4px 0 0', objectFit: 'cover' }} 
                />
                <div className="polaroid-caption" style={{ fontSize: '0.9rem', padding: '0.8rem 0.4rem' }}>
                  {photo.caption}
                </div>
              </motion.div>
            ))}
          </div>
        ))}
      </div>

      {/* Full-screen Lightbox Modal */}
      <AnimatePresence>
        {activeId !== null && activePhoto && (
          <LightboxModal 
            activePhoto={activePhoto}
            onClose={() => setActiveId(null)}
            onNext={handleNext}
            onPrev={handlePrev}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
