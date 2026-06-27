import { useEffect, useState } from 'react';

const WORDS = [
  'Career Magnet',
  'Dream Job Tool',
  'ATS Optimizer',
  'Hiring Machine',
];

export default function TypewriterText({ className = '' }) {
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    const currentWord = WORDS[wordIndex];
    let timeout;

    if (!isDeleting) {
      if (charIndex < currentWord.length) {
        timeout = setTimeout(() => {
          setDisplayText(currentWord.slice(0, charIndex + 1));
          setCharIndex(c => c + 1);
        }, 80);
      } else {
        timeout = setTimeout(() => setIsDeleting(true), 2200);
      }
    } else {
      if (charIndex > 0) {
        timeout = setTimeout(() => {
          setDisplayText(currentWord.slice(0, charIndex - 1));
          setCharIndex(c => c - 1);
        }, 45);
      } else {
        setIsDeleting(false);
        setWordIndex(i => (i + 1) % WORDS.length);
      }
    }

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, wordIndex]);

  return (
    <span className={className}>
      {displayText}
      <span className="inline-block w-[3px] h-[1em] bg-indigo-400 ml-1 align-middle animate-blink" />
    </span>
  );
}
