import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  color: 'lime' | 'purple' | 'pink' | 'blue';
  trend?: {
    value: number;
    positive: boolean;
  };
}

const colorMap = {
  lime: {
    bg: 'bg-[#a3e635]/10',
    border: 'border-[#a3e635]/20',
    text: 'text-[#a3e635]',
    iconBg: 'bg-[#a3e635]/20',
  },
  purple: {
    bg: 'bg-[#c084fc]/10',
    border: 'border-[#c084fc]/20',
    text: 'text-[#c084fc]',
    iconBg: 'bg-[#c084fc]/20',
  },
  pink: {
    bg: 'bg-[#f472b6]/10',
    border: 'border-[#f472b6]/20',
    text: 'text-[#f472b6]',
    iconBg: 'bg-[#f472b6]/20',
  },
  blue: {
    bg: 'bg-[#60a5fa]/10',
    border: 'border-[#60a5fa]/20',
    text: 'text-[#60a5fa]',
    iconBg: 'bg-[#60a5fa]/20',
  },
};

export function StatCard({ title, value, subtitle, icon: Icon, color, trend }: StatCardProps) {
  const colors = colorMap[color];

  return (
    <div className={`relative overflow-hidden rounded-2xl border ${colors.border} ${colors.bg} p-4`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-gray-400 mb-1">{title}</p>
          <p className={`text-2xl font-bold ${colors.text}`}>{value}</p>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
          )}
          {trend && (
            <div className={`flex items-center gap-1 mt-2 text-xs ${trend.positive ? 'text-green-400' : 'text-red-400'}`}>
              <span>{trend.positive ? '↑' : '↓'} {Math.abs(trend.value)}%</span>
              <span className="text-gray-500">vs última semana</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-xl ${colors.iconBg}`}>
          <Icon className={`w-5 h-5 ${colors.text}`} />
        </div>
      </div>
    </div>
  );
}
