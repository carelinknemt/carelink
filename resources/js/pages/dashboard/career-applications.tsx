import { Head, Link } from '@inertiajs/react';
import { Briefcase, Download, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate } from '@/lib/bookings';
import { careers } from '@/routes';
import { resume as applicationResume } from '@/routes/dashboard/career-applications';
import type { CareerApplicationRecord } from '@/types/carelink';

interface MyApplicationsProps {
    applications: CareerApplicationRecord[];
}

export default function MyApplications({ applications }: MyApplicationsProps) {
    return (
        <>
            <Head title="My Applications">
                <meta name="robots" content="noindex, nofollow" />
            </Head>

            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-semibold tracking-tight">
                        My Applications
                    </h1>
                    <p className="text-muted-foreground text-sm">
                        Job applications you have submitted with your account.
                    </p>
                </div>

                {applications.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
                            <Briefcase className="text-muted-foreground size-10" />
                            <div className="flex flex-col gap-1">
                                <p className="font-semibold">
                                    No applications yet
                                </p>
                                <p className="text-muted-foreground text-sm">
                                    Browse open positions and submit your first
                                    application.
                                </p>
                            </div>
                            <Link
                                href={careers()}
                                className="mt-2 rounded-md bg-[#004B87] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#003865]"
                            >
                                View open positions
                            </Link>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-4">
                        {applications.map((application) => (
                            <Card key={application.id}>
                                <CardHeader className="flex flex-row items-start justify-between gap-3">
                                    <div className="flex flex-col gap-1">
                                        <CardTitle className="text-base">
                                            {application.position ?? 'Position'}
                                        </CardTitle>
                                        <p className="text-muted-foreground text-sm">
                                            Submitted{' '}
                                            {formatDate(
                                                application.submitted_at,
                                            )}
                                        </p>
                                    </div>
                                    {application.resume_name && (
                                        <Link
                                            href={applicationResume.url({
                                                application:
                                                    application.id,
                                            })}
                                            className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-input bg-background px-3 py-1.5 text-sm font-medium shadow-xs transition-colors hover:bg-accent"
                                        >
                                            <Download className="size-4" />
                                            Resume
                                        </Link>
                                    )}
                                </CardHeader>
                                <CardContent className="flex flex-col gap-4">
                                    <div className="grid gap-x-6 gap-y-2 text-sm sm:grid-cols-3">
                                        <div className="flex flex-col gap-0.5">
                                            <span className="text-muted-foreground text-xs">
                                                Full name
                                            </span>
                                            <span className="font-medium">
                                                {application.name}
                                            </span>
                                        </div>
                                        <div className="flex flex-col gap-0.5">
                                            <span className="text-muted-foreground text-xs">
                                                Email
                                            </span>
                                            <span className="font-medium">
                                                {application.email}
                                            </span>
                                        </div>
                                        <div className="flex flex-col gap-0.5">
                                            <span className="text-muted-foreground text-xs">
                                                Phone
                                            </span>
                                            <span className="font-medium">
                                                {application.phone}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className="flex items-center gap-1.5 text-muted-foreground text-xs">
                                            <FileText className="size-3.5" />
                                            Cover letter
                                        </span>
                                        <p className="max-w-3xl rounded-md border bg-muted/50 p-3 text-sm leading-relaxed whitespace-pre-line">
                                            {application.cover_letter}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}