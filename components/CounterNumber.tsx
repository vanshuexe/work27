"use client";

import { useEffect, useRef, useState } from "react";

// Replaces jQuery counterUp: counts from 0 to `value` over ~1s once the number scrolls into view.
export default function CounterNumber({ value, duration = 1000 }: { value: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [current, setCurrent] = useState(value);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let frame = 0;
    setCurrent(0);
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const progress = Math.min((now - start) / duration, 1);
          setCurrent(Math.round(value * progress));
          if (progress < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.5 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value, duration]);

  return (
    <span className="counter-number" ref={ref}>
      {current.toLocaleString("en-IN")}
    </span>
  );
}
