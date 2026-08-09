import { List, LayoutGrid } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ViewToggleProps {
    view: 'list' | 'grid';
    onChange: (view: 'list' | 'grid') => void;
}

export default function ViewToggle({ view, onChange }: ViewToggleProps) {
    return (
        <div className="inline-flex items-center rounded-lg border border-sidebar-border/70 bg-muted/50 p-0.5">
            <Button
                variant={view === 'list' ? 'default' : 'ghost'}
                size="sm"
                className="h-7 px-2.5"
                onClick={() => onChange('list')}
            >
                <List className="mr-1.5 h-3.5 w-3.5" />
                List
            </Button>
            <Button
                variant={view === 'grid' ? 'default' : 'ghost'}
                size="sm"
                className="h-7 px-2.5"
                onClick={() => onChange('grid')}
            >
                <LayoutGrid className="mr-1.5 h-3.5 w-3.5" />
                Grid
            </Button>
        </div>
    );
}
