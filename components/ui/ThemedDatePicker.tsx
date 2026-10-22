'use client';

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Calendar drawn in the directory's own styling.
 *
 * `input[type="date"]` is rendered entirely by the browser, so its popup cannot
 * be themed and looks different in every one. This replaces it with a grid that
 * matches the form around it.
 *
 * Every date here is a plain `YYYY-MM-DD` string and all arithmetic runs in UTC.
 * Local-time math is what produces the classic off-by-one — `new Date(iso)`
 * parses as midnight UTC, and reading it back with `getDate()` in a negative
 * offset returns the previous day. The server compares against a UTC today too,
 * so the limit here matches what it will accept.
 */

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const pad = (value: number) => String(value).padStart(2, '0');
const toIso = (year: number, month: number, day: number) =>
  `${year}-${pad(month + 1)}-${pad(day)}`;

/** Today in UTC, matching the server's own future-date check. */
export function todayIso(): string {
  const now = new Date();
  return toIso(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
}

function parseIso(value: string): { year: number; month: number; day: number } | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  return { day: Number(match[3]), month: Number(match[2]) - 1, year: Number(match[1]) };
}

const daysInMonth = (year: number, month: number) =>
  new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
const firstWeekdayOf = (year: number, month: number) =>
  new Date(Date.UTC(year, month, 1)).getUTCDay();

/** Shifts an ISO date by whole days without leaving UTC. */
function addDays(iso: string, delta: number): string {
  const parts = parseIso(iso);
  if (!parts) return iso;
  const shifted = new Date(Date.UTC(parts.year, parts.month, parts.day + delta));
  return toIso(shifted.getUTCFullYear(), shifted.getUTCMonth(), shifted.getUTCDate());
}

/** ISO dates sort lexicographically, so plain string comparison is correct. */
const isAfter = (a: string, b: string) => a > b;

/** Matches the popup's `w-[19rem]`, needed as a number to test for overflow. */
const POPUP_WIDTH = 304;

/**
 * Nearest ancestor that clips overflow, or null for the viewport.
 *
 * The review form is a `max-h-[94vh] overflow-y-auto` panel, and setting one
 * overflow axis away from `visible` forces the other to `auto` as well — so the
 * panel clips horizontally even though only vertical scrolling was asked for.
 * A popup wider than the space to its right is cut off mid-calendar rather than
 * spilling over the edge, which is what makes this worth detecting.
 */
function clippingAncestor(element: HTMLElement | null): HTMLElement | null {
  for (let node = element?.parentElement; node; node = node.parentElement) {
    const { overflow, overflowX } = getComputedStyle(node);
    if (overflow !== 'visible' || overflowX !== 'visible') return node;
  }
  return null;
}

export default function ThemedDatePicker({
  value,
  onChange,
  label,
  max = todayIso(),
  placeholder = 'Select a date'
}: {
  /** `YYYY-MM-DD`, or empty when nothing is chosen yet. */
  value: string;
  onChange: (value: string) => void;
  label: string;
  /** Latest selectable date. Defaults to today — a match cannot be in future. */
  max?: string;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const [cursor, setCursor] = useState(() => value || max);
  const [alignRight, setAlignRight] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const id = useId();

  // Measured when the popup opens rather than on every render: the answer only
  // changes with layout, and reading rects mid-render would force a reflow.
  useEffect(() => {
    if (!open || !rootRef.current) return;
    const trigger = rootRef.current.getBoundingClientRect();
    const bounds = clippingAncestor(rootRef.current)?.getBoundingClientRect();
    const limit = bounds ? bounds.right : window.innerWidth;
    setAlignRight(trigger.left + POPUP_WIDTH > limit);
  }, [open]);

  const view = parseIso(cursor) ?? parseIso(max)!;

  useEffect(() => {
    if (open) setCursor(value || max);
  }, [open, value, max]);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [open]);

  const grid = useMemo(() => {
    const total = daysInMonth(view.year, view.month);
    const lead = firstWeekdayOf(view.year, view.month);
    // Leading blanks align day 1 under its weekday column.
    return [
      ...Array.from({ length: lead }, () => null),
      ...Array.from({ length: total }, (_, index) => index + 1)
    ];
  }, [view.year, view.month]);

  const shiftMonth = (delta: number) => {
    const next = new Date(Date.UTC(view.year, view.month + delta, 1));
    const year = next.getUTCFullYear();
    const month = next.getUTCMonth();
    // Clamp the day so 31 Jan -> Feb lands on a real date.
    const day = Math.min(view.day, daysInMonth(year, month));
    setCursor(toIso(year, month, day));
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (!open) {
      if (['Enter', ' ', 'ArrowDown'].includes(event.key)) {
        event.preventDefault();
        setOpen(true);
      }
      return;
    }

    const moves: Record<string, number> = {
      ArrowDown: 7, ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7
    };

    if (event.key in moves) {
      event.preventDefault();
      const next = addDays(cursor, moves[event.key]);
      if (!isAfter(next, max)) setCursor(next);
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
        if (!isAfter(cursor, max)) {
          onChange(cursor);
          setOpen(false);
        }
        break;
      case 'PageUp':
        event.preventDefault();
        shiftMonth(-1);
        break;
      case 'PageDown':
        event.preventDefault();
        shiftMonth(1);
        break;
    }
  };

  const selected = parseIso(value);
  const today = todayIso();
  // A whole month is out of range only once its first day passes the limit.
  const nextMonthBlocked = isAfter(toIso(view.year, view.month + 1, 1), max);

  return (
    <div ref={rootRef} className="relative">
      <span id={`${id}-label`} className="text-[0.65rem] font-bold uppercase tracking-[0.13em] text-stone-500">
        {label}
      </span>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        onKeyDown={handleKeyDown}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-labelledby={`${id}-label`}
        className="mt-2 flex w-full items-center justify-between gap-2 border border-stone-300 bg-white px-3 py-2.5 text-left text-sm outline-none focus:border-[#F26419] focus:ring-2 focus:ring-[#F26419]/15"
      >
        <span className={value ? 'text-stone-800' : 'text-stone-400'}>
          {selected ? `${selected.day} ${MONTHS[selected.month]} ${selected.year}` : placeholder}
        </span>
        <CalendarDays size={15} className="shrink-0 text-stone-400" />
      </button>

      {open && (
        <div
          role="dialog"
          aria-label={label}
          className={`absolute z-20 mt-1 w-[19rem] max-w-[calc(100vw-2rem)] border border-stone-300 bg-white p-3 shadow-lg ${
            alignRight ? 'right-0' : 'left-0'
          }`}
        >
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => shiftMonth(-1)}
              className="p-1.5 text-stone-500 hover:text-[#F26419]"
              aria-label="Previous month"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-sm font-semibold text-stone-800">
              {MONTHS[view.month]} {view.year}
            </span>
            <button
              type="button"
              onClick={() => shiftMonth(1)}
              disabled={nextMonthBlocked}
              className="p-1.5 text-stone-500 hover:text-[#F26419] disabled:cursor-not-allowed disabled:opacity-30"
              aria-label="Next month"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="mt-2 grid grid-cols-7 gap-0.5">
            {WEEKDAYS.map((weekday) => (
              <span
                key={weekday}
                className="py-1 text-center text-[0.6rem] font-bold uppercase tracking-[0.08em] text-stone-400"
              >
                {weekday}
              </span>
            ))}

            {grid.map((day, index) => {
              if (day === null) return <span key={`blank-${index}`} />;

              const iso = toIso(view.year, view.month, day);
              const disabled = isAfter(iso, max);
              const isSelected = iso === value;
              const isToday = iso === today;

              return (
                <button
                  key={iso}
                  type="button"
                  disabled={disabled}
                  aria-current={isToday ? 'date' : undefined}
                  aria-pressed={isSelected}
                  onClick={() => {
                    onChange(iso);
                    setOpen(false);
                  }}
                  className={`py-1.5 text-center text-sm transition-colors disabled:cursor-not-allowed disabled:text-stone-300 ${
                    isSelected
                      ? 'bg-[#F26419] font-semibold text-white'
                      : isToday
                        ? 'text-[#c44b0c] ring-1 ring-inset ring-[#F26419]/40 hover:bg-[#fff5ef]'
                        : 'text-stone-700 hover:bg-[#fff5ef] hover:text-[#c44b0c]'
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>

          <p className="mt-2 border-t border-stone-100 pt-2 text-[0.65rem] text-stone-400">
            Future dates are unavailable — review a match you have played.
          </p>
        </div>
      )}
    </div>
  );
}
