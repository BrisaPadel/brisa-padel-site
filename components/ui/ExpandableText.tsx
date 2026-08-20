'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';

/**
 * Long prose with a "Read more" toggle.
 *
 * The full text is always rendered; only its height is limited, using a CSS
 * line clamp. Cutting the string in JavaScript would be simpler but this page
 * exists to be indexed — a crawler reading a truncated description would index
 * the truncation, and the clamped half would be all Google ever saw.
 *
 * The toggle appears only when the text genuinely overflows, which depends on
 * the rendered width and cannot be decided from character count: the same
 * sentence wraps to two lines on a desktop column and six on a phone.
 */
export default function ExpandableText({
  text,
  lines = 4,
  className = '',
  moreLabel = 'Read more',
  lessLabel = 'Show less'
}: {
  text: string;
  /** Lines shown while collapsed. */
  lines?: number;
  className?: string;
  moreLabel?: string;
  lessLabel?: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const [overflows, setOverflows] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);

  const measure = useCallback(() => {
    const node = textRef.current;
    if (!node) return;
    // Only meaningful while clamped: expanded, the two heights are equal and
    // the answer would always be "fits".
    if (expanded) return;
    setOverflows(node.scrollHeight > node.clientHeight + 1);
  }, [expanded]);

  useEffect(() => {
    measure();
    if (typeof ResizeObserver === 'undefined') {
      // Older browsers still get a correct answer on rotate or window resize.
      window.addEventListener('resize', measure);
      return () => window.removeEventListener('resize', measure);
    }
    // Reflow changes whether the text overflows, so this has to track the
    // element's own width rather than only the window's.
    const observer = new ResizeObserver(measure);
    if (textRef.current) observer.observe(textRef.current);
    return () => observer.disconnect();
  }, [measure, text]);

  if (!text) return null;

  return (
    <div className={className}>
      <p
        ref={textRef}
        // These fields are typed into textareas in the admin, so their
        // paragraph breaks are authored content. The clamp still counts
        // rendered lines, so preserving newlines does not break it.
        className="whitespace-pre-line"
        // Inline rather than a `line-clamp-N` class: the count is a prop, and
        // Tailwind cannot generate a class name from a runtime value.
        style={
          expanded
            ? undefined
            : {
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: lines,
                display: '-webkit-box',
                overflow: 'hidden'
              }
        }
      >
        {text}
      </p>

      {/* Rendered only once measurement proves it is needed, so short text
          never shows a control that would do nothing. */}
      {(overflows || expanded) && (
        <button
          type="button"
          onClick={() => setExpanded((current) => !current)}
          aria-expanded={expanded}
          className="mt-2 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-[0.1em] text-[#c44b0c] transition-colors hover:text-[#F26419]"
        >
          {expanded ? lessLabel : moreLabel}
          <ChevronDown
            size={13}
            className={`transition-transform ${expanded ? 'rotate-180' : ''}`}
          />
        </button>
      )}
    </div>
  );
}
