import type { InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface BeachInputProps extends InputHTMLAttributes<HTMLInputElement> {
    icon?: React.ReactNode;
}

export function BeachInput({ icon, className, ...props }: BeachInputProps) {
    return (
        <div className="relative">
            {icon && (
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-sand-400 dark:text-sand-dark-400">
                    {icon}
                </div>
            )}
            <input
                className={cn(
                    'w-full bg-white border border-sand-200 rounded-2xl px-4 py-3 text-sm font-medium text-sand-900',
                    'placeholder:text-sand-400 placeholder:font-normal',
                    'focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600',
                    'transition-all duration-200',
                    'disabled:opacity-50 disabled:cursor-not-allowed',
                    'dark:bg-sand-dark-100 dark:border-sand-dark-200 dark:text-sand-dark-900',
                    'dark:placeholder:text-sand-dark-400 dark:focus:ring-teal-dark/20 dark:focus:border-teal-dark',
                    icon && 'pl-12',
                    className
                )}
                {...props}
            />
        </div>
    );
}
