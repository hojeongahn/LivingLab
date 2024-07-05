import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

const LetterAnimation = () => {
  const textRef = useRef(null);

  useEffect(() => {
    const text = textRef.current;
    const letters = text.innerText.split("");
    text.innerHTML = letters.map(letter => `<span class="letter">${letter}</span>`).join("");

    gsap.set(".letter", { display: "inline-block" });
    gsap.fromTo(".letter", { y: 50, opacity: 0 }, { y: 0, opacity: 1, delay: 0.5, stagger: 0.1, ease: "back.out(1.7)" });
  }, []);

  return (
    <div>
      <div className="movement-text text-4xl mb-2">
        내 자취생활의 길라잡이
      </div>
      <hr />
      <div ref={textRef} className="text-center font-bold text-7xl mt-2">
        자취연구소
      </div>
    </div>
  );
};

export default LetterAnimation;
