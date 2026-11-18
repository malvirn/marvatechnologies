"use client";

import { useEffect, useState } from "react";

const CODE = `const marva = {
  founder: "Malvirn Gomo",
  stack: ["React", "Supabase"],
  build() {
    return "useful software";
  },
};
marva.build();`;

const TOKEN = /("[^"]*"?)|(\b(?:const|let|var|return|function|new|await|async)\b)|(\b[A-Za-z_$][\w$]*(?=\())|(\b[A-Za-z_$][\w$]*(?=:))|(\b\d+\b)|([{}()[\],.;:=])/g;
const CLASSES = ["", "tk-str", "tk-kw", "tk-fn", "tk-prop", "tk-num", "tk-pun"];

function highlight(text: string) {
  const out: React.ReactNode[] = [];
  let last = 0;
  let key = 0;
  for (const m of text.matchAll(TOKEN)) {
    const i = m.index ?? 0;
    if (i > last) out.push(text.slice(last, i));
    const g = m.findIndex((v, n) => n > 0 && v !== undefined);
    out.push(<span key={key++} className={CLASSES[g]}>{m[0]}</span>);
    last = i + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

/** Types a short JavaScript snippet character by character, then loops. */
export default function CodeTyper() {
  const [n, setN] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setN(CODE.length);
      return;
    }
    let i = 0;
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      if (i < CODE.length) {
        i++;
        setN(i);
        timer = setTimeout(tick, CODE[i - 1] === "\n" ? 280 : 40 + Math.random() * 55);
      } else {
        timer = setTimeout(() => {
          i = 0;
          setN(0);
          timer = setTimeout(tick, 500);
        }, 2800);
      }
    };
    timer = setTimeout(tick, 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <div className="in-dots"><i /><i /><i /></div>
      <span className="ct-file">marva.js</span>
      <pre className="ct-pre"><code>{highlight(CODE.slice(0, n))}<span className="ct-caret" /></code></pre>
    </>
  );
}
