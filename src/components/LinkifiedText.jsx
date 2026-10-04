import React from 'react';

const URL_REGEX = /(https?:\/\/[^\s]+)/g;
const MARKDOWN_LINK_REGEX = /\[([^\]]+)\]\(([^)]+)\)/g;

export default function LinkifiedText({ children, className = '' }) {
  if (!children) return null;
  const text = String(children);

  // First pass: extract markdown links [text](url), keep surrounding text intact.
  const segments = [];
  let lastIndex = 0;
  let match;
  // Reset regex stateful lastIndex
  MARKDOWN_LINK_REGEX.lastIndex = 0;
  while ((match = MARKDOWN_LINK_REGEX.exec(text)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ type: 'text', value: text.slice(lastIndex, match.index) });
    }
    segments.push({ type: 'link', label: match[1], href: match[2] });
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) {
    segments.push({ type: 'text', value: text.slice(lastIndex) });
  }

  return (
    <p className={className}>
      {segments.map((seg, i) => {
        if (seg.type === 'link') {
          return (
            <a
              key={i}
              href={seg.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline underline-offset-2 hover:opacity-80 break-all"
            >
              {seg.label}
            </a>
          );
        }
        // Within plain text, also linkify bare URLs
        const parts = seg.value.split(URL_REGEX);
        return parts.map((part, j) =>
          URL_REGEX.test(part) ? (
            <a
              key={`${i}-${j}`}
              href={part}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline underline-offset-2 hover:opacity-80 break-all"
            >
              {part}
            </a>
          ) : (
            <React.Fragment key={`${i}-${j}`}>{part}</React.Fragment>
          )
        );
      })}
    </p>
  );
}