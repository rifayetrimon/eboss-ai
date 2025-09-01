import type { FC } from 'react';

interface IconAddProps {
    className?: string;
}

const IconAdd: FC<IconAddProps> = ({ className }) => {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <path d="M12 5V19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M5 12H19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    );
};

export default IconAdd;
