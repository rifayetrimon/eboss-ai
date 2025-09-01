import { FC } from 'react';

interface IconAIProps {
    className?: string;
}

const IconAI: FC<IconAIProps> = ({ className }) => {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            {/* Define gradient */}
            <defs>
                <linearGradient id="pinkRedGradient" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#0046FF" /> {/* Pinkish */}
                    <stop offset="100%" stopColor="#FF3B3F" /> {/* Reddish */}
                </linearGradient>
            </defs>

            {/* Circle background */}
            <circle cx="12" cy="12" r="12" fill="" />

            {/* AI text with gradient */}
            <text x="12" y="16" textAnchor="middle" fontSize="14" fontWeight="bold" fill="url(#pinkRedGradient)" fontFamily="Arial, sans-serif">
                AI
            </text>

            {/* Plus sign with gradient */}
            <text x="17" y="8" fontSize="12" fontWeight="bold" fill="url(#pinkRedGradient)" fontFamily="Arial, sans-serif">
                +
            </text>
        </svg>
    );
};

export default IconAI;
