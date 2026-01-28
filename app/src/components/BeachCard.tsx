import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

interface BeachCardProps {
  children?: ReactNode;
  title?: string;
  subtitle?: string;
  icon?: LucideIcon;
  gradient?: 'sand' | 'ocean' | 'sunset' | 'palm' | 'purple';
  className?: string;
  onClick?: () => void;
  imageSrc?: string;
}

const gradientClasses = {
  sand: 'from-[#FFD966]/30 via-[#FFD966]/20 to-transparent',
  ocean: 'from-[#4DD0E1]/30 via-[#4DD0E1]/20 to-transparent',
  sunset: 'from-[#FF9B67]/30 via-[#FF9B67]/20 to-transparent',
  palm: 'from-[#7AC943]/30 via-[#7AC943]/20 to-transparent',
  purple: 'from-[#BA68C8]/30 via-[#BA68C8]/20 to-transparent',
};

const borderClasses = {
  sand: 'border-[#FFD966]/30',
  ocean: 'border-[#4DD0E1]/30',
  sunset: 'border-[#FF9B67]/30',
  palm: 'border-[#7AC943]/30',
  purple: 'border-[#BA68C8]/30',
};

export function BeachCard({
  children,
  title,
  subtitle,
  icon: Icon,
  gradient = 'ocean',
  className = '',
  onClick,
  imageSrc,
}: BeachCardProps) {
  const baseClasses = `
    relative overflow-hidden rounded-3xl
    bg-gradient-to-br ${gradientClasses[gradient]}
    border ${borderClasses[gradient]}
    backdrop-blur-sm
    transition-all duration-300
    ${onClick ? 'cursor-pointer hover:scale-[1.02] hover:shadow-2xl hover:shadow-' + gradient + '-500/20' : ''}
    ${className}
  `.trim();

  return (
    <div className={baseClasses} onClick={onClick}>
      {/* Background Image */}
      {imageSrc && (
        <div
          className="absolute inset-0 opacity-20 bg-cover bg-center"
          style={{ backgroundImage: `url(${imageSrc})` }}
        />
      )}

      {/* Content */}
      <div className="relative z-10 p-5">
        {(Icon || title) && (
          <div className="flex items-center gap-3 mb-3">
            {Icon && (
              <div className={`
                p-2.5 rounded-2xl 
                bg-gradient-to-br ${gradientClasses[gradient]}
                border ${borderClasses[gradient]}
              `}>
                <Icon className="w-5 h-5 text-white" />
              </div>
            )}
            {title && (
              <div>
                <h3 className="text-lg font-bold text-white">{title}</h3>
                {subtitle && <p className="text-sm text-gray-400">{subtitle}</p>}
              </div>
            )}
          </div>
        )}
        {children}
      </div>

      {/* Decorative glow */}
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${gradientClasses[gradient]} rounded-full blur-3xl opacity-40`} />
    </div>
  );
}
