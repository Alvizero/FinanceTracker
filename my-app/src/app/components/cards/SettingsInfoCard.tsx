'use client';

import React from 'react';

interface InfoCardProps {
    icon: React.ElementType;
    iconColor: string;
    iconBgColor: string;
    label: string;
    value: string | React.ReactNode;
    children?: React.ReactNode;
}

const InfoCard: React.FC<InfoCardProps> = ({ icon: Icon, iconColor, iconBgColor, label, value, children }) => (
    <div className="flex items-start">
        <div className="flex-shrink-0">
            <div className={`w-12 h-12 ${iconBgColor} rounded-lg flex items-center justify-center`}>
                <Icon className={`w-6 h-6 ${iconColor}`} />
            </div>
        </div>
        <div className="ml-4 flex-1">
            <label className="block text-sm font-medium text-gray-500 mb-1">{label}</label>
            {typeof value === 'string' ? (
                <p className="text-lg font-semibold text-gray-800">{value}</p>
            ) : (
                value
            )}
            {children}
        </div>
    </div>
);

export default InfoCard;
