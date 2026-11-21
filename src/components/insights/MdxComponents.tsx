import * as React from "react";
import type { ReactNode } from "react";
import CopyButton from "@/components/insights/CopyButton";
import BeforeAfter from "@/components/insights/BeforeAfter";
import PromptBlock from "@/components/insights/PromptBlock";
import Demo from "@/components/insights/Demo";

type CalloutVariant = "why" | "when" | "mistake" | "tip";

export function Callout({ variant = "tip", title, children }: { variant?: CalloutVariant; title?: string; children: ReactNode }) {
  const labels: Record<CalloutVariant, string> = {
    why: "Why it matters",
    when: "When to use it",
    mistake: "Common mistake",
    tip: "Practical tip"
  };
  return (
    <aside className={"bn-callout bn-callout-" + variant}>
      <span className="bn-callout-label">{title ?? labels[variant]}</span>
      {children}
    </aside>
  );
}

function getText(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(getText).join("");
  if (React.isValidElement<{ children?: ReactNode }>(node)) return getText(node.props.children);
  return "";
}

export function CodeBlock({ children }: { children: ReactNode }) {
  const text = getText(children).replace(/\n$/, "");
  return (
    <div className="bn-code">
      <CopyButton text={text} />
      <pre tabIndex={0} aria-label="Code example"><code>{children}</code></pre>
    </div>
  );
}

export function Steps({ children }: { children: ReactNode }) {
  return <div className="bn-steps"><ol>{children}</ol></div>;
}

export function Checklist({ children }: { children: ReactNode }) {
  return <div className="bn-checklist"><ul>{children}</ul></div>;
}

function SafeAnchor({ href, rel, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  const isExternal = typeof href === "string" && /^https?:\/\//i.test(href);
  const safeRel = isExternal ? Array.from(new Set([...(rel?.split(/\s+/).filter(Boolean) ?? []), "noopener", "noreferrer"])).join(" ") : rel;
  return <a href={href} rel={safeRel} {...props} />;
}

export const mdxComponents = { Callout, CodeBlock, Steps, Checklist, BeforeAfter, PromptBlock, Demo, a: SafeAnchor, pre: CodeBlock };
