import { Head, useForm } from '@inertiajs/react';
import { CalendarClock, Pencil } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { CmsField, CmsSectionRecord } from '@/lib/cms';
import { cn } from '@/lib/utils';
import { update as updateSection } from '@/routes/cms/sections';

type SectionDraft = Record<string, string | boolean | Record<string, string>[]>;

interface SectionForm {
    content: Record<string, string | boolean | Record<string, string>[] | null>;
}

interface CmsSectionsProps {
    sections: CmsSectionRecord[];
}

function fieldToDraft(
    section: CmsSectionRecord,
    field: CmsField,
): string | boolean | Record<string, string>[] {
    const value = section.content[field.key];

    if (field.type === 'list') {
        return Array.isArray(value) ? (value as string[]).join('\n') : '';
    }

    if (field.type === 'table') {
        const cols = field.cols;

        return Array.isArray(value)
            ? (value as Record<string, unknown>[]).map(
                  (row) =>
                      Object.fromEntries(
                          cols.map((col) => [
                              col.key,
                              col.type === 'textarea' &&
                              Array.isArray(row[col.key])
                                  ? (row[col.key] as string[]).join('\n')
                                  : (row[col.key] ?? ''),
                          ]),
                      ) as Record<string, string>,
              )
            : [];
    }

    if (field.type === 'number') {
        return value === null || value === undefined ? '' : String(value);
    }

    if (field.type === 'switch') {
        return Boolean(value);
    }

    return typeof value === 'string' ? value : '';
}

function draftToPayload(
    section: CmsSectionRecord,
    draft: SectionDraft,
): Record<string, unknown> {
    return Object.fromEntries(
        section.schema.map((field) => {
            const raw = draft[field.key] ?? '';

            if (field.type === 'list') {
                return [
                    field.key,
                    String(raw)
                        .split('\n')
                        .map((line) => line.trim())
                        .filter(Boolean),
                ];
            }

            if (field.type === 'table') {
                const rows = (raw as Record<string, string>[])
                    .map((row) =>
                        Object.fromEntries(
                            field.cols.map((col) => [
                                col.key,
                                col.type === 'textarea'
                                    ? String(row[col.key] ?? '')
                                          .split('\n')
                                          .map((line) => line.trim())
                                          .filter(Boolean)
                                    : col.type === 'number'
                                      ? row[col.key] === '' ||
                                        row[col.key] === null
                                          ? null
                                          : Number(row[col.key])
                                      : (row[col.key] ?? ''),
                            ]),
                        ),
                    )
                    .filter((row) =>
                        Object.values(row).some(
                            (cell) => cell !== '' && cell !== null,
                        ),
                    );

                return [field.key, rows];
            }

            if (field.type === 'number') {
                return [field.key, raw === '' ? null : Number(raw)];
            }

            if (field.type === 'switch') {
                return [field.key, Boolean(raw)];
            }

            return [field.key, raw === '' ? null : String(raw)];
        }),
    );
}

function FieldEditor({
    field,
    value,
    onChange,
}: {
    field: CmsField;
    value: string | boolean | Record<string, string>[] | undefined;
    onChange: (value: string | boolean | Record<string, string>[]) => void;
}) {
    const id = `cms-field-${field.key}`;

    if (field.type === 'list') {
        return (
            <div className="grid gap-1.5">
                <Label htmlFor={id}>{field.label}</Label>
                <Textarea
                    id={id}
                    rows={4}
                    value={String(value ?? '')}
                    onChange={(event) => onChange(event.target.value)}
                    placeholder="One item per line"
                />
            </div>
        );
    }

    if (field.type === 'table') {
        const rows = (value as Record<string, string>[]) ?? [];
        const updateRow = (index: number, colKey: string, cell: string) => {
            const next = rows.map((row, i) =>
                i === index ? { ...row, [colKey]: cell } : row,
            );

            onChange(next);
        };

        return (
            <div className="grid gap-2">
                <Label>{field.label}</Label>
                <div className="grid gap-3">
                    {rows.map((row, index) => (
                        <div
                            key={index}
                            className="space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-3"
                        >
                            {field.cols.map((col) => (
                                <div key={col.key} className="grid gap-1">
                                    <Label className="text-xs text-slate-500">
                                        {col.label}
                                    </Label>
                                    {col.type === 'textarea' ? (
                                        <Textarea
                                            rows={3}
                                            value={row[col.key] ?? ''}
                                            onChange={(event) =>
                                                updateRow(
                                                    index,
                                                    col.key,
                                                    event.target.value,
                                                )
                                            }
                                            placeholder="One per line"
                                            className="bg-white"
                                        />
                                    ) : (
                                        <Input
                                            type={
                                                col.type === 'number'
                                                    ? 'number'
                                                    : 'text'
                                            }
                                            value={row[col.key] ?? ''}
                                            onChange={(event) =>
                                                updateRow(
                                                    index,
                                                    col.key,
                                                    event.target.value,
                                                )
                                            }
                                            className="bg-white"
                                        />
                                    )}
                                </div>
                            ))}
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="text-destructive hover:text-destructive"
                                onClick={() =>
                                    onChange(rows.filter((_, i) => i !== index))
                                }
                            >
                                Remove row
                            </Button>
                        </div>
                    ))}
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                            onChange([
                                ...rows,
                                Object.fromEntries(
                                    field.cols.map((col) => [col.key, '']),
                                ) as Record<string, string>,
                            ])
                        }
                    >
                        Add row
                    </Button>
                </div>
            </div>
        );
    }

    if (field.type === 'switch') {
        return (
            <div className="flex items-center gap-2">
                <Checkbox
                    id={id}
                    checked={Boolean(value)}
                    onCheckedChange={(checked) => onChange(Boolean(checked))}
                />
                <Label htmlFor={id}>{field.label}</Label>
            </div>
        );
    }

    return (
        <div className="grid gap-1.5">
            <Label htmlFor={id}>{field.label}</Label>
            {field.type === 'textarea' ? (
                <Textarea
                    id={id}
                    rows={4}
                    value={String(value ?? '')}
                    onChange={(event) => onChange(event.target.value)}
                />
            ) : (
                <Input
                    id={id}
                    type={field.type === 'number' ? 'number' : 'text'}
                    value={String(value ?? '')}
                    onChange={(event) => onChange(event.target.value)}
                />
            )}
        </div>
    );
}

function SectionEditorDialog({
    section,
    open,
    onOpenChange,
}: {
    section: CmsSectionRecord;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    const form = useForm<SectionForm>({ content: {} });

    const [draft, setDraft] = useState<SectionDraft | null>(null);

    const draftReady =
        draft ??
        Object.fromEntries(
            section.schema.map((field) => [
                field.key,
                fieldToDraft(section, field),
            ]),
        );

    const setField = (
        key: string,
        value: string | boolean | Record<string, string>[],
    ) => {
        setDraft((prev) => ({ ...(prev ?? {}), [key]: value }));
    };

    const submit = () => {
        form.setData(
            'content',
            draftToPayload(section, draftReady) as SectionForm['content'],
        );
        form.put(updateSection.url({ section: section.slug }), {
            preserveScroll: true,
            onSuccess: () => onOpenChange(false),
        });
    };

    return (
        <Dialog
            open={open}
            onOpenChange={(next) => {
                if (!next) {
                    onOpenChange(false);
                }
            }}
        >
            <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>{section.title}</DialogTitle>
                    <DialogDescription>{section.description}</DialogDescription>
                </DialogHeader>
                <form
                    onSubmit={(event) => {
                        event.preventDefault();
                        submit();
                    }}
                    className="grid gap-4"
                >
                    {section.schema.map((field) => (
                        <FieldEditor
                            key={field.key}
                            field={field}
                            value={draftReady[field.key]}
                            onChange={(value) => setField(field.key, value)}
                        />
                    ))}
                    {form.errors.content && (
                        <p className="text-xs text-destructive">
                            {form.errors.content}
                        </p>
                    )}
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="outline">
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button type="submit" disabled={form.processing}>
                            Save changes
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default function CmsSections({ sections }: CmsSectionsProps) {
    const [editing, setEditing] = useState<CmsSectionRecord | null>(null);

    return (
        <>
            <Head title="Website Content">
                <meta name="robots" content="noindex, nofollow" />
            </Head>

            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Website Content
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Edit the text and settings that power the public
                            site. Changes go live immediately.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    {sections.map((section) => (
                        <Card
                            key={section.slug}
                            className={cn(
                                editing?.slug === section.slug &&
                                    'ring-2 ring-ring',
                            )}
                        >
                            <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0">
                                <div>
                                    <CardTitle className="text-base">
                                        {section.title}
                                    </CardTitle>
                                    <CardDescription className="mt-1 text-xs">
                                        {section.description}
                                    </CardDescription>
                                </div>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setEditing(section)}
                                >
                                    <Pencil className="size-3.5" />
                                    Edit
                                </Button>
                            </CardHeader>
                            <CardContent>
                                {section.updated_at ? (
                                    <Badge
                                        variant="secondary"
                                        className="gap-1 text-xs"
                                    >
                                        <CalendarClock className="size-3" />
                                        Updated {section.updated_at}
                                    </Badge>
                                ) : (
                                    <Badge
                                        variant="secondary"
                                        className="text-xs"
                                    >
                                        Using defaults
                                    </Badge>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {editing && (
                <SectionEditorDialog
                    key={editing.slug}
                    section={editing}
                    open={editing !== null}
                    onOpenChange={(open) => {
                        if (!open) {
                            setEditing(null);
                        }
                    }}
                />
            )}
        </>
    );
}
