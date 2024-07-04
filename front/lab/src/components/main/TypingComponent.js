import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

const MovementEffect = () => {
  const text1Ref = useRef(null);
  const text2Ref = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline();

    // Animation for the first text
    tl.from(text1Ref.current, { x: -100, opacity: 0, duration: 1.5, ease: "power4.out", delay: 0.5 });

    // Animation for the second text
    tl.from(text2Ref.current, { x: 100, opacity: 0, duration: 1.5, ease: "power4.out" }, "-=1"); // "-=1" makes sure it starts 1 second after the previous animation starts
  }, []);

  return (
    <div>
      <div ref={text1Ref} className="movement-text text-4xl	mb-2">
        내 자취생활의 길라잡이
      </div>
      <hr/>
      <div ref={text2Ref} className="movement-text text-center font-bold text-7xl mt-2">
        자취연구소
      </div>
    </div>
  );
};

export default MovementEffect;
