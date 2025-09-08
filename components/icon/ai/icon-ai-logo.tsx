import React from 'react';

interface MobileIconProps {
    color?: string;
    size?: number; // Width & height in px
    title?: string; // Accessible title
    className?: string; // Optional additional CSS classes
}

const IconAiLogo: React.FC<MobileIconProps> = ({ size = 64, title = 'Magic Wand Icon', className = '' }) => {
    const gradientId = `magic-wand-gradient-${Math.random().toString(36).substr(2, 9)}`;

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            version="1.1"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            width={size}
            height={size}
            x="0"
            y="0"
            viewBox="0 0 64 64"
            xmlSpace="preserve"
            className={className}
        >
            <title>{title}</title>
            <defs>
                <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" style={{ stopColor: '#DC52BF' }} />
                    <stop offset="100%" style={{ stopColor: '#973DA4' }} />
                </linearGradient>
            </defs>
            <g>
                <path
                    d="m26.54 29.233 7.478 7.478L8.274 62.456a2.693 2.693 0 0 1-3.822 0L.795 58.799a2.693 2.693 0 0 1 0-3.821zm17.297-6.144-3.675-3.675a2.704 2.704 0 0 0-3.803 0l-8.54 8.54 7.497 7.46 8.521-8.521a2.704 2.704 0 0 0 0-3.804zM26.743 1.072l-.831 2.694a7.048 7.048 0 0 1-4.658 4.658l-2.695.831a.458.458 0 0 0 0 .876l2.695.831a7.048 7.048 0 0 1 4.658 4.658l.83 2.695a.458.458 0 0 0 .877 0l.83-2.695a7.048 7.048 0 0 1 4.659-4.658l2.694-.83a.458.458 0 0 0 0-.877l-2.694-.83a7.048 7.048 0 0 1-4.658-4.659l-.831-2.694a.458.458 0 0 0-.876 0zm20.079 33.987-.508 1.646a4.304 4.304 0 0 1-2.845 2.844l-1.645.508a.28.28 0 0 0 0 .535l1.645.507a4.304 4.304 0 0 1 2.845 2.845l.508 1.646a.28.28 0 0 0 .535 0l.507-1.646A4.304 4.304 0 0 1 50.71 41.1l1.645-.507a.28.28 0 0 0 0-.535l-1.645-.508a4.304 4.304 0 0 1-2.845-2.844l-.507-1.646a.28.28 0 0 0-.535 0zm10.06-16.176-.63 2.044a5.346 5.346 0 0 1-3.533 3.533l-2.043.63a.348.348 0 0 0 0 .665l2.043.63a5.346 5.346 0 0 1 3.534 3.534l.63 2.043c.1.327.564.327.664 0l.63-2.043a5.346 5.346 0 0 1 3.534-3.534l2.044-.63a.348.348 0 0 0 0-.665l-2.044-.63a5.346 5.346 0 0 1-3.533-3.533l-.63-2.044a.348.348 0 0 0-.665 0z"
                    fill={`url(#${gradientId})`}
                    opacity="1"
                />
            </g>
        </svg>
    );
};

export default IconAiLogo;
