import React from 'react';

/**
 * Skip-to-content link — the first focusable element on the page.
 * Visually hidden until focused via keyboard, then jumps focus to #main-content.
 */
export default function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:right-3 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-primary focus:text-white focus:text-sm focus:font-medium focus:shadow-lg"
    >
      דילוג לתוכן העמוד
    </a>
  );
}