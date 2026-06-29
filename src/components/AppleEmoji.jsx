import { useState } from 'react';

export default function AppleEmoji({ emoji, style = {}, className = "" }) {
  const [error, setError] = useState(false);

  const getCodepoint = (char) => {
    let codes = [];
    for (let match of char) {
      codes.push(match.codePointAt(0).toString(16));
    }
    return codes.filter(c => c !== 'fe0f').join('-');
  };

  const code = getCodepoint(emoji);

  if (error) {
    return (
      <span className={className} style={{ ...style, display: 'inline-block', lineHeight: 1 }}>
        {emoji}
      </span>
    );
  }

  return (
    <img 
      src={`/emojis/${code}.png`} 
      alt={emoji}
      className={className}
      onError={() => setError(true)}
      style={{
        width: '1em',
        height: '1em',
        verticalAlign: '-0.1em',
        display: 'inline-block',
        pointerEvents: 'none',
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
        transform: 'translateZ(1px)',
        WebkitTransform: 'translateZ(1px)',
        ...style
      }}
    />
  );
}
