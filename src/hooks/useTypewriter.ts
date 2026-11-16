"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

type TypewriterOptions = {
  speed?: number;
  start?: boolean;
  loop?: boolean;
  pause?: number;
  deleteSpeed?: number;
};

export function useTypewriter(words: string | string[], options: TypewriterOptions = {}) {
  const { speed = 38, start = true, loop = false, pause = 1600, deleteSpeed = 28 } = options;
  const reducedMotion = useReducedMotion();
  const list = Array.isArray(words) ? words : [words];
  const [text, setText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!start) return;
    if (reducedMotion) {
      setText(list[0] ?? "");
      setDone(true);
      return;
    }
    let timer: ReturnType<typeof setTimeout>;
    let index = 0;
    let deleting = false;
    let currentWord = wordIndex;
    const tick = () => {
      const target = list[currentWord] ?? "";
      if (!deleting) {
        index += 1;
        setText(target.slice(0, index));
        if (index >= target.length) {
          if (!loop) { setDone(true); return; }
          deleting = true;
          timer = setTimeout(tick, pause);
          return;
        }
        timer = setTimeout(tick, speed);
      } else {
        index -= 1;
        setText(target.slice(0, index));
        if (index <= 0) {
          currentWord = (currentWord + 1) % list.length;
          setWordIndex(currentWord);
          deleting = false;
          timer = setTimeout(tick, 220);
          return;
        }
        timer = setTimeout(tick, deleteSpeed);
      }
    };
    setDone(false);
    timer = setTimeout(tick, speed);
    return () => clearTimeout(timer);
  // The sequence is intentionally restarted only when its start gate changes.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [start, reducedMotion, loop]);

  return { text, done };
}
