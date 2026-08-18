<?php

namespace App\Cms;

/**
 * Schema definitions for every CMS-editable content section. The `fields`
 * drive the admin editor UI (text, textarea, number, switch, list, image,
 * table), and the `defaults` are both the seed values and the site-wide
 * fallback when a section row is missing. Field keys are snake_case.
 * Image fields store a URL (site path or /storage/... upload), so they
 * validate like text.
 *
 * Public pages consume these via ContentSection::contentForAll(), shared
 * with every Inertia response under the `cms` prop.
 */
class SectionDefinitions
{
    /**
     * @return array<string, array{
     *     title: string,
     *     description: string,
     *     fields: array<int, array{
     *         key: string,
     *         label: string,
     *         type: 'text'|'textarea'|'number'|'switch'|'list'|'image'|'table',
     *         hint?: string,
     *         cols?: array<int, array{key: string, label: string, type: 'text'|'textarea'|'number'|'image'}>,
     *     }>,
     *     defaults: array<string, mixed>,
     * }>
     */
    public static function all(): array
    {
        return [
            'company_info' => [
                'title' => 'Company Information',
                'description' => 'Brand name, contact details, address, and service area shown in the header, footer, and contact sections.',
                'fields' => [
                    ['key' => 'name', 'label' => 'Company name', 'type' => 'text'],
                    ['key' => 'logo_url', 'label' => 'Logo image', 'type' => 'image'],
                    ['key' => 'tagline', 'label' => 'Tagline', 'type' => 'textarea'],
                    ['key' => 'headquarters', 'label' => 'Headquarters', 'type' => 'text'],
                    ['key' => 'phone', 'label' => 'Phone', 'type' => 'text'],
                    ['key' => 'email', 'label' => 'Email', 'type' => 'text'],
                    ['key' => 'dispatch_phone', 'label' => 'Dispatch phone', 'type' => 'text'],
                    ['key' => 'address', 'label' => 'Address', 'type' => 'text'],
                    ['key' => 'service_region', 'label' => 'Service region', 'type' => 'textarea'],
                    ['key' => 'counties', 'label' => 'Counties served (one per line)', 'type' => 'list'],
                    ['key' => 'home_description', 'label' => 'Home page meta description', 'type' => 'textarea'],
                    ['key' => 'about_description', 'label' => 'About page meta description', 'type' => 'textarea'],
                ],
                'defaults' => [
                    'name' => 'Carelink Medical Transportation LLC',
                    'logo_url' => '/images/cllogo.png',
                    'tagline' => 'Connecting Patients to Better Health Every Mile with Compassion. Every Trip with Purpose.',
                    'headquarters' => 'Eureka, California',
                    'phone' => '(707) 854-9350',
                    'email' => 'dispatch@carelinknemt.com',
                    'dispatch_phone' => '(707) 854-9350',
                    'address' => '3857 Walnut Drive, Suite B, Eureka, CA 95503',
                    'service_region' => 'Northern California Region (Humboldt, Del Norte, Trinity, & Shasta Counties)',
                    'counties' => ['Humboldt', 'Del Norte', 'Trinity', 'Shasta'],
                    'home_description' => 'CareLink Medical Transportation LLC provides compassionate non-emergency medical transportation (NEMT) across Humboldt, Del Norte, Trinity, and Shasta counties. ADA wheelchair vans, dialysis rides, hospital discharges, and curb-to-curb support. Call (707) 854-9350.',
                    'about_description' => 'CareLink Medical Transportation LLC is a family-owned NEMT provider headquartered in Eureka, California, delivering dignified, compassionate, and punctual non-emergency medical transportation across Humboldt, Del Norte, Trinity, and Shasta counties.',
                ],
            ],
            'dispatch_hours' => [
                'title' => 'Dispatch Hours',
                'description' => 'Weekly dispatch hours shown in the contact section and structured data.',
                'fields' => [
                    [
                        'key' => 'days',
                        'label' => 'Dispatch hours by day',
                        'type' => 'table',
                        'cols' => [
                            ['key' => 'day', 'label' => 'Day', 'type' => 'text'],
                            ['key' => 'hours', 'label' => 'Hours', 'type' => 'text'],
                        ],
                    ],
                ],
                'defaults' => [
                    'days' => [
                        ['day' => 'Monday', 'hours' => '7:00 a.m.-6:00 p.m.'],
                        ['day' => 'Tuesday', 'hours' => '7:00 a.m.-6:00 p.m.'],
                        ['day' => 'Wednesday', 'hours' => '7:00 a.m.-6:00 p.m.'],
                        ['day' => 'Thursday', 'hours' => '7:00 a.m.-6:00 p.m.'],
                        ['day' => 'Friday', 'hours' => '7:00 a.m.-6:00 p.m.'],
                        ['day' => 'Saturday', 'hours' => '7:00 a.m.-1:00 p.m.'],
                        ['day' => 'Sunday', 'hours' => '7:00 a.m.-1:00 p.m.'],
                    ],
                ],
            ],
            'payment_methods' => [
                'title' => 'Accepted Payment Methods',
                'description' => 'Payment network logos shown in the footer marquee and the Stripe partnership spotlight.',
                'fields' => [
                    [
                        'key' => 'methods',
                        'label' => 'Payment methods',
                        'type' => 'table',
                        'cols' => [
                            ['key' => 'name', 'label' => 'Name', 'type' => 'text'],
                            ['key' => 'src', 'label' => 'Logo image', 'type' => 'image'],
                        ],
                    ],
                ],
                'defaults' => [
                    'methods' => [
                        ['name' => 'Visa', 'src' => '/images/payments/Visa.png'],
                        ['name' => 'Mastercard', 'src' => '/images/payments/Mastercard.png'],
                        ['name' => 'American Express', 'src' => '/images/payments/American-Express.png'],
                        ['name' => 'Discover Network', 'src' => '/images/payments/Discover-Network.png'],
                        ['name' => 'UnionPay', 'src' => '/images/payments/UnionPay.png'],
                        ['name' => 'Maestro', 'src' => '/images/payments/Mastero.png'],
                        ['name' => 'PayPal', 'src' => '/images/payments/PayPal.png'],
                        ['name' => 'Western Union', 'src' => '/images/payments/Western-Union.png'],
                        ['name' => 'Apple Pay', 'src' => '/images/payments/Apple-Pay.png'],
                        ['name' => 'Google Pay', 'src' => '/images/payments/Gpay.png'],
                    ],
                ],
            ],
            'hero_slides' => [
                'title' => 'Homepage Hero Slides',
                'description' => 'Slides for the rotating homepage hero. Add or remove rows to change the carousel.',
                'fields' => [
                    [
                        'key' => 'slides',
                        'label' => 'Slides',
                        'type' => 'table',
                        'cols' => [
                            ['key' => 'id', 'label' => 'Slide ID', 'type' => 'text'],
                            ['key' => 'title', 'label' => 'Title', 'type' => 'text'],
                            ['key' => 'highlight_text', 'label' => 'Highlight text', 'type' => 'text'],
                            ['key' => 'subtitle', 'label' => 'Subtitle', 'type' => 'textarea'],
                            ['key' => 'bg_image', 'label' => 'Background image', 'type' => 'image'],
                        ],
                    ],
                ],
                'defaults' => [
                    'slides' => [
                        [
                            'id' => 'slide-1',
                            'title' => 'Reliable NEMT Care',
                            'highlight_text' => 'Compassionate. Punctual. Dependable.',
                            'subtitle' => 'Connecting patients to care across Northern California.',
                            'bg_image' => '/images/Img-Carelink-hero.webp',
                        ],
                        [
                            'id' => 'slide-2',
                            'title' => 'Every Medical Ride Covered',
                            'highlight_text' => 'On-Time Rides for Every Appointment',
                            'subtitle' => 'Serving Humboldt, Del Norte, Trinity, & Shasta counties.',
                            'bg_image' => '/images/Carelink-hero1.webp',
                        ],
                        [
                            'id' => 'slide-3',
                            'title' => 'Curb-to-Curb Support',
                            'highlight_text' => 'Comfort & Dignity Every Mile',
                            'subtitle' => 'Gentle driveway support loading and unloading from our modern fleet.',
                            'bg_image' => '/images/carelink_driver_care_1785061489888.jpg',
                        ],
                        [
                            'id' => 'slide-4',
                            'title' => 'Long-Distance Transport',
                            'highlight_text' => 'Long-distance trips: safe and reliable service',
                            'subtitle' => 'Providing dependable long-distance transportation to major medical hubs.',
                            'bg_image' => '/images/carelink_ambulatory_sedan_1786020571564.jpg',
                        ],
                    ],
                ],
            ],
            'patient_reviews' => [
                'title' => 'Google Patient Reviews',
                'description' => 'Testimonials shown in the Google Patient Reviews carousel on the homepage.',
                'fields' => [
                    [
                        'key' => 'reviews',
                        'label' => 'Reviews',
                        'type' => 'table',
                        'cols' => [
                            ['key' => 'author', 'label' => 'Author', 'type' => 'text'],
                            ['key' => 'role', 'label' => 'Role', 'type' => 'text'],
                            ['key' => 'initials', 'label' => 'Initials', 'type' => 'text'],
                            ['key' => 'rating', 'label' => 'Rating (1-5)', 'type' => 'number'],
                            ['key' => 'date', 'label' => 'Date label', 'type' => 'text'],
                            ['key' => 'text', 'label' => 'Review text', 'type' => 'textarea'],
                            ['key' => 'avatar', 'label' => 'Avatar image', 'type' => 'image'],
                            ['key' => 'avatar_bg', 'label' => 'Avatar fallback class', 'type' => 'text'],
                        ],
                    ],
                ],
                'defaults' => [
                    'reviews' => [
                        [
                            'author' => 'Chris M.',
                            'role' => 'Dialysis patient',
                            'initials' => 'CM',
                            'rating' => 5,
                            'date' => '2 days ago',
                            'text' => 'Always on time, polite, and highly professional. A lifesaver for dialysis.',
                            'avatar' => '/images/persons/person-1.jpeg',
                            'avatar_bg' => 'bg-emerald-100 text-emerald-800',
                        ],
                        [
                            'author' => 'Robert K.',
                            'role' => 'Son of patient',
                            'initials' => 'RK',
                            'rating' => 5,
                            'date' => '1 week ago',
                            'text' => 'Wonderful curb-to-curb service. The driver helped my father safely to the car.',
                            'avatar' => '/images/persons/person-2.jpg',
                            'avatar_bg' => 'bg-cyan-100 text-cyan-800',
                        ],
                        [
                            'author' => 'Sarah J.',
                            'role' => 'Case manager',
                            'initials' => 'SJ',
                            'rating' => 5,
                            'date' => '2 weeks ago',
                            'text' => 'Prompt, reliable, and fantastic dispatchers. Highly dependable partners.',
                            'avatar' => '/images/persons/person-7.jpg',
                            'avatar_bg' => 'bg-indigo-100 text-indigo-800',
                        ],
                        [
                            'author' => 'Thomas L.',
                            'role' => 'Patient',
                            'initials' => 'TL',
                            'rating' => 5,
                            'date' => '3 weeks ago',
                            'text' => 'Excellent communication and patient drivers. Top-notch service!',
                            'avatar' => '/images/persons/person-4.webp',
                            'avatar_bg' => 'bg-pink-100 text-pink-800',
                        ],
                        [
                            'author' => 'Marcus D.',
                            'role' => 'Son of Patient',
                            'initials' => 'MD',
                            'rating' => 5,
                            'date' => '1 month ago',
                            'text' => 'Extremely reliable wheelchair transport. Gives us complete peace of mind.',
                            'avatar' => '/images/persons/person-6.webp',
                            'avatar_bg' => 'bg-amber-100 text-amber-800',
                        ],
                    ],
                ],
            ],
            'google_rating_stats' => [
                'title' => 'Google Rating Summary',
                'description' => 'The Google star rating badge shown next to the reviews carousel.',
                'fields' => [
                    ['key' => 'rating', 'label' => 'Star rating', 'type' => 'number'],
                    ['key' => 'review_count', 'label' => 'Review count', 'type' => 'number'],
                    ['key' => 'badge_label', 'label' => 'Badge label', 'type' => 'text'],
                ],
                'defaults' => [
                    'rating' => 4.9,
                    'review_count' => 11,
                    'badge_label' => 'Based on 11+ reviews on Google',
                ],
            ],
            'booking_steps' => [
                'title' => 'Homepage Booking Steps',
                'description' => 'The three-step "how booking works" section. Use {fee} in a point to show the current booking fee amount.',
                'fields' => [
                    [
                        'key' => 'steps',
                        'label' => 'Steps',
                        'type' => 'table',
                        'cols' => [
                            ['key' => 'number', 'label' => 'Step number', 'type' => 'number'],
                            ['key' => 'title', 'label' => 'Title', 'type' => 'text'],
                            ['key' => 'tagline', 'label' => 'Tagline', 'type' => 'text'],
                            ['key' => 'points', 'label' => 'Points (one per line)', 'type' => 'textarea'],
                        ],
                    ],
                ],
                'defaults' => [
                    'steps' => [
                        [
                            'number' => 1,
                            'title' => 'Request Pickup',
                            'tagline' => 'Tell us where, when, and who.',
                            'points' => [
                                'Round-trip by default; return leg removable anytime.',
                                'Wheelchair van or sedan matched to mobility needs.',
                                'Passenger, payer & institutional billing details up front.',
                            ],
                        ],
                        [
                            'number' => 2,
                            'title' => 'Confirm',
                            'tagline' => 'We lock the slot before you pay.',
                            'points' => [
                                'Live availability check: available, full, or uncertain.',
                                'Uncertain? Dispatch confirms manually; never blocked.',
                                'A {fee} fee locks the ride; waived & invoiced for B2B clients.',
                            ],
                        ],
                        [
                            'number' => 3,
                            'title' => 'Complete the Ride',
                            'tagline' => 'Ride out. Pay for what was driven.',
                            'points' => [
                                'Final charge: base fare + actual billable mileage.',
                                'Only the {fee} fee up front; the ride is billed after.',
                                'Cancel 2+ hours before pickup: free. After that the {fee} fee applies; dispatch-cancelled rides auto-refund.',
                            ],
                        ],
                    ],
                ],
            ],
            'booking_fee_settings' => [
                'title' => 'Booking Fee Settings',
                'description' => 'The non-refundable booking fee charged at Stripe checkout. Ambulatory trips use the ambulatory fee; every other transport type uses the standard fee. Changing these updates checkout, the book form, and the booking summaries.',
                'fields' => [
                    ['key' => 'fee_amount_cents', 'label' => 'Standard fee amount (cents)', 'type' => 'number'],
                    ['key' => 'ambulatory_fee_amount_cents', 'label' => 'Ambulatory fee amount (cents)', 'type' => 'number'],
                    ['key' => 'label', 'label' => 'Checkout line item name', 'type' => 'text'],
                ],
                'defaults' => [
                    'fee_amount_cents' => 3000,
                    'ambulatory_fee_amount_cents' => 2000,
                    'label' => 'CareLink Booking Fee',
                ],
            ],
            'term_sections' => [
                'title' => 'Terms & Conditions',
                'description' => 'The /terms page: description, intro, and the four sections of rules.',
                'fields' => [
                    ['key' => 'description', 'label' => 'Meta description', 'type' => 'textarea'],
                    ['key' => 'last_updated', 'label' => 'Last updated label', 'type' => 'text'],
                    ['key' => 'intro', 'label' => 'Intro paragraph', 'type' => 'textarea'],
                    [
                        'key' => 'sections',
                        'label' => 'Terms sections',
                        'type' => 'table',
                        'cols' => [
                            ['key' => 'icon', 'label' => 'Icon (calendar, card, phone, or shield)', 'type' => 'text'],
                            ['key' => 'title', 'label' => 'Title', 'type' => 'text'],
                            ['key' => 'body', 'label' => 'Paragraphs (one per line)', 'type' => 'textarea'],
                        ],
                    ],
                ],
                'defaults' => [
                    'description' => 'Terms and conditions for Carelink Medical Transportation services: booking fees, payment, cancellations, passenger conduct, liability, and privacy for private pay trips across Humboldt, Del Norte, Trinity, and Shasta counties.',
                    'last_updated' => 'August 2026',
                    'intro' => 'These terms and conditions govern the use of {company} online booking service and the provision of medical transportation services. By submitting a trip request, including when you agree to the booking fee at checkout, you accept these terms.',
                    'sections' => [
                        [
                            'icon' => 'calendar',
                            'title' => 'Booking and Scheduling',
                            'body' => [
                                'All trip requests are subject to driver availability and dispatch confirmation. A request submitted through our website is not confirmed until our dispatch team reviews and confirms it.',
                                'Bookings are scheduled for the date and pickup time you provide. We ask that you be ready at your pickup location at least 10 minutes before the scheduled time. If you need more than 15 minutes of waiting time at pickup, please let dispatch know when you book.',
                                'Same-day and will call trips are dispatched on demand and may experience longer wait times during peak hours.',
                            ],
                        ],
                        [
                            'icon' => 'card',
                            'title' => 'Pricing and Payment',
                            'body' => [
                                'Bookings are private pay only. Carelink does not currently bill Medi-Cal, Medicare, or insurance providers for trips booked through this website.',
                                'Trip pricing is estimated from the driving distance between your pickup and dropoff locations. Wheelchair service charges a $45 base fare, which includes the first five miles, plus $3.50 for each additional mile. Ambulatory (taxi) service charges a $20 base fare, which includes the first five miles, plus $2.50 for each additional mile.',
                                'The estimated price is confirmed by our dispatch team before your trip. The final fare may differ from the estimate if the route or trip details change.',
                                'A non-refundable booking fee of {fee} is charged at the time you submit a trip request. This fee reserves your trip and is charged through a secure payment page. The booking fee is not applied toward the trip fare.',
                            ],
                        ],
                        [
                            'icon' => 'phone',
                            'title' => 'Cancellations and Refunds',
                            'body' => [
                                'Call our dispatch team at {phone} as soon as possible to cancel or change a trip. Cancellations made at least two hours before the scheduled pickup time are free.',
                                'The {fee} booking fee is non-refundable. Trip fares are paid directly to the driver at the completion of the trip unless alternative arrangements were made with dispatch in advance.',
                                'Canceled or missed trips remain subject to our dispatch team review. Repeated no-shows may affect your ability to book future trips.',
                            ],
                        ],
                        [
                            'icon' => 'shield',
                            'title' => 'Passenger Conduct and Liability',
                            'body' => [
                                'Passengers must not smoke, eat, or consume alcohol inside our vehicles. Service animals are welcome, and we request that you tell dispatch about any animal accompanying your trip when you book.',
                                'Wheelchair passengers must use the vehicle restraint systems provided by our drivers for their safety. Our drivers may require additional assistance at pickup or dropoff when needed.',
                                'Carelink is not responsible for lost or damaged personal items left in our vehicles. Please check your seating area before leaving the vehicle.',
                                'If you need to reach us about a trip or a question about these terms, call {phone} or email {email}.',
                            ],
                        ],
                    ],
                ],
            ],
            'page_heroes' => [
                'title' => 'Page Headers',
                'description' => 'Title and subtitle for the hero banner of each public page. Use the page slug: about, services, fleet, faq, blog, careers, business, terms, book.',
                'fields' => [
                    [
                        'key' => 'heroes',
                        'label' => 'Page heroes',
                        'type' => 'table',
                        'cols' => [
                            ['key' => 'page', 'label' => 'Page slug', 'type' => 'text'],
                            ['key' => 'title', 'label' => 'Title', 'type' => 'text'],
                            ['key' => 'subtitle', 'label' => 'Subtitle', 'type' => 'textarea'],
                        ],
                    ],
                ],
                'defaults' => [
                    'heroes' => [
                        ['page' => 'about', 'title' => 'About Carelink Medical Transportation LLC', 'subtitle' => 'Headquartered in Eureka, California. Family Owned to provide dignified, compassionate, and punctual non-emergency medical transportation across Humboldt, Del Norte, Trinity, and Shasta counties.'],
                        ['page' => 'services', 'title' => 'Services & Rates', 'subtitle' => 'Explore our wheelchair vans, ambulances, and shuttle services with transparent, affordable rates.'],
                        ['page' => 'fleet', 'title' => 'Our Modern Fleet', 'subtitle' => 'Discover our ADA-compliant wheelchair vans and comfortable group transit vehicles.'],
                        ['page' => 'faq', 'title' => 'Frequently Asked Questions', 'subtitle' => 'Find answers about booking, coverage areas, payment options, and wheelchair transport.'],
                        ['page' => 'blog', 'title' => 'Carelink Blog & Updates', 'subtitle' => 'News, safety tips, and insights from the Carelink Medical Transportation team.'],
                        ['page' => 'careers', 'title' => 'Careers at Carelink', 'subtitle' => 'Join our team of compassionate NEMT professionals across Northern California.'],
                        ['page' => 'business', 'title' => 'Partnerships & B2B Solutions', 'subtitle' => 'For hospitals, clinics, and community organizations.'],
                        ['page' => 'terms', 'title' => 'Terms & Conditions', 'subtitle' => 'Please review the rules that apply to booking and riding with Carelink Medical Transportation.'],
                        ['page' => 'book', 'title' => 'Book a Ride', 'subtitle' => 'Tell us where and when, and we will match you with the right vehicle.'],
                    ],
                ],
            ],
        ];
    }
}
