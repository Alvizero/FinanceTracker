'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface UserStatsCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  iconColor: string;
  iconBgColor?: string;
}

export const UserStatsCard: React.FC<UserStatsCardProps> = ({ title, value, icon: Icon, iconColor, iconBgColor = 'bg-gray-50' }) => {
  return (
    <article className="bg-white rounded-xl border border-gray-200 p-6 transition-all duration-200 hover:shadow-lg hover:border-gray-300">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h3 className="text-sm font-medium text-gray-600 mb-2">{title}</h3>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        
        <div className={`p-3 rounded-lg ${iconBgColor}`} aria-hidden="true">
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
      </div>
    </article>
  );
};
