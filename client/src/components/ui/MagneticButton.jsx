import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function MagneticButton({ children, className = '', strength = 0.4, onClick }) {
  const ref = useRef(null);
  const innerRef = useRef(null);

  useEffect(() => {
    const el = ref.current;
    const inner = innerRef.current;
    if (!el || !inner) return;

    const handleMouseMove = (e) => {
      const rect = el.getBoundingClientRect();
      const relX = e.clientX - (rect.left + rect.width / 2);
      const relY = e.clientY - (rect.top + rect.height / 2);
      gsap.to(el, { x: relX * strength, y: relY * strength, duration: 0.4, ease: 'power2.out' });
      gsap.to(inner, { x: relX * strength * 0.4, y: relY * strength * 0.4, duration: 0.4, ease: 'power2.out' });
    };

    const handleMouseLeave = () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
      gsap.to(inner, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
    };

    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [strength]);

  return (
    <div ref={ref} className="inline-flex cursor-pointer" onClick={onClick}>
      <div ref={innerRef} className={className}>
        {children}
      </div>
    </div>
  );
}
