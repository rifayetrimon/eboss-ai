import type { FC } from 'react';

interface IconProfileProps {
    className?: string;
}

const IconProfile: FC<IconProfileProps> = ({ className }) => {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <circle cx="12" cy="7" r="3" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
            <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    );
};

export default IconProfile;
