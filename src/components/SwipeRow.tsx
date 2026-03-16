import { useRef } from "react";

// ── SwipeRow ───────────────────────────────────────────────────────────────
// Left-swipe  → delete  (swipe < -72px trigger, reveals red bg on right)
// Right-swipe → complete (swipe > +72px trigger, reveals green bg on left)

interface SwipeRowProps {
  children: React.ReactNode;
  onSwipeLeft?: (() => void) | null;
  onSwipeRight?: (() => void) | null;
  leftLabel?: string;
  rightLabel?: string;
}

const THRESHOLD = 72;
const MAX_DRAG = 110;
const SNAP_DURATION = 230;

export function SwipeRow({
  children,
  onSwipeLeft,
  onSwipeRight,
  leftLabel = "✓ Done",
  rightLabel = "Delete",
}: SwipeRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const sx = useRef(0);
  const dx = useRef(0);

  const tx = (x: number) => {
    if (rowRef.current) {
      rowRef.current.style.transform = `translateX(${x}px)`;
    }
  };

  const onTouchStart = (e: React.TouchEvent) => {
    sx.current = e.touches[0].clientX;
    dx.current = 0;
    rowRef.current?.classList.add("swiping");
  };

  const onTouchMove = (e: React.TouchEvent) => {
    dx.current = e.touches[0].clientX - sx.current;
    if (Math.abs(dx.current) > 6) {
      tx(Math.sign(dx.current) * Math.min(Math.abs(dx.current), MAX_DRAG));
    }
  };

  const onTouchEnd = () => {
    rowRef.current?.classList.remove("swiping");
    const d = dx.current;

    if (d > THRESHOLD && onSwipeRight) {
      tx(420);
      setTimeout(() => { onSwipeRight(); tx(0); }, SNAP_DURATION);
    } else if (d < -THRESHOLD && onSwipeLeft) {
      tx(-420);
      setTimeout(() => { onSwipeLeft(); tx(0); }, SNAP_DURATION);
    } else {
      tx(0);
    }

    dx.current = 0;
  };

  return (
    <div className="swipe-wrapper">
      {onSwipeRight && (
        <div className="swipe-bg swipe-bg-left" aria-hidden="true">
          <span className="swipe-bg-label">{leftLabel}</span>
        </div>
      )}
      {onSwipeLeft && (
        <div className="swipe-bg swipe-bg-right" aria-hidden="true">
          <span className="swipe-bg-label">{rightLabel}</span>
        </div>
      )}
      <div
        ref={rowRef}
        className="swipeable"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {children}
      </div>
    </div>
  );
}
