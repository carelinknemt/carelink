import { CalendarIcon } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface DatePickerProps {
    id: string;
    value: string;
    onChange: (isoDate: string) => void;
    placeholder?: string;
    disabled?: (date: Date) => boolean;
    captionLayout?: 'label' | 'dropdown' | 'dropdown-months' | 'dropdown-years';
    defaultMonth?: Date;
    error?: boolean;
}

const MEDIUM_DATE = new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' });

export function parseIsoDate(iso: string): Date | undefined {
    if (!iso) {
        return undefined;
    }

    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);

    if (!match) {
        return undefined;
    }

    return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
}

export function toIsoDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

export function formatIsoDate(iso: string): string {
    const date = parseIsoDate(iso);

    return date ? MEDIUM_DATE.format(date) : '—';
}

export default function DatePicker({
    id,
    value,
    onChange,
    placeholder = 'Select a date',
    disabled,
    captionLayout = 'label',
    defaultMonth,
    error,
}: DatePickerProps) {
    const [open, setOpen] = useState(false);
    const selected = parseIsoDate(value);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    id={id}
                    type="button"
                    variant="outline"
                    className={cn(
                        'h-9 w-full justify-start gap-2 bg-white px-3 text-sm font-normal dark:bg-white dark:text-slate-900 dark:placeholder:text-slate-400',
                        'dark:border-slate-300 dark:hover:bg-slate-100',
                        !selected &&
                            'text-muted-foreground dark:text-slate-500',
                        error &&
                            'border-red-500/80 focus-visible:border-red-500',
                    )}
                    aria-invalid={error}
                >
                    <CalendarIcon className="h-4 w-4 shrink-0 text-slate-400" />
                    {selected ? MEDIUM_DATE.format(selected) : placeholder}
                </Button>
            </PopoverTrigger>
            <PopoverContent
                className="w-auto bg-white p-0 dark:bg-white"
                align="start"
            >
                <Calendar
                    mode="single"
                    selected={selected}
                    defaultMonth={selected ?? defaultMonth}
                    onSelect={(date) => {
                        if (date) {
                            onChange(toIsoDate(date));
                            setOpen(false);
                        }
                    }}
                    disabled={disabled}
                    captionLayout={captionLayout}
                    autoFocus
                />
            </PopoverContent>
        </Popover>
    );
}
