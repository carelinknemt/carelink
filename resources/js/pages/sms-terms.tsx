import AppHead from '@/components/app-head';
import PageHero from '@/components/carelink/page-hero';
import { useCompanyInfo } from '@/lib/cms';

export default function SmsTerms() {
    const company = useCompanyInfo();
    const phone = company.phone || '(707) 854-9350';

    return (
        <div className="min-h-screen bg-slate-50 pb-16">
            <AppHead
                title="SMS Terms & Conditions"
                description="Carelink Medical Transportation LLC SMS terms and conditions: how we use text messages for booking confirmations, pickup reminders, driver updates, and opt-out instructions."
                keywords={[
                    'CareLink SMS terms',
                    'text message terms',
                    'SMS opt out',
                    'mobile messaging consent',
                    'CareLink text notifications',
                ]}
                canonical="/sms-terms"
                type="website"
                breadcrumbs={[
                    { name: 'Home', path: '/' },
                    { name: 'SMS Terms & Conditions', path: '/sms-terms' },
                ]}
            />

            <PageHero
                title="SMS Terms & Conditions"
                subtitle="How Carelink Medical Transportation uses text messages for booking confirmations, reminders, and trip updates."
            />

            <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-12">
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                    <h1 className="text-2xl font-black tracking-tight text-[#004B87] sm:text-3xl">
                        SMS Terms &amp; Conditions
                    </h1>
                    <div className="mt-6 space-y-5">
                        <p className="text-sm leading-relaxed text-slate-600 sm:text-base">
                            By providing your mobile phone number and agreeing
                            to receive text messages, you consent to receive SMS
                            messages from Carelink Medical Transportation LLC.
                            Messages may include transportation booking
                            confirmations, appointment and pickup reminders,
                            driver updates, schedule changes, cancellation
                            notices, and customer-support communications.
                        </p>
                        <p className="text-sm leading-relaxed text-slate-600 sm:text-base">
                            Message frequency varies depending on your scheduled
                            transportation and interactions with Carelink
                            Medical Transportation LLC. Message and data rates
                            may apply according to your mobile carrier&rsquo;s
                            plan.
                        </p>
                        <p className="text-sm leading-relaxed text-slate-600 sm:text-base">
                            You may opt out at any time by replying STOP to any
                            message. After opting out, you will receive a
                            confirmation message and no further SMS messages
                            will be sent unless you opt in again.
                        </p>
                        <p className="text-sm leading-relaxed text-slate-600 sm:text-base">
                            For assistance, reply HELP to any message, call
                            Carelink Medical Transportation LLC at {phone}, or
                            email help@carelinknemt.com
                        </p>
                        <p className="text-sm leading-relaxed text-slate-600 sm:text-base">
                            Consent to receive text messages is not a condition
                            of purchasing or receiving services. Mobile
                            information and SMS consent records will not be sold
                            or shared with third parties for marketing or
                            promotional purposes.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
