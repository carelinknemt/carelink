import { Check, Clock } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface TimePickerProps {
    id: string;
    value: string;
    onChange: (time: string) => void;
    placeholder?: string;
    error?: boolean;
}

const TIME_OPTIONS: string[] = [];

for (let hour = 0; hour < 24; hour++) {
    for (const minute of [0, 15, 30, 45]) {
        const period = hour < 12 ? 'AM' : 'PM';
        const hour12 = hour % 12 === 0 ? 12 : hour % 12;

        TIME_OPTIONS.push(
            `${String(hour12).padStart(2, '0')}:${String(minute).padStart(2, '0')} ${period}`,
        );
    }
}

export default function TimePicker({
    id,
    value,
    onChange,
    placeholder = 'Select a time',
    error,
}: TimePickerProps) {
    const [open, setOpen] = useState(false);

    const handleSelect = (time: string) => {
        onChange(time);
        setOpen(false);
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    id={id}
                    type="button"
                    variant="outline"
                    className={cn(
                        'h-9 w-full justify-start gap-2 bg-white px-3 text-sm font-normal dark:border-slate-300 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100',
                        !value && 'text-muted-foreground dark:text-slate-500',
                        error &&
                            'border-red-500/80 focus-visible:border-red-500',
                    )}
                    aria-invalid={error}
                >
                    <Clock className="h-4 w-4 shrink-0 text-slate-400" />
                    {value || placeholder}
                </Button>
            </PopoverTrigger>
            <PopoverContent
                className="w-44 bg-white p-1 dark:bg-white"
                align="start"
            >
                <div className="max-h-64 overflow-y-auto">
                    {TIME_OPTIONS.map((time) => (
                        <button
                            key={time}
                            type="button"
                            onClick={() => handleSelect(time)}
                            className={cn(
                                'flex w-full items-center justify-between rounded-md px-3 py-1.5 text-left text-sm transition',
                                time === value
                                    ? 'bg-[#004B87] font-semibold text-white'
                                    : 'text-slate-700 hover:bg-slate-100 dark:text-slate-700',
                            )}
                        >
                            {time}
                            {time === value && (
                                <Check className="h-3.5 w-3.5" />
                            )}
                        </button>
                    ))}
                </div>
            </PopoverContent>
        </Popover>
    );
}
