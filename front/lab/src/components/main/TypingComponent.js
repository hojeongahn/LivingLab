import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

const TypingComponent = () => {
  const textRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline();

    tl.fromTo(textRef.current, { opacity: 0 }, { opacity: 1, duration: 1, ease: "power2.inOut" })
      .to(textRef.current, { opacity: 0, duration: 1, ease: "power2.inOut", delay: 1 })
      .set(textRef.current, { textContent: "자취연구소" })
      .fromTo(textRef.current, { opacity: 0 }, { opacity: 1, duration: 1, ease: "power2.inOut", onStart: () => textRef.current.classList.add("font-bold") });
  }, []);

  return (
    <div style={{ textAlign: "center" }}>
      <div ref={textRef} className="fade-in-out-text" style={{ opacity: 0 }}>
        내 자취생활의 길라잡이
      </div>
    </div>
  );
};

export default TypingComponent;