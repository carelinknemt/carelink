import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { PaginationLink } from '@/types/carelink';

interface PaginationProps {
    links: PaginationLink[];
    from: number | null;
    to: number | null;
    total: number;
}

export default function Pagination({ links, from, to, total }: PaginationProps) {
    const pageLinks = links.filter(
        (link) => link.label !== '&laquo; Previous' && link.label !== 'Next &raquo;'
    );

    const prev = links.find((link) => link.label === '&laquo; Previous');
    const next = links.find((link) => link.label === 'Next &raquo;');

    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-muted-foreground">
                Showing <span className="font-medium text-foreground">{from ?? 0}</span>–
                <span className="font-medium text-foreground">{to ?? 0}</span> of{' '}
                <span className="font-medium text-foreground">{total}</span> trips
            </p>

            <div className="flex items-center gap-1">
                {prev?.url ? (
                    <Button variant="outline" size="sm" asChild>
                        <Link href={prev.url} preserveScroll>
                            <ChevronLeft className="mr-1 h-3.5 w-3.5" />
                            Previous
                        </Link>
                    </Button>
                ) : (
                    <Button variant="outline" size="sm" disabled>
                        <ChevronLeft className="mr-1 h-3.5 w-3.5" />
                        Previous
                    </Button>
                )}

                {pageLinks.map((link) => (
                    <Button
                        key={link.label}
                        variant={link.active ? 'default' : 'outline'}
                        size="icon"
                        className="h-8 w-8"
                        disabled={!link.url}
                        asChild={!!link.url}
                    >
                        {link.url ? (
                            <Link href={link.url} preserveScroll>
                                {link.label}
                            </Link>
                        ) : (
                            <span>{link.label}</span>
                        )}
                    </Button>
                ))}

                {next?.url ? (
                    <Button variant="outline" size="sm" asChild>
                        <Link href={next.url} preserveScroll>
                            Next
                            <ChevronRight className="ml-1 h-3.5 w-3.5" />
                        </Link>
                    </Button>
                ) : (
                    <Button variant="outline" size="sm" disabled>
                        Next
                        <ChevronRight className="ml-1 h-3.5 w-3.5" />
                    </Button>
                )}
            </div>
        </div>
    );
}
