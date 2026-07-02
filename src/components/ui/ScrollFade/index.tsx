import React, { useRef, useState, useEffect, useCallback } from "react";

interface ScrollFadeProps {
  children: React.ReactNode;
  /** classes for the inner scroll element (padding, bg, etc.) */
  className?: string;
  /** classes for the outer wrapper (sizing: flex-1, width, etc.) */
  wrapperClassName?: string;
  /** tailwind `from-*` color matching the scroll area's background */
  fadeColorClass?: string;
}

/**
 * Scrollable container with a soft "fog" gradient at the top/bottom edges that
 * appears only when there's more content to scroll in that direction.
 */
const ScrollFade: React.FC<ScrollFadeProps> = ({
  children,
  className = "",
  wrapperClassName = "",
  fadeColorClass = "from-primary-light",
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [atTop, setAtTop] = useState(true);
  const [atBottom, setAtBottom] = useState(true);

  const update = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setAtTop(el.scrollTop <= 1);
    setAtBottom(el.scrollTop + el.clientHeight >= el.scrollHeight - 1);
  }, []);

  useEffect(() => {
    update();
    const el = ref.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [children, update]);

  return (
    <div className={`relative min-h-0 ${wrapperClassName}`}>
      <div
        ref={ref}
        onScroll={update}
        className={`h-full overflow-y-auto no-scrollbar ${className}`}
      >
        {children}
      </div>

      <div
        className={`pointer-events-none absolute top-0 inset-x-0 h-12 bg-gradient-to-b ${fadeColorClass} to-transparent transition-opacity duration-200 ${
          atTop ? "opacity-0" : "opacity-100"
        }`}
      />
      <div
        className={`pointer-events-none absolute bottom-0 inset-x-0 h-14 bg-gradient-to-t ${fadeColorClass} to-transparent transition-opacity duration-200 ${
          atBottom ? "opacity-0" : "opacity-100"
        }`}
      />
    </div>
  );
};

export default ScrollFade;
