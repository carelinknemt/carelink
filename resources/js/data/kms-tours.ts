import type { Step } from 'react-joyride';

export type SimulationKey =
    | 'bookings-list'
    | 'booking-detail'
    | 'payments'
    | 'users'
    | 'job-openings'
    | 'applications'
    | 'business-partners'
    | 'cms-sections';

export interface KmsTour {
    simulation: SimulationKey;
    steps: Step[];
}

export const kmsTours: Record<string, KmsTour> = {
    'viewing-bookings': {
        simulation: 'bookings-list',
        steps: [
            {
                target: '#kms-demo-bk-search',
                title: 'Find any trip',
                content:
                    'This search box works exactly like the real one. Type a booking number, passenger name, phone, or email, and the list narrows down as you type.',
                placement: 'bottom',
            },
            {
                target: '#kms-demo-bk-table',
                title: 'The bookings list',
                content:
                    'Every paid trip request appears here. Each row shows the booking number, passenger, trip date, current status, and trip price. Trips that need dispatch are listed first.',
                placement: 'top',
            },
            {
                target: '#kms-demo-bk-row-status-0',
                title: 'Trip status',
                content:
                    'Each row has a status picker. Try changing it: this is the same control you use to move a trip from Pending Dispatch to Dispatched, In Transit, and Completed.',
                placement: 'bottom',
            },
            {
                target: '#kms-demo-bk-export',
                title: 'Export',
                content:
                    'The Export button downloads the whole filtered list as a CSV file, ready for Excel or Google Sheets.',
                placement: 'top',
            },
        ],
    },
    'filtering-sorting-exporting': {
        simulation: 'bookings-list',
        steps: [
            {
                target: '#kms-demo-bk-table',
                title: 'Start from the list',
                content:
                    'Filters and exports all work on the list you see here. Set the filters you want first, then export.',
                placement: 'top',
            },
            {
                target: '#kms-demo-bk-row-status-0',
                title: 'Filter by status',
                content:
                    'In the real page, the status filter shows only one status at a time, such as In Transit. Combine it with the search and the date range to find any group of trips.',
                placement: 'bottom',
            },
            {
                target: '#kms-demo-bk-export',
                title: 'Export your results',
                content:
                    'The export always follows your current filters. Clear the filters first if you want every booking in the file.',
                placement: 'top',
            },
        ],
    },
    'booking-statuses-and-workflow': {
        simulation: 'booking-detail',
        steps: [
            {
                target: '#kms-demo-bd-title',
                title: 'The booking header',
                content:
                    'The booking number and payment badge sit at the top. A green badge means the $30 booking fee is paid; a red one means the trip was cancelled and refunded.',
                placement: 'bottom',
            },
            {
                target: '#kms-demo-bd-status',
                title: 'The status selector',
                content:
                    'Move the trip through its workflow here: Pending Dispatch, Dispatched, In Transit, and Completed. Keep the status current so the dispatch team always knows where the trip stands.',
                placement: 'bottom',
            },
            {
                target: '#kms-demo-bd-trip',
                title: 'Confirm the trip details',
                content:
                    'Before updating a status, check the trip date, pickup time, and transport type on this card. Updates are shared with the whole team.',
                placement: 'top',
            },
            {
                target: '#kms-demo-bd-passenger',
                title: 'Passenger information',
                content:
                    'The passenger card holds the contact details the driver needs for pickup and dropoff.',
                placement: 'top',
            },
        ],
    },
    'cancelling-bookings': {
        simulation: 'booking-detail',
        steps: [
            {
                target: '#kms-demo-bd-title',
                title: 'Check the booking first',
                content:
                    'Only trips that are still active can be cancelled. Completed trips keep their status and cannot be cancelled.',
                placement: 'bottom',
            },
            {
                target: '#kms-demo-bd-cancel',
                title: 'Cancel booking',
                content:
                    'This button opens the cancellation confirmation. Because the fee is already paid, cancelling also refunds the $30.00 to the passenger automatically.',
                placement: 'bottom',
            },
            {
                target: '#kms-demo-bd-payment',
                title: 'Refunds',
                content:
                    'The Payment & Dispatch card records the payment. After a cancellation, the badge above turns red and shows that the fee was refunded.',
                placement: 'top',
            },
        ],
    },
    'viewing-payments': {
        simulation: 'payments',
        steps: [
            {
                target: '#kms-demo-pm-summary',
                title: 'The big picture',
                content:
                    'The four summary cards show total payments, how much was collected, what is pending, and what was refunded.',
                placement: 'bottom',
            },
            {
                target: '#kms-demo-pm-status-filter',
                title: 'Filter payments',
                content:
                    'Use this filter to show paid, pending, or refunded payments. The page opens on paid by default, which is the view dispatch needs most days.',
                placement: 'bottom',
            },
            {
                target: '#kms-demo-pm-badge-PAID',
                title: 'Status badges',
                content:
                    'Each payment has a badge: green for Paid, amber for Pending, and red for Refunded. A trip is only counted as revenue once its payment is paid.',
                placement: 'bottom',
            },
            {
                target: '#kms-demo-pm-table',
                title: 'Every payment',
                content:
                    'The table lists the booking number, passenger, trip date, status, and fee for each payment record.',
                placement: 'top',
            },
        ],
    },
    'adding-users-and-invites': {
        simulation: 'users',
        steps: [
            {
                target: '#kms-demo-us-add',
                title: 'Add user',
                content:
                    'Click Add user to create an account for a new team member. The account is created without a password.',
                placement: 'bottom',
            },
            {
                target: '#kms-demo-us-invite-dialog',
                title: 'The invite',
                content:
                    'Enter the name and email, then submit. The new user immediately receives two emails: a password reset link and a link to this Knowledge Base.',
                placement: 'top',
            },
            {
                target: '#kms-demo-us-table',
                title: 'The users list',
                content:
                    'Every account is listed with its name, email, role, status, and join date. Search narrows the list as you type.',
                placement: 'top',
            },
            {
                target: '#kms-demo-us-role',
                title: 'Roles',
                content:
                    'Accounts are either Admin or Manager. The role is chosen when the account is created, and the Admin badge makes elevated access visible at a glance.',
                placement: 'top',
            },
        ],
    },
    'banning-and-unbanning': {
        simulation: 'users',
        steps: [
            {
                target: '#kms-demo-us-table',
                title: 'Find the account',
                content:
                    'The status column shows who can sign in. Active accounts show a green badge, banned accounts show a red one.',
                placement: 'top',
            },
            {
                target: '#kms-demo-us-ban',
                title: 'Ban',
                content:
                    'Click Ban on any account. A confirmation explains that the user is signed out immediately and cannot sign back in until the ban is lifted.',
                placement: 'left',
            },
            {
                target: '#kms-demo-us-role',
                title: 'You cannot ban yourself',
                content:
                    'The dashboard blocks banning your own account, so someone always stays available to manage access.',
                placement: 'top',
            },
        ],
    },
    'managing-job-openings': {
        simulation: 'job-openings',
        steps: [
            {
                target: '#kms-demo-jo-post',
                title: 'Post a job',
                content:
                    'Click Post a job to add a role. Fill in the title, location, employment type, summary, and requirements, and the role goes live on the careers page immediately.',
                placement: 'bottom',
            },
            {
                target: '#kms-demo-jo-table',
                title: 'The openings list',
                content:
                    'Every opening shows its title, location, type, application count, and status.',
                placement: 'top',
            },
            {
                target: '#kms-demo-jo-status',
                title: 'Open or closed',
                content:
                    'A green badge means the role is visible on the careers page. Closed openings are hidden but keep their applications.',
                placement: 'bottom',
            },
            {
                target: '#kms-demo-jo-actions',
                title: 'Manage an opening',
                content:
                    'Use the pencil to edit, the circle to close or reopen the role, and the trash icon to delete it along with its applications. Prefer closing over deleting.',
                placement: 'left',
            },
        ],
    },
    'reviewing-applications': {
        simulation: 'applications',
        steps: [
            {
                target: '#kms-demo-ap-filter',
                title: 'Filter by role',
                content:
                    'Pick a role to see applicants for a single opening, or leave it on All roles to review everything.',
                placement: 'bottom',
            },
            {
                target: '#kms-demo-ap-table',
                title: 'The applications list',
                content:
                    'Each row shows the applicant, the role they applied for, and when they applied.',
                placement: 'top',
            },
            {
                target: '#kms-demo-ap-actions',
                title: 'Review and decide',
                content:
                    'Open the actions menu: View Details reads the cover letter, Accept and Reject email the applicant automatically, and the trash icon removes the application and its resume.',
                placement: 'left',
            },
        ],
    },
    'approving-and-rejecting': {
        simulation: 'business-partners',
        steps: [
            {
                target: '#kms-demo-bp-table',
                title: 'The inquiry list',
                content:
                    'Partnership requests from organizations arrive here automatically with the company, contact, type, and status.',
                placement: 'top',
            },
            {
                target: '#kms-demo-bp-status',
                title: 'Pending by default',
                content:
                    'New requests are Pending. Approve the ones that fit, and the status badge updates so the whole team can see the outcome.',
                placement: 'bottom',
            },
            {
                target: '#kms-demo-bp-actions',
                title: 'Approve or reject',
                content:
                    'The actions menu offers Approve and Reject for pending requests. Both send the organization an email right away, so decide with care.',
                placement: 'left',
            },
        ],
    },
    'editing-content-sections': {
        simulation: 'cms-sections',
        steps: [
            {
                target: '#kms-demo-cms-grid',
                title: 'Content sections',
                content:
                    'Each card is one area of the website, such as Company Info or Page Headers. The list here is a sample: the real editor has every section.',
                placement: 'top',
            },
            {
                target: '#kms-demo-cms-edit',
                title: 'Edit a section',
                content:
                    'Click the pencil to open the editor. Fields match their content type: text, text area, one-item-per-line lists, switches, numbers, images, and tables.',
                placement: 'left',
            },
            {
                target: '#kms-demo-cms-restore',
                title: 'Restore a section',
                content:
                    'The restore button deletes your edits and brings back the original content for that section alone. Use it when you want to start over.',
                placement: 'right',
            },
        ],
    },
    'restoring-defaults': {
        simulation: 'cms-sections',
        steps: [
            {
                target: '#kms-demo-cms-restore',
                title: 'Restore one area',
                content:
                    'Restoring a single section resets only that area to its shipped defaults. Everything else stays exactly as you edited it.',
                placement: 'right',
            },
            {
                target: '#kms-demo-cms-restore-all',
                title: 'Restore everything',
                content:
                    'Restore all content resets every section and collection at once. It is the most powerful button in the CMS and the removed edits cannot be recovered.',
                placement: 'bottom',
            },
            {
                target: '#kms-demo-cms-grid',
                title: 'Check the live site',
                content:
                    'After any restore, open the public page to confirm the website looks the way you expect.',
                placement: 'top',
            },
        ],
    },
};
