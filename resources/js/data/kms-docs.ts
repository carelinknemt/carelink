export type KmsCalloutVariant = 'info' | 'tip' | 'warning';

export type KmsBlock =
    | { type: 'paragraph'; text: string }
    | { type: 'steps'; title?: string; items: string[] }
    | {
          type: 'callout';
          variant: KmsCalloutVariant;
          title?: string;
          text: string;
      }
    | { type: 'table'; title?: string; headers: string[]; rows: string[][] };

export interface KmsArticle {
    slug: string;
    title: string;
    summary: string;
    blocks: KmsBlock[];
}

export interface KmsCategory {
    slug: string;
    title: string;
    summary: string;
    articles: KmsArticle[];
}

export const kmsCategories: KmsCategory[] = [
    {
        slug: 'getting-started',
        title: 'Getting Started',
        summary:
            'Sign in, understand the dashboard layout, and find your way around.',
        articles: [
            {
                slug: 'what-is-the-dashboard',
                title: 'What is the dashboard?',
                summary:
                    'An overview of the CareLink dashboard and what it is used for.',
                blocks: [
                    {
                        type: 'paragraph',
                        text: 'The CareLink dashboard is the internal workspace used by the CareLink team. It brings every daily task into one place: tracking and updating trips, flagging problem passengers, monitoring payments, reviewing job applications, approving business partner requests, managing user accounts, keeping the fleet maintained, reading contact messages, and editing the public website content.',
                    },
                    {
                        type: 'paragraph',
                        text: 'Each section of the dashboard is covered in detail in this Knowledge Base. Use the navigation on the left to jump to a topic, or use the search box at the top to find an article.',
                    },
                    {
                        type: 'steps',
                        title: 'The main areas of the dashboard',
                        items: [
                            'Dashboard: an overview of recent activity at a glance.',
                            'Analytics: booking volumes and revenue over 7, 30, or 90 days.',
                            'Bookings: every trip request, its status, and its payment state.',
                            'Blacklisted Passengers: passengers flagged by email or phone so the team can spot repeated issues.',
                            'Payments: payment records and their confirmation status.',
                            'Applications: employment applications submitted through the careers page.',
                            'Job Openings: create and manage the roles posted on the careers page.',
                            'Users: invite team members and manage their accounts.',
                            'Vehicle Maintenance: log service visits for the fleet and keep vehicle details up to date.',
                            'Business Partners: partnership requests from organizations.',
                            'Contact Messages: inquiries sent through the website contact form.',
                            'Website Content: edit what appears on the public website.',
                            'Knowledge Base: this guide.',
                        ],
                    },
                    {
                        type: 'callout',
                        variant: 'tip',
                        title: 'Bookmark this page',
                        text: 'The Knowledge Base is linked from the Resources section of the dashboard sidebar, so you can always get back here with one click.',
                    },
                ],
            },
            {
                slug: 'logging-in-and-your-account',
                title: 'Logging in and your account',
                summary:
                    'How to sign in, reset your password, and what to do when access does not work.',
                blocks: [
                    {
                        type: 'paragraph',
                        text: 'Every team member signs in with the email address and password on their CareLink account. There is no separate administrator login: the dashboard and this Knowledge Base use the same account.',
                    },
                    {
                        type: 'steps',
                        title: 'To log in',
                        items: [
                            'Open the CareLink website and click the sign in link, or open /login directly.',
                            'Enter the email address on your account.',
                            'Enter your password and click Sign In.',
                        ],
                    },
                    {
                        type: 'paragraph',
                        text: 'If you have never chosen a password, use the Forgot Password link on the sign in page. A reset link is emailed to you, and it lets you set your own password.',
                    },
                    {
                        type: 'paragraph',
                        text: 'When a manager adds your account, you receive two emails: a password reset link, and a link to this Knowledge Base. Both arrive right after your account is created.',
                    },
                    {
                        type: 'table',
                        title: 'When you cannot sign in',
                        headers: ['Situation', 'What to do'],
                        rows: [
                            [
                                'You forgot your password',
                                'Use the Forgot Password link and follow the reset email.',
                            ],
                            [
                                'You never received the reset email',
                                'Check spam and junk folders, then ask a manager to send a new reset link from the Users page.',
                            ],
                            [
                                'Your account is banned',
                                'Ask a manager to unban your account from the Users page. Banned accounts cannot sign in.',
                            ],
                            [
                                'Your email is not verified',
                                'Verification is not required to use the dashboard. You can keep working normally.',
                            ],
                        ],
                    },
                ],
            },
            {
                slug: 'dashboard-layout-tour',
                title: 'Dashboard layout tour',
                summary:
                    'How the sidebar and page headers work so you can reach every feature quickly.',
                blocks: [
                    {
                        type: 'paragraph',
                        text: 'Once you sign in, every dashboard page shares the same shell: a sidebar on the left and a page header with breadcrumbs on top.',
                    },
                    {
                        type: 'steps',
                        title: 'The sidebar',
                        items: [
                            'Overview: Dashboard and Analytics.',
                            'Trips & Billing: Bookings, Blacklisted Passengers, and Payments.',
                            'Recruitment: Applications and Job Openings.',
                            'Administration: Users, Vehicle Maintenance, Business Partners, Contact Messages, and Website Content.',
                            'Resources: the Knowledge Base you are reading right now.',
                        ],
                    },
                    {
                        type: 'paragraph',
                        text: 'The navigation is role-aware: each member only sees the sections their role allows. The full list stays available on every screen size, on mobile it opens from a menu button. Click the CareLink logo at the top to return to the dashboard overview at any time.',
                    },
                    {
                        type: 'paragraph',
                        text: 'Each page shows its own breadcrumb trail under the header, for example Dashboard > Users. This tells you where you are and lets you jump back to the previous level.',
                    },
                    {
                        type: 'callout',
                        variant: 'info',
                        title: 'Unsure where a feature lives?',
                        text: 'Use the search box on the Knowledge Base page. It searches every article, so typing a task such as "export bookings" points you to the right page instantly.',
                    },
                ],
            },
        ],
    },
    {
        slug: 'trips-bookings',
        title: 'Trips & Bookings',
        summary:
            'Work with trip requests: view, filter, update status, export, and cancel.',
        articles: [
            {
                slug: 'viewing-bookings',
                title: 'Viewing bookings',
                summary:
                    'How to read the bookings list and open a booking for details.',
                blocks: [
                    {
                        type: 'paragraph',
                        text: 'The Bookings page lists every trip request made through the website. New bookings arrive here automatically and are shown with their passenger details, requested service, trip date and time, pickup and dropoff addresses, status, and payment state.',
                    },
                    {
                        type: 'paragraph',
                        text: 'The list is ordered by trip date and shows pending dispatch bookings first by default, so the trips that need attention are on top. Choose 15, 25, 50, or 100 rows per page, and use the pagination controls at the bottom to move between pages.',
                    },
                    {
                        type: 'steps',
                        title: 'To open a booking',
                        items: [
                            'Go to Trips & Billing > Bookings.',
                            'Click any row or the View button on the booking you need.',
                            'The booking detail page shows the full passenger contact information, trip details, fare, and payment information, plus the status timeline.',
                        ],
                    },
                    {
                        type: 'callout',
                        variant: 'tip',
                        title: 'Spot the payment state quickly',
                        text: 'The payments column on the list shows whether each booking is paid. A booking can only be marked completed after its payment is confirmed.',
                    },
                ],
            },
            {
                slug: 'filtering-sorting-exporting',
                title: 'Filtering, sorting and exporting',
                summary:
                    'Narrow down the bookings list and download it as a spreadsheet.',
                blocks: [
                    {
                        type: 'paragraph',
                        text: 'The bookings list supports several filters so you can focus on exactly the trips you need. All filters combine together.',
                    },
                    {
                        type: 'table',
                        title: 'Available filters',
                        headers: ['Filter', 'What it does'],
                        rows: [
                            [
                                'Status',
                                'Show only trips in one status, such as In Transit or Completed.',
                            ],
                            [
                                'Date from / Date to',
                                'Limit trips to a date range. Leave either side empty for no limit.',
                            ],
                            [
                                'Service type',
                                'Show only one service type, such as wheelchair transport.',
                            ],
                            [
                                'Search',
                                'Find trips by passenger name or trip number.',
                            ],
                            [
                                'Sort',
                                'Order the list by trip date, created date, or total, in either direction.',
                            ],
                        ],
                    },
                    {
                        type: 'paragraph',
                        text: 'Filters update the list as you change them. The page keeps your current filters while you open bookings, so coming back does not lose your view.',
                    },
                    {
                        type: 'steps',
                        title: 'To export the filtered list',
                        items: [
                            'Set the filters you want included in the export.',
                            'Click the Export CSV button.',
                            'A CSV file downloads containing every row that matches the current filters, ready for Excel or Google Sheets.',
                        ],
                    },
                    {
                        type: 'steps',
                        title: 'To export a single booking',
                        items: [
                            'Open the booking from the list.',
                            'Click the export button on the detail page.',
                            'A CSV containing that booking is downloaded.',
                        ],
                    },
                    {
                        type: 'callout',
                        variant: 'info',
                        title: 'Exports follow your filters',
                        text: 'The list export uses the exact same filters you see on screen. To export everything, clear the filters first.',
                    },
                ],
            },
            {
                slug: 'booking-statuses-and-workflow',
                title: 'Booking statuses and the dispatch workflow',
                summary:
                    'The meaning of each trip status and how to move a trip forward.',
                blocks: [
                    {
                        type: 'paragraph',
                        text: 'Every booking moves through a status workflow. The current status tells the whole team where the trip stands, so keep it up to date as work happens on the road.',
                    },
                    {
                        type: 'table',
                        title: 'Trip statuses',
                        headers: ['Status', 'Meaning'],
                        rows: [
                            [
                                'Pending Dispatch',
                                'The booking is new and waiting for a vehicle to be assigned.',
                            ],
                            [
                                'Dispatched',
                                'A vehicle has been assigned and the crew is notified.',
                            ],
                            [
                                'In Transit',
                                'The vehicle is on the road to pick up or drop off the passenger.',
                            ],
                            [
                                'Completed',
                                'The trip finished and the passenger was delivered.',
                            ],
                            [
                                'Cancelled',
                                'The trip will not happen. Cancelled trips show the reason and refund state.',
                            ],
                        ],
                    },
                    {
                        type: 'steps',
                        title: 'To update a booking status',
                        items: [
                            'Open the booking from the Bookings list.',
                            'Use the status selector on the booking detail page.',
                            'Pick the new status and save. The change is reflected in the list and in the analytics charts immediately.',
                        ],
                    },
                    {
                        type: 'callout',
                        variant: 'tip',
                        title: 'Mark trips completed on time',
                        text: 'Only completed trips count toward the completion rate shown on the Analytics page, so update the status as soon as the trip wraps up.',
                    },
                ],
            },
            {
                slug: 'cancelling-bookings',
                title: 'Cancelling bookings and refunds',
                summary:
                    'Cancel a trip, record the reason, and refund the passenger when needed.',
                blocks: [
                    {
                        type: 'paragraph',
                        text: 'Sometimes a trip cannot happen: the passenger cancels, the vehicle breaks down, or the request was a duplicate. CareLink lets you cancel the booking and, if the passenger already paid, issue a refund at the same time.',
                    },
                    {
                        type: 'steps',
                        title: 'To cancel a booking',
                        items: [
                            'Open the booking from the Bookings list.',
                            'Click Cancel Booking.',
                            'Confirm the cancellation. The booking status changes to Cancelled.',
                        ],
                    },
                    {
                        type: 'steps',
                        title: 'To refund a paid booking',
                        items: [
                            'Open the cancelled booking.',
                            'Click the refund action on the booking detail page.',
                            'Confirm the refund. The passenger receives the money back on their original payment method.',
                        ],
                    },
                    {
                        type: 'callout',
                        variant: 'warning',
                        title: 'Refunds happen first',
                        text: 'When a paid booking is cancelled, the refund is processed automatically as part of the cancellation. Check the payment record afterwards to confirm it shows the refund.',
                    },
                    {
                        type: 'callout',
                        variant: 'info',
                        title: 'Unpaid bookings',
                        text: 'If the passenger never paid, no refund is needed. The booking is simply cancelled and removed from the dispatch queue.',
                    },
                ],
            },
        ],
    },
    {
        slug: 'blacklisted-passengers',
        title: 'Blacklisted Passengers',
        summary:
            'Flag passengers by email or phone so the team can spot repeated issues before dispatch.',
        articles: [
            {
                slug: 'what-the-blacklist-does',
                title: 'What the blacklist does',
                summary: 'How blacklisting works and when it is useful.',
                blocks: [
                    {
                        type: 'paragraph',
                        text: 'The blacklist is a way to flag passengers who have caused repeated problems, such as no-shows, late cancellations, or difficult behavior. When a passenger is blacklisted by email or phone, every booking that matches that email or phone number is flagged, so the dispatch team sees the history before assigning a vehicle.',
                    },
                    {
                        type: 'paragraph',
                        text: 'The Blacklisted Passengers page lives under Trips & Billing in the sidebar and is available to dispatchers and admins. It lists each flagged email or phone with the reason, who added it, and when.',
                    },
                    {
                        type: 'callout',
                        variant: 'info',
                        title: 'Flagged, not blocked',
                        text: 'Blacklisting does not stop passengers from booking. It marks their bookings so your team can review them before the trip, instead of turning the passenger away at checkout.',
                    },
                ],
            },
            {
                slug: 'blacklisting-a-passenger',
                title: 'Blacklisting a passenger',
                summary:
                    'Flag a passenger by email or phone so their bookings stand out.',
                blocks: [
                    {
                        type: 'steps',
                        title: 'To blacklist a passenger',
                        items: [
                            'Go to Trips & Billing > Blacklisted Passengers.',
                            'Click Blacklist passenger.',
                            'Enter the email address and/or phone number. At least one of the two is required.',
                            'Write the reason the passenger is being blacklisted. It must be at least 20 characters.',
                            'Submit. The entry appears in the list and matching bookings are flagged.',
                        ],
                    },
                    {
                        type: 'callout',
                        variant: 'tip',
                        title: 'Write a clear reason',
                        text: 'The reason is what your team will read when a flagged booking arrives. Be specific, for example "no-show on two wheelchairs trips" instead of just "problem passenger".',
                    },
                ],
            },
            {
                slug: 'removing-from-the-blacklist',
                title: 'Removing a passenger from the blacklist',
                summary: 'Clear a flag when it no longer applies.',
                blocks: [
                    {
                        type: 'steps',
                        title: 'To remove a passenger',
                        items: [
                            'Go to Trips & Billing > Blacklisted Passengers.',
                            'Find the entry with the search box, which matches email, phone, or reason.',
                            'Click the remove action next to the entry.',
                            'Confirm the removal. Their bookings are no longer flagged.',
                        ],
                    },
                    {
                        type: 'paragraph',
                        text: 'Each entry shows who blacklisted the passenger and when, so you can check the history before removing it.',
                    },
                ],
            },
        ],
    },
    {
        slug: 'payments',
        title: 'Payments',
        summary:
            'Review payment records and understand what each payment status means.',
        articles: [
            {
                slug: 'viewing-payments',
                title: 'Viewing payments',
                summary:
                    'How to read the payments list and find a specific payment.',
                blocks: [
                    {
                        type: 'paragraph',
                        text: 'The Payments page records every payment made through the booking flow. Each row shows the passenger, the trip number, the amount, and when the payment was confirmed.',
                    },
                    {
                        type: 'steps',
                        title: 'To review payments',
                        items: [
                            'Go to Trips & Billing > Payments.',
                            'Use the status filter to show paid, pending, refunded, or all payments.',
                            'Use the date range and search fields to narrow down the results.',
                        ],
                    },
                    {
                        type: 'callout',
                        variant: 'info',
                        title: 'Paid by default',
                        text: 'The page opens showing paid payments, which is the view the dispatch team needs most days. Switch the filter to see the rest.',
                    },
                ],
            },
            {
                slug: 'understanding-payment-statuses',
                title: 'Understanding payment statuses',
                summary:
                    'What Pending, Paid, and Refunded mean, and how a payment moves between them.',
                blocks: [
                    {
                        type: 'table',
                        title: 'Payment statuses',
                        headers: ['Status', 'Meaning'],
                        rows: [
                            [
                                'Pending',
                                'The passenger has not paid yet, or the payment is still being processed. The trip can be worked, but it is not confirmed as paid.',
                            ],
                            [
                                'Paid',
                                'The payment was confirmed. The booking is eligible to be marked Completed.',
                            ],
                            [
                                'Refunded',
                                'The money was returned to the passenger, usually because the trip was cancelled. Refunded payments no longer count as collected revenue.',
                            ],
                        ],
                    },
                    {
                        type: 'paragraph',
                        text: 'A payment becomes Paid automatically when the passenger completes checkout on the website. You do not need to enter payments manually. When a paid booking is cancelled, the payment moves to Refunded automatically as part of the cancellation.',
                    },
                    {
                        type: 'callout',
                        variant: 'tip',
                        title: 'Payments and completed trips',
                        text: 'The system tracks revenue from paid trips. If a trip shows Paid in the payments list but the booking still looks unfinished, check the booking status first: only Completed trips count toward the analytics completion rate.',
                    },
                    {
                        type: 'callout',
                        variant: 'warning',
                        title: 'Pending payments',
                        text: 'A booking with a pending payment is not counted as revenue. Follow up with dispatch if a trip was already completed but the payment is still pending, since the passenger may have been taken on trust.',
                    },
                ],
            },
        ],
    },
    {
        slug: 'recruitment',
        title: 'Recruitment',
        summary:
            'Post job openings and review applications from the careers page.',
        articles: [
            {
                slug: 'managing-job-openings',
                title: 'Managing job openings',
                summary:
                    'Create, edit, close, and remove the roles listed on the careers page.',
                blocks: [
                    {
                        type: 'paragraph',
                        text: 'Job openings are the roles displayed on the public careers page, where candidates apply. Managing them means keeping the list accurate so applicants always see current roles.',
                    },
                    {
                        type: 'steps',
                        title: 'To add a job opening',
                        items: [
                            'Go to Recruitment > Job Openings.',
                            'Click Add Opening.',
                            'Fill in the title, location, employment type, summary, and requirements.',
                            'Save. The opening appears on the public careers page immediately.',
                        ],
                    },
                    {
                        type: 'steps',
                        title: 'To edit or close an opening',
                        items: [
                            'Open Recruitment > Job Openings.',
                            'Use the edit action to change any field.',
                            'Use the close/reopen action to take the role down from the careers page without deleting it, or to put it back up.',
                            'Use the delete action to remove the opening entirely, including its applications.',
                        ],
                    },
                    {
                        type: 'callout',
                        variant: 'tip',
                        title: 'Close instead of delete',
                        text: 'Closing hides the opening from the website but keeps its applications for review. Only delete an opening when you no longer need the applications attached to it.',
                    },
                    {
                        type: 'table',
                        title: 'Employment types',
                        headers: ['Type', 'Use when'],
                        rows: [
                            ['Full-Time', 'A regular full-time position.'],
                            ['Part-Time', 'A regular part-time position.'],
                            ['Contract', 'A fixed-term or contract role.'],
                        ],
                    },
                ],
            },
            {
                slug: 'reviewing-applications',
                title: 'Reviewing applications',
                summary:
                    'Filter candidates by role, download resumes, and accept or reject applicants.',
                blocks: [
                    {
                        type: 'paragraph',
                        text: 'Every application submitted through the careers page lands in the Applications list, with the candidate name, contact details, their cover letter, and their resume.',
                    },
                    {
                        type: 'steps',
                        title: 'To review applications',
                        items: [
                            'Go to Recruitment > Applications.',
                            'Use the role filter to view candidates for a single opening.',
                            'Open an application to read the cover letter in full.',
                            'Download the resume to review the candidate experience and qualifications.',
                        ],
                    },
                    {
                        type: 'steps',
                        title: 'To respond to an applicant',
                        items: [
                            'Open the application.',
                            'Choose Accept or Reject from the actions.',
                            'The candidate is emailed automatically with the decision, so you do not need to draft a reply.',
                        ],
                    },
                    {
                        type: 'steps',
                        title: 'To remove an application',
                        items: [
                            'Open the application.',
                            'Use the delete action.',
                            'The application is removed from the list and the resume is cleaned up.',
                        ],
                    },
                    {
                        type: 'callout',
                        variant: 'tip',
                        title: 'Accepting sends the good news',
                        text: 'The accept email goes out to the applicant right away with their position name, so double-check the opening before you click.',
                    },
                ],
            },
        ],
    },
    {
        slug: 'business-partners',
        title: 'Business Partners',
        summary:
            'Handle partnership requests from hospitals, clinics, and community organizations.',
        articles: [
            {
                slug: 'reviewing-partnership-requests',
                title: 'Reviewing partnership requests',
                summary:
                    'Read the inquiries submitted through the For Businesses page.',
                blocks: [
                    {
                        type: 'paragraph',
                        text: 'Organizations that want to work with CareLink submit a request through the For Businesses page on the website. Every request appears in the Business Partners section of the dashboard.',
                    },
                    {
                        type: 'paragraph',
                        text: 'Each request shows the organization name, the contact person, their phone and email, and the message they left. Review the details before deciding.',
                    },
                    {
                        type: 'callout',
                        variant: 'info',
                        title: 'Nothing to enter manually',
                        text: 'Requests arrive automatically from the website. You only decide whether to approve or reject them.',
                    },
                ],
            },
            {
                slug: 'approving-and-rejecting',
                title: 'Approving and rejecting requests',
                summary:
                    'Respond to a partnership request, and the organization is notified by email.',
                blocks: [
                    {
                        type: 'steps',
                        title: 'To approve a request',
                        items: [
                            'Open Business Partners from the dashboard sidebar.',
                            'Open the request you want to accept.',
                            'Click Approve.',
                            'The organization receives an approval email with the next steps.',
                        ],
                    },
                    {
                        type: 'steps',
                        title: 'To reject a request',
                        items: [
                            'Open Business Partners from the dashboard sidebar.',
                            'Open the request you want to decline.',
                            'Click Reject.',
                            'The organization receives a rejection email explaining that CareLink is not taking on new partners right now.',
                        ],
                    },
                    {
                        type: 'callout',
                        variant: 'warning',
                        title: 'Emails go out automatically',
                        text: 'Both decisions email the organization immediately. Only click when you are sure, since there is no undo.',
                    },
                ],
            },
        ],
    },
    {
        slug: 'users',
        title: 'Users',
        summary:
            'Invite team members, manage roles, and control who can sign in.',
        articles: [
            {
                slug: 'adding-users-and-invites',
                title: 'Adding users and invites',
                summary:
                    'Create an account for a new team member without knowing their password.',
                blocks: [
                    {
                        type: 'paragraph',
                        text: 'Every team member needs a CareLink account to use the dashboard. Accounts are created from the Users page by any signed-in team member.',
                    },
                    {
                        type: 'steps',
                        title: 'To add a user',
                        items: [
                            'Go to Administration > Users.',
                            'Click Add User.',
                            'Enter the full name and email address, then select a role from the dropdown.',
                            'Submit. The account is created without a password.',
                        ],
                    },
                    {
                        type: 'paragraph',
                        text: 'The new team member immediately receives two emails: a password reset link so they can choose their own password, and a link to this Knowledge Base so they can learn the dashboard. There is no need to share credentials over chat or email.',
                    },
                    {
                        type: 'callout',
                        variant: 'warning',
                        title: 'Never share passwords',
                        text: 'Accounts are created without passwords on purpose. If someone never received their reset link, use Forgot Password on the sign in page instead of creating a duplicate account.',
                    },
                    {
                        type: 'callout',
                        variant: 'tip',
                        title: 'Resending later',
                        text: 'If a teammate loses their reset email, they can request a new one from the sign in page at any time. It does not require an admin.',
                    },
                ],
            },
            {
                slug: 'admin-roles',
                title: 'User roles',
                summary: 'What each role can do and when to grant it.',
                blocks: [
                    {
                        type: 'paragraph',
                        text: 'Every account has one of three roles: Admin, Manager, or Dispatcher. The role controls what the person can do inside the dashboard.',
                    },
                    {
                        type: 'table',
                        title: 'Roles',
                        headers: ['Role', 'What they can do'],
                        rows: [
                            [
                                'Dispatcher',
                                'Handle bookings, blacklisted passengers, and contact messages, and carry out day-to-day dispatch tasks.',
                            ],
                            [
                                'Manager',
                                'View analytics, run recruitment (job openings and applications), review business partners, and handle contact messages.',
                            ],
                            [
                                'Admin',
                                'Everything the other roles can do, plus payments, user management, vehicle maintenance, and website content.',
                            ],
                        ],
                    },
                    {
                        type: 'paragraph',
                        text: 'The role is chosen when the account is created and can be changed at any time from the Users page. Grant admin only to team members who need full access.',
                    },
                    {
                        type: 'callout',
                        variant: 'info',
                        title: 'Role badges',
                        text: 'Each role has a color-coded badge in the Users list: violet for Admin, sky for Manager, and slate for Dispatcher, so you always know who has what access.',
                    },
                ],
            },
            {
                slug: 'banning-and-unbanning',
                title: 'Banning and unbanning users',
                summary:
                    'Block a user from signing in and lift the block later.',
                blocks: [
                    {
                        type: 'paragraph',
                        text: 'When someone should not access the dashboard anymore, ban their account. The ban signs them out immediately and blocks new sign ins until it is lifted.',
                    },
                    {
                        type: 'steps',
                        title: 'To ban a user',
                        items: [
                            'Go to Administration > Users.',
                            'Click Ban on the user row.',
                            'Confirm the ban. The account is signed out and cannot sign back in.',
                        ],
                    },
                    {
                        type: 'steps',
                        title: 'To unban a user',
                        items: [
                            'Go to Administration > Users.',
                            'Click Unban on the user row.',
                            'The account can sign in again. The status badge switches back to Active.',
                        ],
                    },
                    {
                        type: 'callout',
                        variant: 'warning',
                        title: 'Banning does not delete data',
                        text: 'A banned account keeps its bookings and history. Banning only stops the person from signing in. To remove the account entirely, contact the system administrator.',
                    },
                    {
                        type: 'callout',
                        variant: 'info',
                        title: 'You cannot ban yourself',
                        text: 'The dashboard blocks banning your own account, so the team always has someone left to manage access.',
                    },
                ],
            },
        ],
    },
    {
        slug: 'vehicle-maintenance',
        title: 'Vehicle Maintenance',
        summary:
            'Log maintenance records for the fleet, manage vehicle details, and print reports.',
        articles: [
            {
                slug: 'what-vehicle-maintenance-does',
                title: 'What Vehicle Maintenance does',
                summary:
                    'How the maintenance log and vehicle records are organized.',
                blocks: [
                    {
                        type: 'paragraph',
                        text: 'The Vehicle Maintenance page keeps the fleet healthy. It has two tabs: Maintenance, which lists every service visit logged for the fleet, and Vehicles, which holds the details of each vehicle owned by the company.',
                    },
                    {
                        type: 'paragraph',
                        text: 'The Maintenance tab shows one row per service visit with the vehicle, the maintenance type, the service date, mileage, provider, cost, and the number of attached receipts. The Vehicles tab shows each vehicle with its type, plate, VIN, how many service records it has, and whether it is active.',
                    },
                    {
                        type: 'callout',
                        variant: 'info',
                        title: 'Admin only',
                        text: 'Vehicle Maintenance is available to admins only. If the section is not in your sidebar, ask an admin to log your service visits for you.',
                    },
                ],
            },
            {
                slug: 'adding-maintenance-records',
                title: 'Adding maintenance records',
                summary:
                    'Log a service visit with the date, mileage, provider, cost, and receipts.',
                blocks: [
                    {
                        type: 'steps',
                        title: 'To add a maintenance record',
                        items: [
                            'Go to Administration > Vehicle Maintenance and open the Maintenance tab.',
                            'Click Add maintenance record.',
                            'Pick the vehicle and the maintenance type.',
                            'Enter the service date, mileage, service provider, and total cost.',
                            'Optionally set a next service date and mileage, and add notes about the work performed.',
                            'Attach any receipts or service documents, then save.',
                        ],
                    },
                    {
                        type: 'table',
                        title: 'Maintenance types',
                        headers: ['Type', 'Use it for'],
                        rows: [
                            ['Oil change', 'Engine oil and filter changes.'],
                            ['Tire rotation', 'Rotating or replacing tires.'],
                            [
                                'Brake service',
                                'Brake pads, rotors, or brake fluid.',
                            ],
                            [
                                'Fluid check',
                                'Topping up or replacing vehicle fluids.',
                            ],
                            [
                                'Battery service',
                                'Battery testing or replacement.',
                            ],
                            [
                                'Inspection',
                                'Scheduled or compliance inspections.',
                            ],
                            [
                                'Filter replacement',
                                'Air, cabin, or fuel filters.',
                            ],
                            [
                                'Other',
                                'Any service that does not fit another type.',
                            ],
                        ],
                    },
                    {
                        type: 'callout',
                        variant: 'tip',
                        title: 'Next service date and mileage',
                        text: 'When the provider gives a next service date or mileage, record it. The maintenance report includes this information, which helps plan upcoming service visits.',
                    },
                ],
            },
            {
                slug: 'managing-fleet-vehicles',
                title: 'Managing fleet vehicles',
                summary: 'Add, edit, and remove the vehicles the company owns.',
                blocks: [
                    {
                        type: 'steps',
                        title: 'To add a vehicle',
                        items: [
                            'Go to Administration > Vehicle Maintenance and open the Vehicles tab.',
                            'Click Add vehicle.',
                            'Enter a name, type, capacity, VIN, license plate, and an hourly rate estimate.',
                            'Save. The vehicle is now available when logging a maintenance record.',
                        ],
                    },
                    {
                        type: 'table',
                        title: 'Vehicle types',
                        headers: ['Type', 'Use it for'],
                        rows: [
                            [
                                'Ambulatory Sedan',
                                'A standard sedan for passengers who can walk.',
                            ],
                            [
                                'Wheelchair Van',
                                'A van equipped for wheelchair transport.',
                            ],
                            [
                                'Gurney Van',
                                'A van equipped to carry passengers on a gurney.',
                            ],
                            [
                                'Transit Shuttle',
                                'A shuttle for multiple passengers at once.',
                            ],
                        ],
                    },
                    {
                        type: 'steps',
                        title: 'To edit or remove a vehicle',
                        items: [
                            'Use the edit action on a vehicle row to change any detail, including marking it active or inactive.',
                            'Use the delete action to remove the vehicle and all of its maintenance records.',
                        ],
                    },
                    {
                        type: 'callout',
                        variant: 'warning',
                        title: 'Deleting a vehicle removes its history',
                        text: 'Deleting a vehicle also removes every maintenance record and receipt attached to it. Switch the vehicle to inactive instead if you only want it out of service.',
                    },
                ],
            },
            {
                slug: 'generating-maintenance-reports',
                title: 'Generating maintenance reports',
                summary:
                    'Summarize the service history of a vehicle over a date range and export it.',
                blocks: [
                    {
                        type: 'steps',
                        title: 'To generate a maintenance report',
                        items: [
                            'Go to Administration > Vehicle Maintenance and open the Maintenance tab.',
                            'Click Maintenance report.',
                            'Pick the vehicle, then optionally set a start and end date. Leave the dates empty to include all history.',
                            'Click Generate report.',
                            'Review the results and total cost, then click Export PDF to print or save the report.',
                        ],
                    },
                    {
                        type: 'paragraph',
                        text: 'The report lists each matching service record with its date, maintenance type, mileage, provider, cost, and next service date, along with a running total.',
                    },
                ],
            },
        ],
    },
    {
        slug: 'contact-messages',
        title: 'Contact Messages',
        summary:
            'Read, respond to, and clean up the messages sent through the website contact form.',
        articles: [
            {
                slug: 'reading-contact-messages',
                title: 'Reading contact messages',
                summary:
                    'Where website inquiries land and what the page shows.',
                blocks: [
                    {
                        type: 'paragraph',
                        text: 'The Contact Messages page collects every inquiry sent through the contact form on the public website. Each message shows the sender name, email, phone when provided, the message itself, and when it was submitted.',
                    },
                    {
                        type: 'paragraph',
                        text: 'The page opens showing pending messages by default, since those are the ones still needing attention. Use the status filter to switch between Pending, Read, and All, and the search box to find a message by name, email, or content.',
                    },
                    {
                        type: 'callout',
                        variant: 'info',
                        title: 'Available to most team members',
                        text: 'Contact Messages is available to dispatchers, managers, and admins, so whoever is on duty can pick up the inbox.',
                    },
                ],
            },
            {
                slug: 'responding-to-contact-messages',
                title: 'Responding and marking as read',
                summary:
                    'Open a message, reply, and keep the pending inbox tidy.',
                blocks: [
                    {
                        type: 'steps',
                        title: 'To respond to a message',
                        items: [
                            'Go to Administration > Contact Messages.',
                            'Open the message with the actions menu and choose Details.',
                            'Read the full message and the sender contact details.',
                            'Reply to the sender through your email.',
                            'Choose Mark as read so the message leaves the pending queue.',
                        ],
                    },
                    {
                        type: 'callout',
                        variant: 'tip',
                        title: 'Keep the pending queue short',
                        text: 'Mark messages as read as soon as you have handled them. The default view is Pending, so leaving everything unread hides what still needs a reply.',
                    },
                ],
            },
            {
                slug: 'deleting-contact-messages',
                title: 'Deleting contact messages',
                summary: 'Remove spam or duplicate messages permanently.',
                blocks: [
                    {
                        type: 'steps',
                        title: 'To delete a message',
                        items: [
                            'Go to Administration > Contact Messages.',
                            'Open the actions menu on the message and choose Delete.',
                            'Confirm the deletion. The message is removed and cannot be recovered.',
                        ],
                    },
                    {
                        type: 'callout',
                        variant: 'warning',
                        title: 'Deletion is permanent',
                        text: 'Deleted messages are gone for good. Mark a message as read instead when it is legitimate but does not need a reply.',
                    },
                ],
            },
        ],
    },
    {
        slug: 'website-content',
        title: 'Website Content (CMS)',
        summary:
            'Edit what the public website shows: sections, collections, and images.',
        articles: [
            {
                slug: 'about-the-cms',
                title: 'About the website content editor',
                summary:
                    'The difference between content sections and collections.',
                blocks: [
                    {
                        type: 'paragraph',
                        text: 'The Website Content page is the editor for everything that appears on the public website: company information, service descriptions, the fleet, the team, FAQs, and blog posts. Changes publish instantly, so keep this in mind while you edit.',
                    },
                    {
                        type: 'paragraph',
                        text: 'Content is organized in two ways. Content sections are single blocks of text and settings that describe the company, its hours, rates, and page banners. Collections are lists of items, such as the fleet vehicles or blog posts, where you add and remove rows.',
                    },
                    {
                        type: 'table',
                        title: 'Content areas',
                        headers: ['Area', 'Type', 'What it controls'],
                        rows: [
                            [
                                'Content Sections',
                                'Sections',
                                'Company info, dispatch hours, payment methods, hero slides, reviews, booking steps, fees, terms, and page banners.',
                            ],
                            [
                                'Services',
                                'Collection',
                                'The services listed on the Services page.',
                            ],
                            [
                                'Fleet',
                                'Collection',
                                'The vehicles shown on the Fleet page.',
                            ],
                            [
                                'Team',
                                'Collection',
                                'The team members shown on the About page.',
                            ],
                            [
                                'FAQs',
                                'Collection',
                                'The questions and answers on the FAQ page.',
                            ],
                            [
                                'Blog',
                                'Collection',
                                'The posts on the blog page.',
                            ],
                        ],
                    },
                    {
                        type: 'callout',
                        variant: 'warning',
                        title: 'Changes go live immediately',
                        text: 'There is no draft step. Saving an edit updates the public website right away, so review the text before you save.',
                    },
                ],
            },
            {
                slug: 'editing-content-sections',
                title: 'Editing content sections',
                summary:
                    'Update company text, hours, rates, page banners, and more.',
                blocks: [
                    {
                        type: 'paragraph',
                        text: 'Content sections hold the descriptive text and settings of the website. Each section has a card on the Website Content page, and every card opens an editor that matches the type of content inside.',
                    },
                    {
                        type: 'steps',
                        title: 'To edit a section',
                        items: [
                            'Go to Administration > Website Content.',
                            'Click Edit on the section you want to change, for example Company Info.',
                            'Update the fields. Text fields behave like normal text boxes, and list fields use one line per item.',
                            'Save. The website updates immediately and the card shows when the section was last changed.',
                        ],
                    },
                    {
                        type: 'table',
                        title: 'Field types',
                        headers: ['Field', 'How to fill it'],
                        rows: [
                            [
                                'Text',
                                'A single line of text, such as a tagline or phone number.',
                            ],
                            [
                                'Text area',
                                'A longer paragraph, such as an about paragraph.',
                            ],
                            [
                                'List',
                                'Several short items. Type one item per line.',
                            ],
                            [
                                'Switch',
                                'A toggle to turn a feature on or off, such as showing a section.',
                            ],
                            [
                                'Number',
                                'A numeric value, such as a rate or a count.',
                            ],
                            [
                                'Image',
                                'Click to upload or pick an image from the media library.',
                            ],
                            [
                                'Table',
                                'Rows of related fields. Add rows for each item, such as each hero slide or review.',
                            ],
                        ],
                    },
                    {
                        type: 'callout',
                        variant: 'tip',
                        title: 'Page banners',
                        text: 'The Page Headers section controls the big title and subtitle on every public page. Each page has its own row, identified by its slug such as "services" or "about".',
                    },
                    {
                        type: 'callout',
                        variant: 'warning',
                        title: 'Restore resets to defaults',
                        text: 'Restoring a section deletes your edits and brings back the original text. Use Restore only when you want to start over.',
                    },
                ],
            },
            {
                slug: 'managing-collections',
                title: 'Managing collections',
                summary:
                    'Add, edit, and remove services, fleet vehicles, team members, FAQs, and blog posts.',
                blocks: [
                    {
                        type: 'paragraph',
                        text: 'Collections are lists of items that each have their own editor. Services, fleet vehicles, team members, FAQs, and blog posts each have a page under Website Content.',
                    },
                    {
                        type: 'steps',
                        title: 'To add an item',
                        items: [
                            'Open the collection from Website Content, for example Fleet.',
                            'Click Add Vehicle (or the matching button for the collection).',
                            'Fill in the item details, including any images.',
                            'Save. The item appears on the public page immediately.',
                        ],
                    },
                    {
                        type: 'steps',
                        title: 'To edit or remove an item',
                        items: [
                            'Open the collection.',
                            'Use the edit action on the item to change its details.',
                            'Use the delete action to remove it from the public page.',
                        ],
                    },
                    {
                        type: 'callout',
                        variant: 'tip',
                        title: 'Ordering',
                        text: 'Items in a collection are shown in the order you arrange them on the collection page, so keep the order in mind when you add a new item.',
                    },
                    {
                        type: 'callout',
                        variant: 'warning',
                        title: 'Restore brings defaults back',
                        text: 'The Restore action on a collection resets it to the original shipped items. Any custom items you added are removed, so use it carefully.',
                    },
                ],
            },
            {
                slug: 'uploading-images',
                title: 'Uploading images',
                summary:
                    'Add images to sections and collections from the editor.',
                blocks: [
                    {
                        type: 'paragraph',
                        text: 'Image fields appear throughout the content editor, for example on hero slides, services, fleet vehicles, team members, and blog posts.',
                    },
                    {
                        type: 'steps',
                        title: 'To upload an image',
                        items: [
                            'Open the editor for the item that needs the image.',
                            'Click the image field.',
                            'Choose an image file from your computer. It is uploaded and attached to the item automatically.',
                        ],
                    },
                    {
                        type: 'table',
                        title: 'Image tips',
                        headers: ['Tip', 'Detail'],
                        rows: [
                            [
                                'File size',
                                'Keep images under 4 MB. The editor rejects larger files with a clear message.',
                            ],
                            [
                                'Shape',
                                'Use wide images for banners and hero slides, and square images for people and vehicles.',
                            ],
                            [
                                'File types',
                                'Common image formats such as PNG and JPG are supported.',
                            ],
                        ],
                    },
                    {
                        type: 'callout',
                        variant: 'warning',
                        title: 'Check the public page',
                        text: 'Uploaded images publish instantly. Open the public page after saving to confirm the image looks right on the live site.',
                    },
                ],
            },
            {
                slug: 'restoring-defaults',
                title: 'Restoring defaults',
                summary:
                    'Reset sections or collections back to the original content.',
                blocks: [
                    {
                        type: 'paragraph',
                        text: 'If content has been changed beyond repair or you simply want a fresh start, the editor can restore the original defaults.',
                    },
                    {
                        type: 'steps',
                        title: 'To restore one section or collection',
                        items: [
                            'Open Website Content.',
                            'On the section or collection you want to reset, click Restore.',
                            'Confirm. The original default content comes back and the public page updates.',
                        ],
                    },
                    {
                        type: 'steps',
                        title: 'To restore everything at once',
                        items: [
                            'Open Website Content.',
                            'Click Restore All Content.',
                            'Confirm. Every section and collection resets to its shipped defaults.',
                        ],
                    },
                    {
                        type: 'callout',
                        variant: 'warning',
                        title: 'Restore All is destructive',
                        text: 'It replaces every edit on the website with the original content. Only use it when you are sure that is what you want, since the removed edits are not recoverable.',
                    },
                ],
            },
        ],
    },
    {
        slug: 'knowledge-base',
        title: 'Knowledge Base',
        summary: 'Get the most out of this guide.',
        articles: [
            {
                slug: 'using-this-guide',
                title: 'Using this guide',
                summary: 'Search, navigate, and share articles with your team.',
                blocks: [
                    {
                        type: 'paragraph',
                        text: 'The Knowledge Base is organized into categories on the left, one for each area of the dashboard. Every article explains one task from start to finish.',
                    },
                    {
                        type: 'steps',
                        title: 'To find an article',
                        items: [
                            'Browse the categories on the left and click the article you need.',
                            'Or use the search box at the top: type a task such as "cancel booking" and the matching articles appear instantly.',
                        ],
                    },
                    {
                        type: 'paragraph',
                        text: 'The address bar always shows the article you are reading, so you can copy it and share it with a teammate. The article opens on the same page when they paste the link.',
                    },
                    {
                        type: 'callout',
                        variant: 'tip',
                        title: 'Steps are numbered for a reason',
                        text: 'Articles that show numbered steps are meant to be followed in order. Articles with tables are references: scan them when you are unsure about a status or option.',
                    },
                ],
            },
            {
                slug: 'getting-the-intro-link',
                title: 'Getting the intro link',
                summary:
                    'Who receives the Knowledge Base link, and how to get it again.',
                blocks: [
                    {
                        type: 'paragraph',
                        text: 'Every new team member is introduced to the Knowledge Base automatically: when an account is created on the Users page, the welcome email includes a button that opens this guide.',
                    },
                    {
                        type: 'paragraph',
                        text: 'The link works for anyone with a dashboard account. If you did not keep the welcome email, you do not need it: the Knowledge Base is always available from the Resources section of the dashboard sidebar.',
                    },
                    {
                        type: 'callout',
                        variant: 'tip',
                        title: 'Bringing a new teammate up to speed',
                        text: 'Point them to the Getting Started category first. The three articles there cover the dashboard layout, sign in, and the main areas, which is everything they need on day one.',
                    },
                ],
            },
        ],
    },
];
