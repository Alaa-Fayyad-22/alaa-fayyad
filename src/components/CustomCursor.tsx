import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (dotRef.current) {
        dotRef.current.style.left = `${e.clientX - 4}px`;
        dotRef.current.style.top = `${e.clientY - 4}px`;
      }
      if (ringRef.current) {
        setTimeout(() => {
          if (ringRef.current) {
            ringRef.current.style.left = `${e.clientX - 15}px`;
            ringRef.current.style.top = `${e.clientY - 15}px`;
          }
        }, 80);
      }
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot hidden md:block" />
      <div ref={ringRef} className="cursor-ring hidden md:block" />
    </>
  );
}