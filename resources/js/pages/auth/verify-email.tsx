// Components
import { Form, Head } from '@inertiajs/react';
import AuthStatusBanner from '@/components/auth-status-banner';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { logout } from '@/routes';
import { send } from '@/routes/verification';

const BRAND_BUTTON_CLASS =
    'bg-[#004B87] text-white hover:bg-[#003d75] focus-visible:ring-[#004B87]/50';

export default function VerifyEmail({ status }: { status?: string }) {
    return (
        <>
            <Head title="Email verification">
                <meta name="robots" content="noindex, nofollow" />
            </Head>

            <div className="flex flex-col gap-6 text-center">
                <AuthStatusBanner
                    message={
                        status === 'verification-link-sent'
                            ? 'A new verification link has been sent to the email address you provided during registration.'
                            : undefined
                    }
                />

                <div className="rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm leading-relaxed text-amber-800">
                    We sent a verification email to the address on your
                    account. Click the link inside it to confirm your email.
                    Didn't receive it? Check your spam folder or resend below.
                </div>

                <Form {...send.form()} className="space-y-6 text-center">
                    {({ processing }) => (
                        <>
                            <Button
                                type="submit"
                                className={`w-full ${BRAND_BUTTON_CLASS}`}
                                disabled={processing}
                            >
                                {processing && <Spinner />}
                                Resend verification email
                            </Button>

                            <TextLink
                                href={logout()}
                                className="mx-auto block text-sm"
                            >
                                Log out
                            </TextLink>
                        </>
                    )}
                </Form>
            </div>
        </>
    );
}

VerifyEmail.layout = {
    title: 'Email verification',
    description:
        'Please verify your email address by clicking on the link we just emailed to you.',
};