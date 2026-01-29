import type { ReactNode, ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface BeachButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary-teal' | 'secondary-coral' | 'ghost' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    children: ReactNode;
}

export function BeachButton({
    variant = 'primary-teal',
    size = 'md',
    className,
    children,
    ...props
}: BeachButtonProps) {
    const baseStyles = 'inline-flex items-center justify-center font-bold uppercase tracking-wide transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2';

    const variants = {
        'primary-teal': 'bg-teal-600 text-white rounded-2xl shadow-button-teal hover:scale-105 active:scale-95 focus:ring-teal-600/50 dark:bg-teal-dark dark:shadow-button-teal',
        'secondary-coral': 'bg-coral-500 text-white rounded-2xl shadow-button-coral hover:scale-105 active:scale-95 focus:ring-coral-500/50 dark:bg-coral-dark dark:shadow-button-coral',
        'ghost': 'bg-transparent text-sand-900 border-2 border-sand-400 rounded-2xl hover:bg-sand-100 active:bg-sand-200 focus:ring-sand-400/50 dark:text-sand-dark-900 dark:border-sand-dark-400 dark:hover:bg-sand-dark-100',
        'outline': 'bg-white text-sand-900 border-2 border-sand-200 rounded-2xl hover:bg-sand-50 active:bg-sand-100 focus:ring-teal-600/50 dark:bg-sand-dark-100 dark:text-sand-dark-900 dark:border-sand-dark-200',
    };

    const sizes = {
        sm: 'px-4 py-2 text-xs',
        md: 'px-6 py-3 text-sm',
        lg: 'px-8 py-4 text-base',
    };

    return (
        <button
            className={cn(
                baseStyles,
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
}
