import { FC } from 'react';

interface IconCloseProps {
    className?: string;
}

const IconClose: FC<IconCloseProps> = ({ className }) => {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <circle opacity="0.5" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
            <path d="M14.5 9.50002L9.5 14.5M9.5 9.50002L14.5 14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    );
};

export default IconClose;
