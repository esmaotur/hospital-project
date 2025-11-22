import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    title?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '', title, ...props }) => {
    return (
        <div className={`bg-white shadow-md border border-primary/10 rounded-lg p-6 ${className}`} {...props}>
            {title && <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>}
            {children}
        </div>
    );
};
