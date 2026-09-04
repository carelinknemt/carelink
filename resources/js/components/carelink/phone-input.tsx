import { parsePhoneNumber } from 'libphonenumber-js';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

const DEFAULT_COUNTRY_CODE = '+1';

interface SplitPhone {
    countryCode: string;
    number: string;
}

interface PhoneInputProps {
    id?: string;
    value: string;
    onChange: (value: string) => void;
    invalid?: boolean;
    className?: string;
    placeholder?: string;
}

export function splitPhoneNumber(full: string): SplitPhone {
    const raw = String(full ?? '').trim();

    if (!raw) {
        return { countryCode: DEFAULT_COUNTRY_CODE, number: '' };
    }

    try {
        const parsed = parsePhoneNumber(raw, 'US');

        return {
            countryCode: `+${parsed.countryCallingCode}`,
            number: parsed.nationalNumber,
        };
    } catch {
        return {
            countryCode: DEFAULT_COUNTRY_CODE,
            number: raw.replace(/(^|\s)\+\d{1,3}\s*/g, ' ').trim(),
        };
    }
}

export function joinPhoneNumber(countryCode: string, number: string): string {
    const digits = number.trim();

    if (!digits || /^\+\d/.test(digits)) {
        return digits;
    }

    return `${countryCode} ${digits}`;
}

export function isUsPhoneNumber(value: string): boolean {
    if (!value.trim()) {
        return true;
    }

    try {
        const parsed = parsePhoneNumber(value, 'US');

        return parsed.country === 'US' && parsed.isValid();
    } catch {
        return false;
    }
}

export default function PhoneInput({
    id,
    value,
    onChange,
    invalid = false,
    className,
    placeholder = '',
}: PhoneInputProps) {
    const { countryCode, number } = splitPhoneNumber(value);

    return (
        <div className="flex gap-2 sm:gap-3">
            <Select
                value={countryCode}
                onValueChange={(code) =>
                    onChange(joinPhoneNumber(code, number))
                }
            >
                <SelectTrigger
                    id={id}
                    className={`w-20 shrink-0 sm:w-36 ${className ?? ''}`}
                    aria-invalid={invalid}
                >
                    <SelectValue placeholder="Code" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="+1">US (+1)</SelectItem>
                </SelectContent>
            </Select>
            <Input
                type="tel"
                inputMode="tel"
                value={number}
                onChange={(event) =>
                    onChange(joinPhoneNumber(countryCode, event.target.value))
                }
                placeholder={placeholder}
                aria-invalid={invalid}
                className={`min-w-0 flex-1 ${className ?? ''}`}
            />
        </div>
    );
}
