'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';

/**
 * Dropdown drawn in the directory's own styling.
 *
 * A native <select> renders as the operating system draws it — rounded on
 * macOS, grey on Windows — which is the one control on the review form that
 * ignores the site's square-edged, stone-and-orange treatment.
 *
 * Built by hand rather than pulled from a library: the site ships only Next,
 * React, Tailwind and icons, and a headless UI package would be a large new
 * dependency on a public marketing page for two controls.
 *
 * Keyboard behaviour follows the native control, because replacing it means
 * inheriting its obligations: arrows move, Enter and Space select, Escape
 * closes, Home and End jump, and typing focuses the closest match.
 */
export default function ThemedSelect<T extends string>({
  value,
  onChange,
  options,
  label,
  disabled = false
}: {
  value: T;
  onChange: (value: T) => void;
  options: readonly T[];
  /** Rendered above the control and announced as its accessible name. */
  label: string;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(() => Math.max(0, options.indexOf(value)));
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const typeahead = useRef({ query: '', at: 0 });
  const id = useId();

  // Pointer-down, not click: a click listener would fire after the button's own
  // handler had already toggled the menu back open.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [open]);

  // Keeps the highlighted row visible when arrowing past the visible window.
  useEffect(() => {
    if (!open) return;
    listRef.current
      ?.querySelector(`[data-index="${activeIndex}"]`)
      ?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex, open]);

  const openAt = (index: number) => {
    setActiveIndex(Math.max(0, index));
    setOpen(true);
  };

  const commit = (index: number) => {
    const next = options[index];
    if (next !== undefined) onChange(next);
    setOpen(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (disabled) return;

    if (!open) {
      if (['Enter', ' ', 'ArrowDown', 'ArrowUp'].includes(event.key)) {
        event.preventDefault();
        openAt(options.indexOf(value));
      }
      return;
    }

    switch (event.key) {
      case 'Escape':
        event.preventDefault();
        setOpen(false);
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        commit(activeIndex);
        break;
      case 'ArrowDown':
        event.preventDefault();
        setActiveIndex((current) => Math.min(options.length - 1, current + 1));
        break;
      case 'ArrowUp':
        event.preventDefault();
        setActiveIndex((current) => Math.max(0, current - 1));
        break;
      case 'Home':
        event.preventDefault();
        setActiveIndex(0);
        break;
      case 'End':
        event.preventDefault();
        setActiveIndex(options.length - 1);
        break;
      default: {
        if (event.key.length !== 1) break;
        // Successive letters within a second build one query, so "co" reaches
        // "Competitive Match" rather than stopping at every c-word.
        const now = Date.now();
        const state = typeahead.current;
        state.query = now - state.at > 1000 ? event.key : state.query + event.key;
        state.at = now;
        const match = options.findIndex((option) =>
          option.toLowerCase().startsWith(state.query.toLowerCase())
        );
        if (match >= 0) setActiveIndex(match);
      }
    }
  };

  return (
    <div ref={rootRef} className="relative">
      <span id={`${id}-label`} className="text-[0.65rem] font-bold uppercase tracking-[0.13em] text-stone-500">
        {label}
      </span>
      <button
        type="button"
        disabled={disabled}
        onClick={() => (open ? setOpen(false) : openAt(options.indexOf(value)))}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-labelledby={`${id}-label`}
        className="mt-2 flex w-full items-center justify-between gap-2 border border-stone-300 bg-white px-3 py-2.5 text-left text-sm text-stone-800 outline-none focus:border-[#F26419] focus:ring-2 focus:ring-[#F26419]/15 disabled:cursor-not-allowed disabled:bg-stone-50 disabled:text-stone-400"
      >
        <span className="truncate">{value}</span>
        <ChevronDown
          size={15}
          className={`shrink-0 text-stone-400 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <ul
          ref={listRef}
          role="listbox"
          aria-labelledby={`${id}-label`}
          aria-activedescendant={`${id}-option-${activeIndex}`}
          tabIndex={-1}
          className="absolute z-10 mt-1 max-h-60 w-full overflow-y-auto border border-stone-300 bg-white py-1 shadow-lg"
        >
          {options.map((option, index) => {
            const isSelected = option === value;
            const isActive = index === activeIndex;
            return (
              <li
                key={option}
                id={`${id}-option-${index}`}
                data-index={index}
                role="option"
                aria-selected={isSelected}
                // Pointer-down would close the menu before the click landed.
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => commit(index)}
                onMouseEnter={() => setActiveIndex(index)}
                className={`cursor-pointer px-3 py-2 text-sm ${
                  isActive ? 'bg-[#fff5ef] text-[#c44b0c]' : 'text-stone-700'
                } ${isSelected ? 'font-semibold' : ''}`}
              >
                {option}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
