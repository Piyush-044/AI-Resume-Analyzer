import { useEffect, useRef } from 'react';

export default function SpotlightCursor() {
  const cursorRef = useRef(null);
  const dotRef = useRef(null);
  const pos = useRef({ x: -200, y: -200 });
  const smoothPos = useRef({ x: -200, y: -200 });
  const rafRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      pos.current = { x: e.clientX, y: e.clientY };
    };

    const animate = () => {
      smoothPos.current.x += (pos.current.x - smoothPos.current.x) * 0.1;
      smoothPos.current.y += (pos.current.y - smoothPos.current.y) * 0.1;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${smoothPos.current.x - 200}px, ${smoothPos.current.y - 200}px)`;
      }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${pos.current.x - 4}px, ${pos.current.y - 4}px)`;
      }
      rafRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove);
    rafRef.current = requestAnimationFrame(animate);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <>
      {/* Large soft glow that follows cursor slowly */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-[400px] h-[400px] rounded-full pointer-events-none z-[9999] hidden md:block"
        style={{
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.06) 0%, rgba(139, 92, 246, 0.03) 40%, transparent 70%)',
          willChange: 'transform',
        }}
      />
      {/* Small precise dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-2 h-2 rounded-full pointer-events-none z-[9999] hidden md:block"
        style={{
          background: 'rgba(99, 102, 241, 0.7)',
          boxShadow: '0 0 8px rgba(99,102,241,0.9)',
          willChange: 'transform',
        }}
      />
    </>
  );
}
