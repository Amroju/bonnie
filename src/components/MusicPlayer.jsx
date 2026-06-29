import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TRACK = {
  src:    '/bg-music.m4a',
  title:  'Futura',
  artist: 'Lucio Dalla',
  cover:  '/rose.png' // Using the beautiful rose as the album cover
};

function fmt(s) {
  if (!isFinite(s) || isNaN(s)) return '0:00';
  return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
}

export default function MusicPlayer({ visible }) {
  const [open,    setOpen]    = useState(false);
  const [playing, setPlaying] = useState(false);
  const [prog,    setProg]    = useState(0);
  const [cur,     setCur]     = useState(0);
  const [dur,     setDur]     = useState(0);
  const [vol,     setVol]     = useState(0.02); // Very quiet default volume
  
  const audioRef = useRef(null);
  const audioCtxRef = useRef(null);
  const gainNodeRef = useRef(null);
  const initializedRef = useRef(false);

  const initAudio = () => {
    if (initializedRef.current || !audioRef.current) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const audioCtx = new AudioContext();
      const track = audioCtx.createMediaElementSource(audioRef.current);
      const gainNode = audioCtx.createGain();
      
      track.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      gainNode.gain.value = vol;
      
      audioCtxRef.current = audioCtx;
      gainNodeRef.current = gainNode;
      initializedRef.current = true;
    } catch (e) {
      console.log("Web Audio API init error:", e);
    }
  };

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const onTime = () => { setCur(a.currentTime); setProg(a.duration ? (a.currentTime / a.duration) * 100 : 0); };
    const onMeta = () => setDur(a.duration);
    const onEnd  = () => setPlaying(false);
    a.addEventListener('timeupdate', onTime);
    a.addEventListener('loadedmetadata', onMeta);
    a.addEventListener('ended', onEnd);
    a.volume = vol; // Fallback for non-iOS
    
    const playAudio = async () => {
      try {
        initAudio();
        if (audioCtxRef.current?.state === 'suspended') {
          await audioCtxRef.current.resume();
        }
        a.currentTime = 5;
        await a.play();
        setPlaying(true);
      } catch (e) {
        console.log("Autoplay failed or blocked:", e);
      }
    };
    playAudio();

    return () => {
      a.removeEventListener('timeupdate', onTime);
      a.removeEventListener('loadedmetadata', onMeta);
      a.removeEventListener('ended', onEnd);
    };
  }, []);

  const togglePlay = useCallback(async () => {
    const a = audioRef.current;
    if (!a) return;
    
    initAudio();
    if (audioCtxRef.current?.state === 'suspended') {
      await audioCtxRef.current.resume();
    }
    
    if (playing) { a.pause(); setPlaying(false); }
    else {
      try { await a.play(); setPlaying(true); }
      catch { setPlaying(p => !p); }
    }
  }, [playing]);

  const seek = (e) => {
    const a = audioRef.current;
    if (!a?.duration) return;
    const r = e.currentTarget.getBoundingClientRect();
    a.currentTime = ((e.clientX - r.left) / r.width) * a.duration;
  };

  const skip = (s) => { if (audioRef.current) audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime + s); };

  return (
    <>
      <audio ref={audioRef} src={TRACK.src} preload="metadata" loop />

      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.8 }}
            style={{
              position: 'fixed',
              bottom: '1.5rem',
              right: '1.5rem',
              zIndex: 50,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              gap: '0.8rem'
            }}
          >
            <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity:0, scale:0.8, y:20, filter: 'blur(10px)' }}
            animate={{ opacity:1, scale:1, y:0, filter: 'blur(0px)' }}
            exit={{ opacity:0, scale:0.8, y:20, filter: 'blur(10px)' }}
            transition={{ type:'spring', stiffness:350, damping:28 }}
            style={{
              background: 'rgba(255, 255, 255, 0.75)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: '1px solid rgba(255, 255, 255, 0.6)',
              borderRadius: '24px',
              padding: '1.5rem',
              width: '280px',
              boxShadow: '0 24px 48px rgba(139,26,26,0.12), 0 4px 12px rgba(0,0,0,0.04)',
              transformOrigin: 'bottom right',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.2rem'
            }}
          >
            {/* Album Art & Title */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <motion.div
                animate={playing ? { rotate: 360 } : { rotate: 0 }}
                transition={playing ? { duration: 15, repeat: Infinity, ease: 'linear' } : {}}
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '14px',
                  overflow: 'hidden',
                  flexShrink: 0,
                  boxShadow: '0 8px 16px rgba(139,26,26,0.15)',
                  background: '#f9e9ca',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <img src={TRACK.cover} alt="cover" style={{ width: '80%', height: '80%', objectFit: 'contain', mixBlendMode: 'multiply' }} />
              </motion.div>
              
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ 
                  fontFamily: '"DM Sans", sans-serif', 
                  fontWeight: 600, 
                  fontSize: '1.1rem', 
                  color: '#3D1F10',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {TRACK.title}
                </div>
                <div style={{ 
                  fontFamily: '"DM Sans", sans-serif', 
                  fontSize: '0.8rem', 
                  color: '#C4943A',
                  opacity: 0.9,
                  marginTop: '0.1rem'
                }}>
                  {TRACK.artist}
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <div 
                onClick={seek}
                style={{ 
                  height: '4px', 
                  background: 'rgba(61,31,16,0.1)', 
                  borderRadius: '2px', 
                  cursor: 'pointer', 
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <div style={{ 
                  width: `${prog}%`, 
                  height: '100%', 
                  background: 'linear-gradient(90deg, #C4943A, #8B1A1A)', 
                  borderRadius: '2px',
                  transition: 'width 0.1s linear'
                }} />
              </div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                fontSize: '0.65rem', 
                color: 'rgba(61,31,16,0.5)',
                fontFamily: '"DM Sans", sans-serif',
                fontWeight: 500
              }}>
                <span>{fmt(cur)}</span>
                <span>{fmt(dur)}</span>
              </div>
            </div>

            {/* Playback Controls */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.5rem' }}>
              <button onClick={() => skip(-10)} style={{ background: 'none', border: 'none', color: 'rgba(61,31,16,0.4)', cursor: 'pointer', padding: '0.5rem', display: 'flex' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 5V1L7 6l5 5V7c3.3 0 6 2.7 6 6s-2.7 6-6 6-6-2.7-6-6H4c0 4.4 3.6 8 8 8s8-3.6 8-8-3.6-8-8-8z"/>
                </svg>
              </button>

              <button 
                onClick={togglePlay} 
                style={{ 
                  width: '48px', 
                  height: '48px', 
                  borderRadius: '50%', 
                  background: '#8B1A1A', 
                  color: '#fff', 
                  border: 'none', 
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 8px 20px rgba(139,26,26,0.3)',
                  transition: 'transform 0.15s, box-shadow 0.15s'
                }}
                onMouseOver={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; }}
                onMouseOut={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.95)'; }}
                onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; }}
              >
                {playing
                  ? <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="2"/><rect x="14" y="4" width="4" height="16" rx="2"/></svg>
                  : <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ marginLeft: '2px' }}><path d="M6 4l14 8-14 8z"/></svg>
                }
              </button>

              <button onClick={() => skip(10)} style={{ background: 'none', border: 'none', color: 'rgba(61,31,16,0.4)', cursor: 'pointer', padding: '0.5rem', display: 'flex' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 5V1l5 5-5 5V7c-3.3 0-6 2.7-6 6s2.7 6 6 6 6-2.7 6-6h2c0 4.4-3.6 8-8 8s-8-3.6-8-8 3.6-8 8-8z"/>
                </svg>
              </button>
            </div>

            {/* Volume Control */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginTop: '0.2rem' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="rgba(61,31,16,0.4)">
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
              </svg>
              <input
                type="range" min="0" max="1" step="0.01" value={vol}
                onChange={(e) => { 
                  const v = parseFloat(e.target.value); 
                  setVol(v); 
                  if (audioRef.current) audioRef.current.volume = v; 
                  if (gainNodeRef.current) gainNodeRef.current.gain.value = v; 
                }}
                style={{
                  flex:1, appearance:'none', height:4, borderRadius:2, cursor:'pointer', outline:'none',
                  background:`linear-gradient(to right, #8B1A1A ${vol*100}%, rgba(61,31,16,0.1) ${vol*100}%)`,
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB button */}
      <motion.button
        onClick={() => setOpen(o => !o)}
        aria-label="Apri/chiudi player"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={playing ? {
          boxShadow: ['0 4px 16px rgba(139,26,26,0.25)', '0 8px 24px rgba(139,26,26,0.45)', '0 4px 16px rgba(139,26,26,0.25)'],
        } : { boxShadow: '0 4px 16px rgba(139,26,26,0.25)' }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        style={{
          width: '52px',
          height: '52px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #8B1A1A 0%, #6B1212 100%)',
          border: '1px solid rgba(255,255,255,0.2)',
          color: 'white',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.4rem',
        }}
      >
        {playing ? (
          <motion.span
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >♫</motion.span>
        ) : <span>♪</span>}
      </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
