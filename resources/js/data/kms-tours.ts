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
                target: '#kms-demo-bk-table',
                title: 'Step 1 · The bookings list',
                content:
                    'This is the heart of the dispatch workflow: every paid trip request appears here as a row. Each row shows the booking number, passenger, trip date, current status, and trip price. Trips waiting for dispatch are listed first so you never miss one.',
                placement: 'top',
            },
            {
                target: '#kms-demo-bk-search',
                title: 'Step 2 · Find any trip',
                content:
                    'This search box works exactly like the real one. Type a booking number, passenger name, phone number, or email, and the list narrows down as you type. There is no need to press Enter or click a button.',
                placement: 'bottom',
            },
            {
                target: '#kms-demo-bk-row-status-0',
                title: 'Step 3 · Trip status',
                content:
                    'Each row has a status picker. This one is Pending Dispatch, meaning the trip is paid and waiting for a vehicle to be assigned. Try opening it to see the other options.',
                placement: 'bottom',
            },
            {
                target: '#kms-demo-bk-row-status-1',
                title: 'Step 4 · Move a trip forward',
                content:
                    'When you assign a vehicle, the status becomes Dispatched. Use this picker to change a trip\u2019s status at any point: Pending Dispatch, Dispatched, In Transit, Completed, or Cancelled. The dispatch team sees your change immediately.',
                placement: 'bottom',
            },
            {
                target: '#kms-demo-bk-count',
                title: 'Step 5 · Know what you are looking at',
                content:
                    'The heading above the table always tells you how many trips are in the current view. Watch this number as you search and filter: it confirms whether you are looking at all trips or a small subset.',
                placement: 'top',
            },
            {
                target: '#kms-demo-bk-export',
                title: 'Step 6 · Export',
                content:
                    'The Export button downloads the whole filtered list as a CSV file, ready for Excel or Google Sheets. The export always follows your current search and filters, so set the view you want first.',
                placement: 'top',
            },
        ],
    },
    'filtering-sorting-exporting': {
        simulation: 'bookings-list',
        steps: [
            {
                target: '#kms-demo-bk-table',
                title: 'Step 1 · Start from the list',
                content:
                    'Filters, sorting, and exports all work on the list you see here. The real page lets you filter by status, search by any detail, and sort by trip date. Build the exact view you need first, then export.',
                placement: 'top',
            },
            {
                target: '#kms-demo-bk-search',
                title: 'Step 2 · Search for a specific trip',
                content:
                    'The fastest way to find one trip is the search box. Booking numbers are the most precise: CL-2026-0018 finds exactly that trip. Names, phones, and emails work too and return every matching trip.',
                placement: 'bottom',
            },
            {
                target: '#kms-demo-bk-row-status-0',
                title: 'Step 3 · Filter by status',
                content:
                    'On the real page, the status filter shows one status at a time, such as only In Transit trips. Combine it with the search box and the date range to isolate any group of trips for dispatch or reporting.',
                placement: 'bottom',
            },
            {
                target: '#kms-demo-bk-count',
                title: 'Step 4 · Confirm your results',
                content:
                    'After applying filters, check the count above the table. It updates with every search and filter change, so you always know how many trips made it into the current view.',
                placement: 'top',
            },
            {
                target: '#kms-demo-bk-per-page',
                title: 'Step 5 · Choose rows per page',
                content:
                    'Use this selector to show 15, 25, 50, or 100 trips per page. Pick a larger number when you are scanning many trips, and use the pager to move through the results.',
                placement: 'top',
            },
            {
                target: '#kms-demo-bk-export',
                title: 'Step 6 · Export your results',
                content:
                    'The export always follows your current filters. Clear the filters first if you want every booking in the file, or keep them to hand a focused list to a colleague.',
                placement: 'top',
            },
        ],
    },
    'booking-statuses-and-workflow': {
        simulation: 'booking-detail',
        steps: [
            {
                target: '#kms-demo-bd-title',
                title: 'Step 1 · The booking header',
                content:
                    'The booking number and payment badge sit at the top of the page. A green badge means the $30 booking fee is paid; a red one means the trip was cancelled and refunded. This is the first thing to check when you open a booking.',
                placement: 'bottom',
            },
            {
                target: '#kms-demo-bd-status',
                title: 'Step 2 · The status selector',
                content:
                    'Move the trip through its workflow here: Pending Dispatch, Dispatched, In Transit, and Completed. Pick the option that matches reality and keep it current, so dispatch always knows where the trip stands.',
                placement: 'bottom',
            },
            {
                target: '#kms-demo-bd-trip',
                title: 'Step 3 · Confirm the trip details',
                content:
                    'Before updating a status, check this card: trip date, pickup time, transport type, and trip price. It holds the information the driver needs and is shared with the whole team.',
                placement: 'top',
            },
            {
                target: '#kms-demo-bd-passenger',
                title: 'Step 4 · Passenger information',
                content:
                    'The passenger card holds the contact details the driver needs for pickup and dropoff: name, phone, and email. Call ahead if a trip looks like it may be late or cancelled.',
                placement: 'top',
            },
            {
                target: '#kms-demo-bd-payment',
                title: 'Step 5 · Payment and dispatch records',
                content:
                    'This card records when the booking was created, when the fee was paid, and the payment status. It is also where you can confirm a refund was issued after a cancellation.',
                placement: 'top',
            },
            {
                target: '#kms-demo-bd-export',
                title: 'Step 6 · Export a single booking',
                content:
                    'The Export CSV button downloads this one booking\u2019s details as a file. Use it when you need to share a single trip with a colleague or attach it to a report.',
                placement: 'bottom',
            },
        ],
    },
    'cancelling-bookings': {
        simulation: 'booking-detail',
        steps: [
            {
                target: '#kms-demo-bd-title',
                title: 'Step 1 · Check the booking first',
                content:
                    'Only trips that are still active can be cancelled. Completed trips keep their status and cannot be cancelled. Check the payment badge: if the fee was already refunded, the cancellation has already been done.',
                placement: 'bottom',
            },
            {
                target: '#kms-demo-bd-status',
                title: 'Step 2 · Verify the current status',
                content:
                    'Look at the status selector. Cancelling is available while a trip is Pending Dispatch, Dispatched, or In Transit. It is blocked for Completed trips because the ride already happened.',
                placement: 'bottom',
            },
            {
                target: '#kms-demo-bd-cancel',
                title: 'Step 3 · Cancel booking',
                content:
                    'This button opens the cancellation confirmation. Because the fee is already paid, cancelling also refunds the $30.00 to the passenger automatically, so no manual refund step is needed.',
                placement: 'bottom',
            },
            {
                target: '#kms-demo-bd-payment',
                title: 'Step 4 · Confirm the refund',
                content:
                    'After cancelling, come back to the Payment & Dispatch card. The payment status shows the refund, and the badge at the top of the page turns red with CANCELLED \u00b7 $30 fee refunded.',
                placement: 'top',
            },
            {
                target: '#kms-demo-bd-trip',
                title: 'Step 5 · Notify the passenger',
                content:
                    'Cancelling releases the vehicle, so if the passenger still needs a ride, book a replacement trip right away. Note the pickup time and transport type on this card so the new booking matches the original needs.',
                placement: 'top',
            },
        ],
    },
    'viewing-payments': {
        simulation: 'payments',
        steps: [
            {
                target: '#kms-demo-pm-summary',
                title: 'Step 1 · The big picture',
                content:
                    'The four summary cards are the first thing to read. They show the total number of payments, how much was collected, what is still pending, and what has been refunded.',
                placement: 'bottom',
            },
            {
                target: '#kms-demo-pm-summary-collected',
                title: 'Step 2 · Collected',
                content:
                    'The highlighted card is money that actually arrived: booking fees paid by passengers. This is the number to quote when someone asks how much revenue is in the bank.',
                placement: 'bottom',
            },
            {
                target: '#kms-demo-pm-summary-pending',
                title: 'Step 3 · Pending',
                content:
                    'Pending payments are trips that have not been paid yet. Keep an eye on this number: if it grows, there may be passengers with unpaid fees who need a reminder.',
                placement: 'bottom',
            },
            {
                target: '#kms-demo-pm-summary-refunded',
                title: 'Step 4 · Refunded',
                content:
                    'Refunded money is what was returned to passengers, usually after a cancelled booking. A growing refund number is worth reviewing to see why trips are falling through.',
                placement: 'bottom',
            },
            {
                target: '#kms-demo-pm-status-filter',
                title: 'Step 5 · Filter payments',
                content:
                    'Use this filter to show Paid, Pending, or Refunded payments. The page opens on paid by default, which is the view dispatch needs most days. Switch to Pending when you need to follow up on unpaid fees.',
                placement: 'bottom',
            },
            {
                target: '#kms-demo-pm-table',
                title: 'Step 6 · Read the payment table',
                content:
                    'The table lists the booking number, passenger, trip date, status, and fee for each payment record. The status badge on every row matches the filter, so a quick scan confirms what you are looking at.',
                placement: 'top',
            },
        ],
    },
    'adding-users-and-invites': {
        simulation: 'users',
        steps: [
            {
                target: '#kms-demo-us-add',
                title: 'Step 1 · Add user',
                content:
                    'Click Add user to create an account for a new team member, such as a new dispatcher or driver coordinator. The account is created without a password, so there is nothing to share over insecure channels.',
                placement: 'bottom',
            },
            {
                target: '#kms-demo-us-invite-dialog',
                title: 'Step 2 · The invite form',
                content:
                    'Enter the full name and work email, then choose whether the account is an Admin or a Manager. Click Add user and send links and the new user immediately receives two emails: a password reset link and a link to this Knowledge Base.',
                placement: 'top',
            },
            {
                target: '#kms-demo-us-table',
                title: 'Step 3 · The users list',
                content:
                    'Every account is listed here with its name, email, role, status, and join date. The search box narrows the list as you type, which is handy when the team grows.',
                placement: 'top',
            },
            {
                target: '#kms-demo-us-role',
                title: 'Step 4 · Roles',
                content:
                    'Accounts are either Admin or Manager. Admins see the full dashboard including users and business partners; Managers get the daily tools such as bookings and payments. The role is chosen when the account is created, and the Admin badge makes elevated access visible at a glance.',
                placement: 'top',
            },
            {
                target: '#kms-demo-us-add',
                title: 'Step 5 · Confirm the invite',
                content:
                    'After creating an account, check the list for the new name. Ask the new teammate to watch for the two emails and to set their password within 24 hours, while the reset link is still valid.',
                placement: 'bottom',
            },
        ],
    },
    'banning-and-unbanning': {
        simulation: 'users',
        steps: [
            {
                target: '#kms-demo-us-table',
                title: 'Step 1 · Find the account',
                content:
                    'The users list is where access is managed. The status column shows who can sign in: Active accounts show a green badge, banned accounts show a red one. Use the search box to find the account you need.',
                placement: 'top',
            },
            {
                target: '#kms-demo-us-role',
                title: 'Step 2 · Understand what a ban does',
                content:
                    'A ban signs the user out immediately and blocks them from signing in until it is lifted. Existing bookings stay active, so a banned dispatcher does not disrupt trips that are already on the road.',
                placement: 'top',
            },
            {
                target: '#kms-demo-us-ban',
                title: 'Step 3 · Ban',
                content:
                    'Click Ban on the account you need to block. A confirmation explains exactly what happens next, so review it before confirming. You cannot ban your own account, so someone always stays available to manage access.',
                placement: 'left',
            },
            {
                target: '#kms-demo-us-table',
                title: 'Step 4 · Reversing a ban',
                content:
                    'If a ban was a mistake or the person comes back, the Ban button becomes Unban on that row. Click it to restore access immediately. The status badge switches back to green Active.',
                placement: 'top',
            },
        ],
    },
    'managing-job-openings': {
        simulation: 'job-openings',
        steps: [
            {
                target: '#kms-demo-jo-post',
                title: 'Step 1 · Post a job',
                content:
                    'Click Post a job to add a role to the careers page. Fill in the title, location, employment type, summary, and requirements, and the role goes live immediately. A display order of 0 shows it first.',
                placement: 'bottom',
            },
            {
                target: '#kms-demo-jo-table',
                title: 'Step 2 · The openings list',
                content:
                    'Every opening appears here with its title, location, employment type, application count, and status. The applications column tells you at a glance which roles are getting traction.',
                placement: 'top',
            },
            {
                target: '#kms-demo-jo-status',
                title: 'Step 3 · Open or closed',
                content:
                    'A green badge means the role is visible on the careers page and still accepting applications. Closed openings are hidden from candidates but keep their existing applications for review.',
                placement: 'bottom',
            },
            {
                target: '#kms-demo-jo-actions',
                title: 'Step 4 · Manage an opening',
                content:
                    'Three actions sit on each row: the pencil edits the role, the circle button closes or reopens it, and the trash icon deletes it along with its applications. Prefer closing over deleting, so you keep the application history.',
                placement: 'left',
            },
            {
                target: '#kms-demo-jo-table',
                title: 'Step 5 · Keep the page tidy',
                content:
                    'A role that was filled should be closed rather than deleted, and a role that is no longer needed can be removed. Check the applications column before deleting: those records are gone with it.',
                placement: 'top',
            },
        ],
    },
    'reviewing-applications': {
        simulation: 'applications',
        steps: [
            {
                target: '#kms-demo-ap-filter',
                title: 'Step 1 · Filter by role',
                content:
                    'Pick a role to see applicants for a single opening, or leave it on All roles to review everything at once. This is the first decision to make when you arrive at the page.',
                placement: 'bottom',
            },
            {
                target: '#kms-demo-ap-table',
                title: 'Step 2 · The applications list',
                content:
                    'Each row shows the applicant, their email, the role they applied for, and when they applied. Scan the list before opening details, so you work through candidates in a consistent order.',
                placement: 'top',
            },
            {
                target: '#kms-demo-ap-actions',
                title: 'Step 3 · Review and decide',
                content:
                    'The actions menu on each row holds everything: View Details reads the cover letter and resume, Accept and Reject email the applicant automatically, and the trash icon removes the application and its resume.',
                placement: 'left',
            },
            {
                target: '#kms-demo-ap-table',
                title: 'Step 4 · After a decision',
                content:
                    'When you accept or reject someone, the applicant gets an automatic email, so there is nothing else to send. Keep the record until the person starts: it is the source of their contact details and documents.',
                placement: 'top',
            },
        ],
    },
    'approving-and-rejecting': {
        simulation: 'business-partners',
        steps: [
            {
                target: '#kms-demo-bp-table',
                title: 'Step 1 · The inquiry list',
                content:
                    'Partnership requests from organizations arrive here automatically with the company, contact person, partnership type, and status. Each request also shows when it was submitted, so you can see how long it has waited.',
                placement: 'top',
            },
            {
                target: '#kms-demo-bp-status',
                title: 'Step 2 · Pending by default',
                content:
                    'New requests start as Pending. Approve the ones that fit your service area, and the status badge updates so the whole team sees the outcome. Approved partners can book trips against your services.',
                placement: 'bottom',
            },
            {
                target: '#kms-demo-bp-actions',
                title: 'Step 3 · Approve or reject',
                content:
                    'The actions menu offers Approve and Reject for pending requests. Approving asks for the company email that receives the confirmation; rejecting asks for a reason that is emailed to them. Both emails go out right away, so decide with care.',
                placement: 'left',
            },
            {
                target: '#kms-demo-bp-table',
                title: 'Step 4 · Follow up on pending requests',
                content:
                    'Check the Pending requests regularly so organizations are not left waiting. Once a decision is made, the row\u2019s badge updates permanently and there is no undo, only a new request.',
                placement: 'top',
            },
        ],
    },
    'editing-content-sections': {
        simulation: 'cms-sections',
        steps: [
            {
                target: '#kms-demo-cms-grid',
                title: 'Step 1 · Content sections',
                content:
                    'Each card is one area of the public website, such as Company Info or Page Headers. The list here is a sample: the real editor has every section. Changes go live immediately, so this is where the site is actually maintained.',
                placement: 'top',
            },
            {
                target: '#kms-demo-cms-edit',
                title: 'Step 2 · Edit a section',
                content:
                    'Click the pencil on any section to open its editor. Fields match their content type: text, text area, one-item-per-line lists, switches, numbers, images, and tables. Save publishes to the site instantly.',
                placement: 'left',
            },
            {
                target: '#kms-demo-cms-restore',
                title: 'Step 3 · Restore a section',
                content:
                    'The restore button deletes your edits and brings back the original content for that section alone. Use it when you want to start over on one area without touching anything else.',
                placement: 'right',
            },
            {
                target: '#kms-demo-cms-restore-all',
                title: 'Step 4 · Restore everything',
                content:
                    'Restore all content resets every section and collection at once. It is the most powerful button in the CMS and the removed edits cannot be recovered, so it is reserved for a full reset.',
                placement: 'bottom',
            },
        ],
    },
    'restoring-defaults': {
        simulation: 'cms-sections',
        steps: [
            {
                target: '#kms-demo-cms-restore',
                title: 'Step 1 · Restore one area',
                content:
                    'Restoring a single section resets only that area to its shipped defaults. Everything else stays exactly as you edited it, so it is safe to use when one section looks broken.',
                placement: 'right',
            },
            {
                target: '#kms-demo-cms-grid',
                title: 'Step 2 · Know which section is broken',
                content:
                    'Before restoring, read the card description to confirm you are resetting the right area. Company Info, Dispatch Hours, Payment Methods, and Page Headers each have their own reset button.',
                placement: 'top',
            },
            {
                target: '#kms-demo-cms-restore-all',
                title: 'Step 3 · Restore everything',
                content:
                    'Restore all content resets every section and collection at once. It is the most powerful button in the CMS and the removed edits cannot be recovered. Only use it when the whole site needs a fresh start.',
                placement: 'bottom',
            },
            {
                target: '#kms-demo-cms-restore',
                title: 'Step 4 · Check the live site',
                content:
                    'After any restore, open the public page to confirm the website looks the way you expect. If a specific area still looks wrong after a restore, contact the developer, because the issue may be in the page code, not the content.',
                placement: 'right',
            },
        ],
    },
};
