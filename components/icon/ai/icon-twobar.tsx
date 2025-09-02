import React from 'react';

interface TwoBarMenuIconProps {
    className?: string;
    size?: number;
}

const TwoBarMenuIcon = ({ className, size = 24 }: TwoBarMenuIconProps) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        {/* Top bar: longer */}
        <line x1="3" y1="8" x2="21" y2="8" />
        {/* Bottom bar: shorter and left-aligned */}
        <line x1="3" y1="16" x2="15" y2="16" />
    </svg>
);

export default TwoBarMenuIcon;
