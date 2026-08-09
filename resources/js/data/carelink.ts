import type { HeroSlide } from '@/types/carelink';

export const COMPANY_INFO = {
    name: 'Carelink Medical Transportation LLC',
    logoUrl: 'https://i.postimg.cc/3JTcHYYX/CL-Carelink.png',
    logoWithTextUrl: 'https://i.postimg.cc/3JTcHYYX/CL-Carelink.png',
    tagline: 'Connecting Patients to Better Health Every Mile with Compassion. Every Trip with Purpose.',
    headquarters: 'Eureka, California',
    phone: '(707) 854-9350',
    email: 'dispatch@carelinknemt.com',
    dispatchPhone: '(707) 854-9350',
    address: '3857 Walnut Drive, Suite B, Eureka, CA 95503',
    serviceRegion: 'Northern California Region (Humboldt, Del Norte, Trinity, & Shasta Counties)',
    counties: ['Humboldt', 'Del Norte', 'Trinity', 'Shasta'],
};

export const HERO_SLIDES: HeroSlide[] = [
    {
        id: 'slide-1',
        title: 'Reliable NEMT Care',
        subtitle: 'Connecting patients to care across Northern California.',
        highlightText: 'Compassionate. Punctual. Dependable.',
        bgImage: '/images/Img-Carelink-hero.webp',
        features: [
            { title: 'Accessible Vehicles', description: 'ADA-compliant hydraulic lifts & safety tie-down systems', icon: 'ShieldCheck' },
            { title: 'Smart Dispatch', description: 'Real-time GPS ride tracking & instant dispatching', icon: 'Clock' },
            { title: 'Facility Partnering', description: 'Direct billing for hospitals, clinics, & insurers', icon: 'Building2' },
        ],
    },
    {
        id: 'slide-2',
        title: 'Dialysis & Specialist Care',
        subtitle: 'Serving Humboldt, Del Norte, Trinity, & Shasta counties.',
        highlightText: 'Guaranteed On-Time Patient Rides',
        bgImage: '/images/Carelink-hero1.webp',
        features: [
            { title: 'Recurring Transfers', description: 'Scheduled multi-week dialysis & therapy rides', icon: 'ShieldCheck' },
            { title: 'Certified Drivers', description: 'CPR-certified, HIPAA-trained & background-checked', icon: 'HeartPulse' },
            { title: 'Flexible Billing', description: 'Medicaid, insurance, or direct facility billing', icon: 'CreditCard' },
        ],
    },
    {
        id: 'slide-3',
        title: 'Curb-to-Curb Support',
        subtitle: 'Gentle driveway support loading and unloading from our modern fleet.',
        highlightText: 'Comfort & Dignity Every Mile',
        bgImage: '/images/carelink_driver_care_1785061489888.jpg',
        features: [
            { title: 'Full Assistance', description: 'Support from home driveway directly into the vehicle', icon: 'UserCheck' },
            { title: 'Medical Equipment', description: 'Accommodates oxygen tanks, walkers, & IV poles', icon: 'Sparkles' },
            { title: 'Dependable Availability', description: 'Reliable dispatch for hospital discharges', icon: 'PhoneCall' },
        ],
    },
    {
        id: 'slide-4',
        title: 'Long-Distance Transport',
        subtitle: 'Providing dependable long-distance transportation to major medical hubs.',
        highlightText: 'Long-distance trips: safe and reliable service',
        bgImage: '/images/carelink_ambulatory_sedan_1786020571564.jpg',
        features: [
            { title: 'Safe Service', description: 'Dependable out-of-town trips to specialists', icon: 'ShieldCheck' },
            { title: 'Comfortable Ride', description: 'Climate-controlled cabins for extended journeys', icon: 'Sparkles' },
            { title: 'Door-to-Door', description: 'Seamless transfers from home to regional centers', icon: 'UserCheck' },
        ],
    },
];

export const PATIENT_REVIEWS = [
    {
        id: 1,
        author: 'Chris M.',
        initials: 'CM',
        rating: 5,
        date: '2 days ago',
        text: 'Always on time, polite, and highly professional. A lifesaver for dialysis.',
        avatarBg: 'bg-emerald-100 text-emerald-800',
        avatar: '/images/persons/person-1.jpeg',
    },
    {
        id: 2,
        author: 'Robert K.',
        initials: 'RK',
        rating: 5,
        date: '1 week ago',
        text: 'Wonderful curb-to-curb service. The driver helped my father safely to the car.',
        avatarBg: 'bg-cyan-100 text-cyan-800',
        avatar: '/images/persons/person-2.jpg',
    },
    {
        id: 3,
        author: 'Sarah J.',
        initials: 'SJ',
        rating: 5,
        date: '2 weeks ago',
        text: 'Prompt, reliable, and fantastic dispatchers. Highly dependable partners.',
        avatarBg: 'bg-indigo-100 text-indigo-800',
        avatar: '/images/persons/person-7.jpg',
    },
    {
        id: 4,
        author: 'Thomas L.',
        initials: 'TL',
        rating: 5,
        date: '3 weeks ago',
        text: 'Excellent communication and patient drivers. Top-notch service!',
        avatarBg: 'bg-pink-100 text-pink-800',
        avatar: '/images/persons/person-4.webp',
    },
    {
        id: 5,
        author: 'Marcus D.',
        role: 'Son of Patient',
        initials: 'MD',
        rating: 5,
        date: '1 month ago',
        text: 'Extremely reliable wheelchair transport. Gives us complete peace of mind.',
        avatarBg: 'bg-amber-100 text-amber-800',
        avatar: '/images/persons/person-6.webp',
    },
];

export const PAYMENT_METHODS = [
    { name: 'Visa', src: '/images/payments/Visa.png' },
    { name: 'Mastercard', src: '/images/payments/Mastercard.png' },
    { name: 'American Express', src: '/images/payments/American-Express.png' },
    { name: 'Discover Network', src: '/images/payments/Discover-Network.png' },
    { name: 'UnionPay', src: '/images/payments/UnionPay.png' },
    { name: 'Maestro', src: '/images/payments/Mastero.png' },
    { name: 'PayPal', src: '/images/payments/PayPal.png' },
    { name: 'Western Union', src: '/images/payments/Western-Union.png' },
    { name: 'Apple Pay', src: '/images/payments/Apple-Pay.png' },
    { name: 'Google Pay', src: '/images/payments/Gpay.png' },
];

export const DISPATCH_HOURS = [
    { day: 'Monday', hours: '7:00 a.m.-6:00 p.m.' },
    { day: 'Tuesday', hours: '7:00 a.m.-6:00 p.m.' },
    { day: 'Wednesday', hours: '7:00 a.m.-6:00 p.m.' },
    { day: 'Thursday', hours: '7:00 a.m.-6:00 p.m.' },
    { day: 'Friday', hours: '7:00 a.m.-6:00 p.m.' },
    { day: 'Saturday', hours: '7:00 a.m.-1:00 p.m.' },
    { day: 'Sunday', hours: '7:00 a.m.-1:00 p.m.' },
];

export const TRUSTED_PARTNERS = [
    { name: 'St. Joseph Hospital Eureka', type: 'Regional Hospital' },
    { name: 'Mad River Community Hospital', type: 'Medical Center' },
    { name: 'Redwoods Rural Health Center', type: 'Community Clinic' },
    { name: 'Shasta Regional Medical Center', type: 'Specialty Center' },
    { name: 'Bambi NEMT Scheduling', type: 'Technology Partner' },
    { name: 'Northern California VA Clinic', type: 'Veterans Health' },
];
