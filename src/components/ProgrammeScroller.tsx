"use client";
import { useEffect, useRef, useState } from "react";

export function ProgrammeScroller({ areas }: { areas: readonly (readonly [string, string])[] }) {
  const [i, setI] = useState(0);
  const refs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => { if (e.isIntersecting) setI(Number((e.target as HTMLElement).dataset.i)); }),
      { rootMargin: "-42% 0px -48% 0px" },
    );
    refs.current.forEach((r) => r && io.observe(r));
    return () => io.disconnect();
  }, []);

  return (
    <div className="scroller">
      <div className="scroller__sticky" aria-hidden="true">
        <span className="scroller__no">{String(i + 1).padStart(2, "0")}</span>
        <span className="scroller__of">/ {String(areas.length).padStart(2, "0")}</span>
        <span className="scroller__name">{areas[i][0]}</span>
      </div>
      <ol className="scroller__list">
        {areas.map(([t, d], n) => (
          <li key={t} data-i={n} ref={(el) => { refs.current[n] = el; }} className={n === i ? "is-active" : undefined}>
            <h3>{t}</h3>
            <p>{d}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
