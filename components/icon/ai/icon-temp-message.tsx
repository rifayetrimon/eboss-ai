import React from 'react';

interface MobileIconProps {
    color?: string; // The color of the icon
    size?: number; // Width & height in px
    title?: string; // Accessible title
    className?: string; // Optional additional CSS classes
}

const IconTempMessage: React.FC<MobileIconProps> = ({ color = 'currentColor', size = 64, title = 'Speech Bubble Icon', className = '' }) => {
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
            fillRule="evenodd"
            className={className}
        >
            <title>{title}</title>
            <g>
                <path
                    d="M10 50.832V59c0 .792.47 1.509 1.19 1.829s1.57.183 2.16-.349l5.82-5.297A16.084 16.084 0 0 1 29.99 51H52c3.18 0 6.24-1.264 8.49-3.514S64 42.184 64 39.002V18c0-1.104-.9-2-2-2s-2 .896-2 2v21.002A7.993 7.993 0 0 1 52 47H29.99a20.1 20.1 0 0 0-13.51 5.223L14 54.48V49c0-1.105-.9-2-2-2a7.993 7.993 0 0 1-8-7.998V14.998A7.993 7.993 0 0 1 12 7h37c1.1 0 2-.896 2-2s-.9-2-2-2H12C8.82 3 5.76 4.264 3.51 6.514S0 11.816 0 14.998v24.004c0 3.182 1.26 6.234 3.51 8.484A12.036 12.036 0 0 0 10 50.832zm35.9-40.45a1.996 1.996 0 0 0-3.8 0l-2.63 8.087-8.09 2.629C30.56 21.366 30 22.134 30 23s.56 1.634 1.38 1.902l8.09 2.629 2.63 8.087a1.996 1.996 0 0 0 3.8 0l2.63-8.087 8.09-2.629C57.44 24.634 58 23.866 58 23s-.56-1.634-1.38-1.902l-8.09-2.629-2.63-8.087zM14 37h24c1.1 0 2-.896 2-2s-.9-2-2-2H14c-1.1 0-2 .896-2 2s.9 2 2 2zm0-8h14c1.1 0 2-.896 2-2s-.9-2-2-2H14c-1.1 0-2 .896-2 2s.9 2 2 2zm30-11.532 1.04 3.206c.2.609.68 1.086 1.29 1.284L49.53 23l-3.2 1.042c-.61.198-1.09.675-1.29 1.284L44 28.532l-1.04-3.206a2.011 2.011 0 0 0-1.29-1.284L38.47 23l3.2-1.042a2.011 2.011 0 0 0 1.29-1.284zM14 21h14c1.1 0 2-.896 2-2s-.9-2-2-2H14c-1.1 0-2 .896-2 2s.9 2 2 2zM58.9 4.382a1.996 1.996 0 0 0-3.8 0l-.91 2.804-2.81.912C50.56 8.366 50 9.134 50 10s.56 1.634 1.38 1.902l2.81.912.91 2.804a1.996 1.996 0 0 0 3.8 0l.91-2.804 2.81-.912C63.44 11.634 64 10.866 64 10s-.56-1.634-1.38-1.902l-2.81-.912-.91-2.804z"
                    fill={color}
                    opacity="1"
                ></path>
            </g>
        </svg>
    );
};

export default IconTempMessage;
