import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BeachCardProps {
  children?: ReactNode;
  title?: string;
  subtitle?: string;
  icon?: LucideIcon;
  variant?: 'teal' | 'coral' | 'neutral';
  className?: string;
  onClick?: () => void;
  imageSrc?: string;
}

export function BeachCard({
  children,
  title,
  subtitle,
  icon: Icon,
  variant = 'neutral',
  className = '',
  onClick,
  imageSrc,
}: BeachCardProps) {
  const variantStyles = {
    teal: 'border-teal-600/20 hover:border-teal-600/40 dark:border-teal-dark/20',
    coral: 'border-coral-500/20 hover:border-coral-500/40 dark:border-coral-dark/20',
    neutral: 'border-sand-200 hover:border-sand-300 dark:border-sand-dark-200'
  };

  const iconBgStyles = {
    teal: 'bg-teal-600/10 border-teal-600/20 dark:bg-teal-dark/10',
    coral: 'bg-coral-500/10 border-coral-500/20 dark:bg-coral-dark/10',
    neutral: 'bg-sand-100 border-sand-200 dark:bg-sand-dark-200'
  };

  const iconTextStyles = {
    teal: 'text-teal-600 dark:text-teal-dark',
    coral: 'text-coral-500 dark:text-coral-dark',
    neutral: 'text-sand-400 dark:text-sand-dark-400'
  };

  return (
    <div
      className={cn(
        // Base styles - Pure white background with rounded corners
        'relative overflow-hidden rounded-3xl bg-white',
        'border shadow-card',
        'transition-all duration-300',
        // Dark mode
        'dark:bg-sand-dark-100',
        // Variant border
        variantStyles[variant],
        // Hover effect
        onClick && 'cursor-pointer hover:scale-[1.02] hover:shadow-xl',
        className
      )}
      onClick={onClick}
    >
      {/* Background Image (optional) */}
      {imageSrc && (
        <div
          className="absolute inset-0 opacity-5 bg-cover bg-center"
          style={{ backgroundImage: `url(${imageSrc})` }}
        />
      )}

      {/* Content */}
      <div className="relative z-10 p-6">
        {(Icon || title) && (
          <div className="flex items-center gap-3 mb-4">
            {Icon && (
              <div className={cn(
                'p-2.5 rounded-2xl border',
                iconBgStyles[variant]
              )}>
                <Icon className={cn('w-5 h-5', iconTextStyles[variant])} />
              </div>
            )}
            {title && (
              <div>
                <h3 className="text-base font-black text-sand-900 dark:text-sand-dark-900 tracking-tight">
                  {title}
                </h3>
                {subtitle && (
                  <p className="text-xs font-bold text-sand-400 dark:text-sand-dark-400 uppercase tracking-tight mt-0.5">
                    {subtitle}
                  </p>
                )}
              </div>
            )}
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
