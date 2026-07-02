import React from "react";

interface SkeletonProps {
  className?: string;
}

/** A single shimmering placeholder block. */
const Skeleton: React.FC<SkeletonProps> = ({ className = "" }) => (
  <div
    className={`relative overflow-hidden rounded-lg bg-primary-grey-lightest ${className}`}
  >
    <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/70 to-transparent" />
  </div>
);

interface SkeletonGridProps {
  count?: number;
  columns?: 1 | 2;
  cardClassName?: string;
}

/** A grid of card placeholders — mirrors the configurator's choice grids. */
export const SkeletonGrid: React.FC<SkeletonGridProps> = ({
  count = 6,
  columns = 2,
  cardClassName = "h-36",
}) => (
  <div
    className={`grid ${columns === 2 ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"} gap-3`}
  >
    {Array.from({ length: count }).map((_, i) => (
      <Skeleton key={i} className={`rounded-xl ${cardClassName}`} />
    ))}
  </div>
);

interface SkeletonTableProps {
  rows?: number;
  cols?: number;
}

/** A placeholder table — used while admin data loads. */
export const SkeletonTable: React.FC<SkeletonTableProps> = ({
  rows = 6,
  cols = 5,
}) => (
  <div className="overflow-hidden rounded-xl border border-primary-grey-lightest bg-white shadow-sm">
    <div className="h-11 bg-primary-light" />
    {Array.from({ length: rows }).map((_, i) => (
      <div
        key={i}
        className="flex items-center gap-4 border-t border-primary-grey-lightest/60 px-4 py-3.5"
      >
        {Array.from({ length: cols }).map((_, j) => (
          <Skeleton key={j} className="h-4 flex-1" />
        ))}
      </div>
    ))}
  </div>
);

export default Skeleton;
