import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import * as SelectPrimitive from '@radix-ui/react-select';

interface BeachSelectProps {
    value: string;
    onValueChange: (value: string) => void;
    options: { value: string; label: string; icon?: React.ReactNode }[];
    placeholder?: string;
    className?: string;
}

export function BeachSelect({
    value,
    onValueChange,
    options,
    placeholder = 'Selecione...',
    className
}: BeachSelectProps) {
    const selectedOption = options.find(opt => opt.value === value);

    return (
        <SelectPrimitive.Root value={value} onValueChange={onValueChange}>
            <SelectPrimitive.Trigger
                className={cn(
                    'w-full inline-flex items-center justify-between gap-3',
                    'bg-white border border-sand-200 rounded-2xl px-4 py-3',
                    'text-sm font-bold text-sand-900 uppercase tracking-wide',
                    'hover:bg-sand-50 focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600',
                    'transition-all duration-200',
                    'dark:bg-sand-dark-100 dark:border-sand-dark-200 dark:text-sand-dark-900',
                    'dark:hover:bg-sand-dark-200 dark:focus:ring-teal-dark/20 dark:focus:border-teal-dark',
                    className
                )}
            >
                <div className="flex items-center gap-3">
                    {selectedOption?.icon && (
                        <div className="w-9 h-9 bg-sand-100 dark:bg-sand-dark-200 rounded-xl flex items-center justify-center">
                            {selectedOption.icon}
                        </div>
                    )}
                    <SelectPrimitive.Value placeholder={placeholder} />
                </div>
                <ChevronDown className="w-5 h-5 text-sand-400 dark:text-sand-dark-400" />
            </SelectPrimitive.Trigger>

            <SelectPrimitive.Portal>
                <SelectPrimitive.Content
                    className={cn(
                        'overflow-hidden bg-white rounded-2xl shadow-card border border-sand-100',
                        'dark:bg-sand-dark-100 dark:border-sand-dark-200',
                        'z-50' // CRITICAL: High z-index to prevent overlap
                    )}
                    position="popper"
                    sideOffset={8}
                >
                    <SelectPrimitive.Viewport className="p-2">
                        {options.map((option) => (
                            <SelectPrimitive.Item
                                key={option.value}
                                value={option.value}
                                className={cn(
                                    'relative flex items-center gap-3 px-4 py-3 rounded-xl',
                                    'text-sm font-bold text-sand-900 uppercase tracking-wide',
                                    'cursor-pointer outline-none select-none',
                                    'hover:bg-sand-100 focus:bg-sand-100',
                                    'data-[state=checked]:bg-teal-600 data-[state=checked]:text-white',
                                    'dark:text-sand-dark-900 dark:hover:bg-sand-dark-200 dark:focus:bg-sand-dark-200',
                                    'dark:data-[state=checked]:bg-teal-dark'
                                )}
                            >
                                <SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText>
                            </SelectPrimitive.Item>
                        ))}
                    </SelectPrimitive.Viewport>
                </SelectPrimitive.Content>
            </SelectPrimitive.Portal>
        </SelectPrimitive.Root>
    );
}
