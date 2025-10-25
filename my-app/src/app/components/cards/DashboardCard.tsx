import React from "react";

interface DashboardCardProps {
  title: string;
  value?: string | number;
  icon?: React.ReactNode;
  bgClass?: string;
  textClass?: string;
  onClick?: () => void;
  subtitle?: string;
  customContent?: React.ReactNode;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, icon, bgClass = "bg-white", textClass = "text-gray-900", onClick,subtitle, customContent }) => {
  const isInteractive = Boolean(onClick);

  return (
    <div
      onClick={onClick}
      className={`${bgClass} rounded-xl p-6 border border-gray-200 shadow-sm transition-all duration-200 hover:shadow-lg hover:border-gray-300 ${isInteractive ? "cursor-pointer" : ""}`}
      role={isInteractive ? "button" : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      onKeyDown={
        isInteractive
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick?.();
              }
            }
          : undefined
      }
      aria-label={isInteractive ? `${title}: ${value || subtitle}` : undefined}
    >
      {/* Header con titolo e icona */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        {icon && <div className="text-gray-400">{icon}</div>}
      </div>

      {/* Subtitle opzionale */}
      {subtitle && <p className="text-xs text-gray-500 mb-2">{subtitle}</p>}

      {/* Contenuto principale */}
      {customContent ? (
        <div className="mt-1">{customContent}</div>
      ) : (
        <p className={`text-3xl font-bold ${textClass}`}>{value}</p>
      )}
    </div>
  );
};

export default DashboardCard;
