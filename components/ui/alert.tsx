'use client';

import React from 'react';

type AlertProps = {
    type: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
    message: string;
    show: boolean;
    onClose: () => void;
};

const typeStyles: Record<AlertProps['type'], string> = {
    primary: 'text-primary bg-primary-light dark:bg-primary-dark-light',
    secondary: 'text-secondary bg-secondary-light dark:bg-secondary-dark-light',
    success: 'text-success bg-success-light dark:bg-success-dark-light',
    warning: 'text-warning bg-warning-light dark:bg-warning-dark-light',
    danger: 'text-danger bg-danger-light dark:bg-danger-dark-light',
    info: 'text-info bg-info-light dark:bg-info-dark-light',
};

const Alert: React.FC<AlertProps> = ({ type, message, show, onClose }) => {
    if (!show) return null;

    return (
        <div className={`flex items-center p-3.5 rounded ${typeStyles[type]}`}>
            <span className="ltr:pr-2 rtl:pl-2">
                <strong className="capitalize ltr:mr-1 rtl:ml-1">{type}!</strong>
                {message}
            </span>
            <button
                type="button"
                className="ltr:ml-auto rtl:mr-auto hover:opacity-80"
                onClick={onClose}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                >
                    <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                    />
                </svg>
            </button>
        </div>
    );
};

export default Alert;
