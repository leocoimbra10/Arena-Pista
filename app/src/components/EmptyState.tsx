import type { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
    icon: LucideIcon;
    title: string;
    description: string;
    actionLabel?: string;
    onAction?: () => void;
    color?: 'blue' | 'emerald' | 'orange' | 'coral' | 'sand';
}

export function EmptyState({
    icon: Icon,
    title,
    description,
    actionLabel,
    onAction,
    color = 'sand'
}: EmptyStateProps) {

    const colorStyles = {
        blue: 'bg-blue-100/50 text-blue-500 border-blue-200',
        emerald: 'bg-emerald-100/50 text-emerald-500 border-emerald-200',
        orange: 'bg-orange-100/50 text-orange-500 border-orange-200',
        coral: 'bg-coral-500/10 text-coral-500 border-coral-500/20',
        sand: 'bg-sand-100/50 text-sand-500 border-sand-200'
    };

    const buttonStyles = {
        blue: 'bg-blue-500 shadow-blue hover:bg-blue-600',
        emerald: 'bg-emerald-500 shadow-emerald hover:bg-emerald-600',
        orange: 'bg-orange-500 shadow-orange hover:bg-orange-600',
        coral: 'bg-coral-500 shadow-coral hover:bg-coral-600',
        sand: 'bg-sand-900 shadow-lg hover:bg-sand-800'
    };

    return (
        <div className="flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in duration-300">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center border-4 mb-4 shadow-sm ${colorStyles[color]}`}>
                <Icon className="w-10 h-10" />
            </div>

            <h3 className="font-condensed text-xl font-black text-slate-800 uppercase tracking-tight mb-2">
                {title}
            </h3>

            <p className="text-sm font-medium text-slate-400 max-w-[250px] leading-relaxed mb-6">
                {description}
            </p>

            {actionLabel && onAction && (
                <button
                    onClick={onAction}
                    className={`px-6 py-3 rounded-xl text-white font-condensed font-bold uppercase tracking-wider text-xs transition-all active:scale-95 shadow-lg ${buttonStyles[color]}`}
                >
                    {actionLabel}
                </button>
            )}
        </div>
    );
}
