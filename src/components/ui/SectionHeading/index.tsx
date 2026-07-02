import React from "react";

interface SectionHeadingProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Modern configurator section heading: a small green accent bar above a
 * tight, bold title. Replaces the old gradient "chip pill" headings.
 */
const SectionHeading: React.FC<SectionHeadingProps> = ({
  children,
  className = "",
}) => (
  <div className={`mb-6 ${className}`}>
    <div className="h-1 w-10 rounded-full bg-primary-green mb-2.5" />
    <h2 className="text-xl font-bold tracking-tight text-primary-green-dark leading-snug">
      {children}
    </h2>
  </div>
);

export default SectionHeading;
