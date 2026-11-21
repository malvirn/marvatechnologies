import { isValidElement, type ReactNode } from "react";
import CopyButton from "@/components/insights/CopyButton";

function plainText(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(plainText).join("");
  if (isValidElement<{ children?: ReactNode }>(node)) return plainText(node.props.children);
  return "";
}

export default function PromptBlock({ label = "Copyable prompt", children }: { label?: string; children: ReactNode }) {
  const prompt = plainText(children).trim();
  return <section className="bn-prompt-block">
    <div className="bn-prompt-heading"><span>{label}</span><CopyButton text={prompt} /></div>
    <pre tabIndex={0} aria-label={label}><code>{children}</code></pre>
  </section>;
}
