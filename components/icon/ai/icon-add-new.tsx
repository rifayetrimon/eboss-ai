import type { FC } from 'react';
import IconAdd from './icon-add';

interface IconAddWithBackgroundProps {
    className?: string;
}

const IconAddWithBackground: FC<IconAddWithBackgroundProps> = ({ className }) => {
    return (
        <div className={`p-2 rounded-full bg-blue-600 ${className}`}>
            <IconAdd className="h-4 w-4 text-white" />
        </div>
    );
};

export default IconAddWithBackground;
