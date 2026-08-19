import { Pencil, RotateCcw } from 'lucide-react';
import { useState } from 'react';
import SimulationShell from '@/components/kms/simulation-shell';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
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

const SECTIONS = [
    {
        slug: 'company_info',
        title: 'Company Info',
        description: 'Name, tagline, phone, email, and the about paragraph.',
    },
    {
        slug: 'dispatch_hours',
        title: 'Dispatch Hours',
        description: 'When dispatch lines are open, shown on the home page.',
    },
    {
        slug: 'payment_methods',
        title: 'Payment Methods',
        description: 'How passengers can pay for trips.',
    },
    {
        slug: 'page_heroes',
        title: 'Page Headers',
        description:
            'Title and subtitle of the hero banner on each public page.',
    },
];

export default function CmsSectionsSimulation() {
    const [editOpen, setEditOpen] = useState(false);
    const [restoreOpen, setRestoreOpen] = useState(false);

    return (
        <SimulationShell
            page="Website Content · Content Sections"
            description="Every content section with its editor. Open one to see the fields you can edit."
        >
            <div className="flex flex-col gap-4">
                <div className="flex justify-between gap-3">
                    <div>
                        <p className="text-lg font-semibold">
                            Content Sections
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Each card holds one area of the website. Changes go
                            live immediately.
                        </p>
                    </div>
                    <Button
                        id="kms-demo-cms-restore-all"
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => setRestoreOpen(true)}
                    >
                        <RotateCcw />
                        Restore all content
                    </Button>
                </div>

                <div
                    id="kms-demo-cms-grid"
                    className="grid gap-4 sm:grid-cols-2"
                >
                    {SECTIONS.map((section) => (
                        <Card key={section.slug}>
                            <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0">
                                <div>
                                    <CardTitle className="text-base">
                                        {section.title}
                                    </CardTitle>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        {section.description}
                                    </p>
                                </div>
                                <div className="flex shrink-0 gap-1">
                                    <Button
                                        id="kms-demo-cms-restore"
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        aria-label={`Restore ${section.title}`}
                                    >
                                        <RotateCcw />
                                    </Button>
                                    <Button
                                        id="kms-demo-cms-edit"
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        aria-label={`Edit ${section.title}`}
                                        onClick={() => setEditOpen(true)}
                                    >
                                        <Pencil />
                                    </Button>
                                </div>
                            </CardHeader>
                        </Card>
                    ))}
                </div>
            </div>

            <Dialog open={editOpen} onOpenChange={setEditOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Company Info</DialogTitle>
                        <DialogDescription>
                            Update the company details shown on the public
                            website. Saving publishes immediately.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4">
                        <div className="grid gap-1.5">
                            <Label htmlFor="demo-cms-name">Company name</Label>
                            <Input
                                id="demo-cms-name"
                                defaultValue="CareLink Medical Transportation LLC"
                            />
                        </div>
                        <div className="grid gap-1.5">
                            <Label htmlFor="demo-cms-tagline">Tagline</Label>
                            <Input
                                id="demo-cms-tagline"
                                defaultValue="Dignified, compassionate, punctual NEMT."
                            />
                        </div>
                        <div className="grid gap-1.5">
                            <Label htmlFor="demo-cms-about">About</Label>
                            <Textarea
                                id="demo-cms-about"
                                rows={3}
                                defaultValue="Family owned and operated since 2004, serving Humboldt and neighboring counties."
                            />
                        </div>
                    </div>
                    <DialogFooter className="mt-4">
                        <DialogClose asChild>
                            <Button type="button" variant="outline">
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button
                            type="button"
                            onClick={() => setEditOpen(false)}
                        >
                            Save
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={restoreOpen} onOpenChange={setRestoreOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Restore all content?</DialogTitle>
                        <DialogDescription>
                            Every section and collection resets to its shipped
                            defaults. Your edits are not recoverable.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="outline">
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={() => setRestoreOpen(false)}
                        >
                            <RotateCcw />
                            Restore everything
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </SimulationShell>
    );
}
