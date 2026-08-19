import { Play, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { EVENTS, Joyride, STATUS } from 'react-joyride';
import type { Step } from 'react-joyride';
import { SIMULATIONS } from '@/components/kms/simulations';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { SimulationKey } from '@/data/kms-tours';

export default function GuidedTour({
    simulation,
    steps,
}: {
    simulation: SimulationKey;
    steps: Step[];
}) {
    const [run, setRun] = useState(false);
    const Simulation = SIMULATIONS[simulation];

    return (
        <Card className="border-[#E64A19]/40">
            <CardHeader className="flex flex-col justify-between gap-3 space-y-0 sm:flex-row sm:items-start">
                <div>
                    <CardTitle className="flex items-center gap-2 text-base">
                        <Sparkles className="size-4 shrink-0 text-[#E64A19]" />
                        Try it out
                    </CardTitle>
                    <p className="mt-1 text-sm text-muted-foreground">
                        A working copy of the page. Start the tour to walk
                        through the task step by step.
                    </p>
                </div>
                <Button
                    id="kms-tour-start"
                    type="button"
                    onClick={() => setRun(true)}
                >
                    <Play />
                    Start guided tour
                </Button>
            </CardHeader>
            <CardContent>
                <Simulation />
                <Joyride
                    run={run}
                    steps={steps}
                    continuous
                    scrollToFirstStep
                    options={{
                        showProgress: true,
                        skipBeacon: true,
                        buttons: ['back', 'skip', 'close', 'primary'],
                        closeButtonAction: 'skip',
                        overlayClickAction: false,
                        dismissKeyAction: 'close',
                        arrowColor: '#ffffff',
                        backgroundColor: '#ffffff',
                        primaryColor: '#E64A19',
                        textColor: '#0f172a',
                        overlayColor: 'rgba(2, 6, 23, 0.55)',
                        spotlightPadding: 6,
                        zIndex: 60,
                    }}
                    locale={{
                        back: 'Back',
                        close: 'Close',
                        last: 'Done',
                        next: 'Next',
                        nextWithProgress: 'Next ({current} of {total})',
                        skip: 'Skip tour',
                    }}
                    onEvent={(data) => {
                        if (
                            data.type === EVENTS.TOUR_END ||
                            data.status === STATUS.SKIPPED ||
                            data.status === STATUS.FINISHED
                        ) {
                            setRun(false);
                        }
                    }}
                />
            </CardContent>
        </Card>
    );
}
