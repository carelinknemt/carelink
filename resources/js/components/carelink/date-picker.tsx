import { CalendarIcon } from 'lucide-react';
import type { ChangeEvent, KeyboardEvent } from 'react';
import { useEffect, useRef, useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
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

function toInputValue(date: Date | undefined): string {
    if (!date) {
        return '';
    }

    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${month}/${day}/${date.getFullYear()}`;
}

function parseInputDate(text: string): Date | undefined {
    const match = /^(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})$/.exec(text.trim());

    if (!match) {
        return undefined;
    }

    const month = Number(match[1]);
    const day = Number(match[2]);
    const year = Number(match[3]);

    const date = new Date(year, month - 1, day);

    const roundTrips =
        date.getFullYear() === year &&
        date.getMonth() === month - 1 &&
        date.getDate() === day;

    return roundTrips ? date : undefined;
}

export default function DatePicker({
    id,
    value,
    onChange,
    placeholder = 'mm/dd/yyyy',
    disabled,
    captionLayout = 'dropdown',
    defaultMonth,
    error,
}: DatePickerProps) {
    const [open, setOpen] = useState(false);
    const [draft, setDraft] = useState<string | null>(null);
    const previousValue = useRef(value);

    useEffect(() => {
        if (previousValue.current !== value) {
            previousValue.current = value;
            setDraft(null);
        }
    }, [value]);

    const selected = parseIsoDate(value);
    const display = draft ?? toInputValue(selected);

    function handleChange(event: ChangeEvent<HTMLInputElement>) {
        const next = event.target.value;
        setDraft(next);

        if (next === '') {
            onChange('');

            return;
        }

        const parsed = parseInputDate(next);

        if (parsed) {
            onChange(toIsoDate(parsed));
        }
    }

    function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
        if (event.key === 'Enter') {
            setOpen(false);
        }
    }

    function handleBlur() {
        setDraft(null);
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <div className="relative">
                <Input
                    id={id}
                    type="text"
                    inputMode="numeric"
                    autoComplete="off"
                    placeholder={placeholder}
                    value={display}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    onBlur={handleBlur}
                    className={cn(
                        'pr-9',
                        error &&
                            'border-red-500/80 focus-visible:border-red-500',
                    )}
                    aria-invalid={error}
                />
                <PopoverTrigger asChild>
                    <button
                        type="button"
                        aria-label="Open calendar"
                        className="absolute inset-y-0 right-0 flex w-9 items-center justify-center text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-700"
                    >
                        <CalendarIcon className="h-4 w-4 shrink-0" />
                    </button>
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
            </div>
        </Popover>
    );
}
