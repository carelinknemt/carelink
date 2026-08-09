
import carelinkHero1 from '../assets/images/Carelink-hero1.webp';
import ambulatorySedanImg from '../assets/images/carelink_ambulatory_sedan_1786020571564.jpg';
import driverCareImg from '../assets/images/carelink_driver_care_1785061489888.jpg';
import fleetGurneyImg from '../assets/images/carelink_fleet_gurney_1785061477575.jpg';
import heroVanImg from '../assets/images/carelink_hero_van_1785061463464.jpg';
import hospitalPartnerImg from '../assets/images/carelink_hospital_partner_1785061502105.jpg';
import hospitalDischargeImg from '../assets/images/hospital-discharge.webp';
import imgCarelinkHero from '../assets/images/Img-Carelink-hero.webp';
import publicTransitImg from '../assets/images/public-transit.webp';
import wheelchairImg from '../assets/images/wheelchair.webp';
import type { TransportService, VehicleFleet, TeamMember, HeroSlide, FAQItem, BlogPost } from '../types';

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
  leadership: {
    managingRepresentative: 'Abel Feyisa',
    title: 'Managing Director & Founder',
    developers: ['Pawlos Mulugeta', 'Yeabsira Moges']
  }
};

export const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'slide-1',
    title: 'Reliable NEMT Care',
    subtitle: 'Connecting patients to care across Northern California.',
    highlightText: 'Compassionate. Punctual. Dependable.',
    bgImage: imgCarelinkHero,
    features: [
      {
        title: 'Accessible Vehicles',
        description: 'ADA-compliant hydraulic lifts & safety tie-down systems',
        icon: 'ShieldCheck'
      },
      {
        title: 'Smart Dispatch',
        description: 'Real-time GPS ride tracking & instant dispatching',
        icon: 'Clock'
      },
      {
        title: 'Facility Partnering',
        description: 'Direct billing for hospitals, clinics, & insurers',
        icon: 'Building2'
      }
    ]
  },
  {
    id: 'slide-2',
    title: 'Dialysis & Specialist Care',
    subtitle: 'Serving Humboldt, Del Norte, Trinity, & Shasta counties.',
    highlightText: 'Guaranteed On-Time Patient Rides',
    bgImage: carelinkHero1,
    features: [
      {
        title: 'Recurring Transfers',
        description: 'Scheduled multi-week dialysis & therapy rides',
        icon: 'ShieldCheck'
      },
      {
        title: 'Certified Drivers',
        description: 'CPR-certified, HIPAA-trained & background-checked',
        icon: 'HeartPulse'
      },
      {
        title: 'Flexible Billing',
        description: 'Medicaid, insurance, or direct facility billing',
        icon: 'CreditCard'
      }
    ]
  },
  {
    id: 'slide-3',
    title: 'Curb-to-Curb Support',
    subtitle: 'Gentle driveway support loading and unloading from our modern fleet.',
    highlightText: 'Comfort & Dignity Every Mile',
    bgImage: driverCareImg,
    features: [
      {
        title: 'Full Assistance',
        description: 'Support from home driveway directly into the vehicle',
        icon: 'UserCheck'
      },
      {
        title: 'Medical Equipment',
        description: 'Accommodates oxygen tanks, walkers, & IV poles',
        icon: 'Sparkles'
      },
      {
        title: 'Dependable Availability',
        description: 'Reliable dispatch for hospital discharges',
        icon: 'PhoneCall'
      }
    ]
  },
  {
    id: 'slide-4',
    title: 'Long-Distance Transport',
    subtitle: 'Providing dependable long-distance transportation to major medical hubs.',
    highlightText: 'Long-distance trips: safe and reliable service',
    bgImage: ambulatorySedanImg,
    features: [
      {
        title: 'Safe Service',
        description: 'Dependable out-of-town trips to specialists',
        icon: 'ShieldCheck'
      },
      {
        title: 'Comfortable Ride',
        description: 'Climate-controlled cabins for extended journeys',
        icon: 'Sparkles'
      },
      {
        title: 'Door-to-Door',
        description: 'Seamless transfers from home to regional centers',
        icon: 'UserCheck'
      }
    ]
  }
];

export const TRANSPORT_SERVICES: TransportService[] = [
  {
    id: 'srv-1',
    category: 'MEDICAL',
    title: 'Wheelchair Transport',
    shortDescription: 'ADA-compliant hydraulic vans with curb-to-curb driveway assistance.',
    fullDescription: 'Our wheelchair-accessible vans feature state-of-the-art hydraulic ramps, 4-point Q’Straint automatic floor tie-downs, and lowered floors. Highly trained drivers provide safe curb-to-curb assistance, helping passengers step into and out of the vehicle at their driveway.',
    benefits: [
      'Heavy-duty hydraulic lift supports',
      '4-Point Q’Straint wheelchair restraint system',
      'Curb-to-curb safe driveway assistance',
      'Accommodates extra companion passenger at no charge'
    ],
    image: wheelchairImg,
    iconName: 'Wheelchair',
    suitableFor: ['Standard Wheelchairs', 'Electric Power Chairs', 'Reclining Wheelchairs'],
    typicalDestinations: ['Dialysis Centers', 'Physical Therapy', 'Specialist Clinics', 'Family Visits']
  },
  {
    id: 'srv-2',
    category: 'MEDICAL',
    title: 'Group Transit Shuttle',
    shortDescription: 'Multi-passenger shuttle services for senior facilities and community outings.',
    fullDescription: 'Our high-roof commercial transit shuttles are designed for senior living communities, rehabilitation clinics, and adult day centers requiring simultaneous multi-passenger transport. Fully ADA-compliant with wide ramps and safety rails.',
    benefits: [
      'High-capacity configuration fits',
      'Dual commercial wheelchair security ramps',
      'Fully integrated non-slip grab rails',
      'Cost-effective group rates for medical facilities'
    ],
    image: publicTransitImg,
    iconName: 'Users',
    suitableFor: ['Senior Care Groups', 'Adult Day Care Members', 'Large Families', 'Dialysis Groups'],
    typicalDestinations: ['Senior Centers', 'Group Therapy', 'Community Events', 'Medical Outings']
  },
  {
    id: 'srv-3',
    category: 'MEDICAL',
    title: 'Ambulatory Sedan',
    shortDescription: 'Comfortable sedan rides for patients walking with minimal aid.',
    fullDescription: 'Ideal for ambulatory seniors and patients who require a reliable ride to medical appointments but do not require a wheelchair ramp. Includes curb-to-curb assistance in and out of the vehicle and help with mobility walkers.',
    benefits: [
      'Spacious late-model sedan seating',
      'Driver assistance with walkers and bags',
      'Direct pickup from home driveway',
      'Covered by many managed care insurance plans'
    ],
    image: ambulatorySedanImg,
    iconName: 'Car',
    suitableFor: ['Seniors', 'Routine Doctor Visits', 'Lab Work', 'Pharmacy Visits'],
    typicalDestinations: ['Primary Care Physicians', 'Optometry & Dental Clinics', 'Outpatient Surgery']
  },
  {
    id: 'srv-4',
    category: 'SPECIALTY',
    title: 'Hospital Discharges',
    shortDescription: 'Fast B2B discharge transfers for hospitals and clinics.',
    fullDescription: 'Direct B2B integration with hospital case managers and social workers to prevent discharge delays and reduce bed-block. Connects with NEMT software for real-time dispatch tracking.',
    benefits: [
      'Fast response time for urgent hospital discharges',
      'Direct facility invoicing & electronic billing',
      'NEMT software portal integration for case managers',
      'Dedicated facility liaison phone line'
    ],
    image: hospitalDischargeImg,
    iconName: 'Building2',
    suitableFor: ['Hospital Social Workers', 'Case Managers', 'Discharge Coordinators'],
    typicalDestinations: ['St. Joseph Hospital Eureka', 'Mad River Community Hospital', 'Redwoods Rural Health']
  },
  {
    id: 'srv-5',
    category: 'NON_MEDICAL',
    title: 'Community Rides',
    shortDescription: 'Dignified rides for seniors for errands, events, and family visits.',
    fullDescription: 'Healthcare goes beyond doctor visits. We provide dignified transport for life events, grocery shopping, adult day care, bank visits, and family celebrations across Northern California.',
    benefits: [
      'Flexible hourly charter options',
      'Patient driver waits during quick errands',
      'Curb-to-curb courteous help',
      'Family peace-of-mind real-time ride tracking'
    ],
    image: driverCareImg,
    iconName: 'Heart',
    suitableFor: ['Seniors', 'Wheelchair Users', 'Adult Day Care Members'],
    typicalDestinations: ['Community Centers', 'Grocery Stores', 'Family Reunions', 'Religious Services']
  },
  {
    id: 'srv-6',
    category: 'MEDICAL',
    title: 'Long-Distance Trips',
    shortDescription: 'Long-distance trips: safe and reliable service',
    fullDescription: 'Providing dependable long-distance transportation to the Bay Area, San Francisco, San Jose, Chico, Sacramento, and other destinations.',
    benefits: [
      'Comfortable climate-controlled vehicles',
      'Experienced long-distance drivers',
      'Door-to-door safe service',
      'Reliable specialized medical transport'
    ],
    image: ambulatorySedanImg,
    iconName: 'MapPin',
    suitableFor: ['Specialist Appointments', 'Out-of-Area Surgeries', 'Hospital Transfers'],
    typicalDestinations: ['San Francisco', 'San Jose', 'Chico', 'Sacramento', 'Bay Area']
  }
];

export const VEHICLE_FLEET: VehicleFleet[] = [
  {
    id: 'flt-1',
    name: 'Carelink Transporter Max (Wheelchair Van)',
    type: 'WHEELCHAIR',
    capacity: '1 Wheelchair + 3 Ambulatory Passengers',
    description: 'Custom lowered-floor vehicle fitted with heavy-duty BraunAbility hydraulic lift, dual AC, and impact-absorbing flooring.',
    features: ['BraunAbility Electric Lift', '4-Point Q’Straint Locks', 'High-Visibility Safety Steps', 'Dual Zone Climate Control'],
    image: heroVanImg,
    accessibilitySpecs: ['Door opening height: 58 inches', 'Lift capacity: 800 lbs', 'ADA Compliant'],
    hourlyRateEst: 75
  },
  {
    id: 'flt-2',
    name: 'Carelink Multi-Passenger Shuttle Van',
    type: 'TRANSIT_SHUTTLE',
    capacity: '1 Wheelchair + 5 Ambulatory Passengers',
    description: 'High-capacity conversion van offering spacious bench seating, non-slip entry steps, and generous rear cargo space for folders/walkers.',
    features: ['Curb-Side Entry Step', 'Aisle Safety Rails', 'Foldable Mobility Storage', 'Rear Climate Controls'],
    image: driverCareImg,
    accessibilitySpecs: ['Step height: 8 inches', 'Wide entry grab rails', 'Spacious aisle configuration'],
    hourlyRateEst: 90
  },
  {
    id: 'flt-3',
    name: 'Carelink Executive Ambulatory Cruiser',
    type: 'AMBULATORY',
    capacity: '4 Passengers + Luggage/Walker',
    description: 'Premium fuel-efficient sedan offering plush leather seating, easy low-step entry, and generous trunk room for foldable wheelchairs.',
    features: ['Low Step-In Height', 'Deep Trunk Space for Walkers', 'Heated Seats', 'GPS Real-Time Tracking'],
    image: driverCareImg,
    accessibilitySpecs: ['Extra wide door opening angle', 'Non-slip running boards'],
    hourlyRateEst: 55
  },
  {
    id: 'flt-4',
    name: 'Carelink Community Transit Shuttle',
    type: 'TRANSIT_SHUTTLE',
    capacity: '2 Wheelchairs + 6 Ambulatory Passengers',
    description: 'High-roof transit bus designed for group transfers from senior living communities and adult care centers.',
    features: ['Commercial Rear Wheelchair Ramp', 'Aisle Handrails', 'Emergency First Aid Kit', 'PA System'],
    image: hospitalPartnerImg,
    accessibilitySpecs: ['High-ceiling clearance (72in)', 'ADA Approved Lighting'],
    hourlyRateEst: 110
  }
];

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'tm-1',
    name: 'Abel Feyisa',
    role: 'Managing Director & Founder',
    title: 'Carelink Executive Representative',
    bio: 'Abel founded Carelink Medical Transportation LLC with a mission to eliminate healthcare transportation barriers in Northern California. With extensive background in healthcare logistics and community transit, Abel leads Carelink with compassion and operational discipline.',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80',
    certifications: ['NEMT Executive Leadership', 'HIPAA Healthcare Logistics', 'First Aid / CPR Certified'],
    experienceYears: 12
  },
  {
    id: 'tm-2',
    name: 'Sarah Jenkins',
    role: 'Chief Dispatcher & Operations Manager',
    title: 'Lead Dispatch Specialist',
    bio: 'Oversees the Bambi NEMT software dispatch system, route optimization across Humboldt and Shasta counties, and real-time fleet communication.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
    certifications: ['Certified NEMT Dispatcher', 'Bambi System Specialist', 'Emergency Response Coordinator'],
    experienceYears: 9
  },
  {
    id: 'tm-3',
    name: 'Marcus Vance',
    role: 'Head of Fleet Safety & Driver Training',
    title: 'Safety Compliance Officer',
    bio: 'Conducts rigorous defensive driving, wheelchair lift operation, and patient handling training for all Carelink transport personnel.',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    certifications: ['PASS Certified Trainer', 'Defensive Driving Master Instructor', 'ADA Compliance Specialist'],
    experienceYears: 15
  }
];

export const FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'BOOKING & SERVICE',
    question: 'How do I book a non-emergency medical ride with Carelink?',
    answer: 'You can book directly on our website using our instant Ride Booking Intake form, call our dispatch line at (707) 854-9350, or ask your hospital case manager to book via our NEMT portal.'
  },
  {
    id: 'faq-2',
    category: 'COVERAGE & COUNTIES',
    question: 'Which counties in California does Carelink serve?',
    answer: 'Carelink primarily operates across Northern California including Humboldt, Del Norte, Trinity, and Shasta counties, as well as regional long-distance medical transfers to specialty medical centers in San Francisco or Sacramento.'
  },
  {
    id: 'faq-3',
    category: 'PAYMENT & INSURANCE',
    question: 'Does Carelink bill Medicaid, Medi-Cal, or insurance directly?',
    answer: 'Yes! We work with managed care organizations, Medi-Cal, worker’s compensation plans, and hospital facilities for direct billing. We also accept PCI-compliant credit card payments via Stripe and Square for private-pay passengers.'
  },
  {
    id: 'faq-4',
    category: 'ACCESSIBILITY & WHEELCHAIRS',
    question: 'What if I do not own a wheelchair?',
    answer: 'Carelink provides wheelchairs for the duration of the transport. Our curb-to-curb drivers will assist you safely from your driveway into the vehicle and help you step out at your medical appointment.'
  },
  {
    id: 'faq-5',
    category: 'B2B & HOSPITALS',
    question: 'How do hospital social workers and discharge planners partner with Carelink?',
    answer: 'Hospitals can register on our B2B Partnership portal for streamlined dispatching, guaranteed response times for hospital discharge, and consolidated monthly facility invoicing.'
  },
  {
    id: 'faq-6',
    category: 'COMPANIONS & FAMILY',
    question: 'Can a family member or caregiver ride along with the patient?',
    answer: 'Yes! One family companion or certified personal care aide can ride along with the patient at no extra charge.'
  }
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'blog-1',
    title: 'Understanding Non-Emergency Medical Transportation (NEMT) in Northern California',
    category: 'PATIENT ADVISORY',
    date: 'July 18, 2026',
    readTime: '4 min read',
    summary: 'A complete guide to booking curb-to-curb wheelchair and group shuttle transport across Humboldt and Shasta counties.',
    excerpt: 'Accessing specialized medical appointments in rural Northern California shouldn’t be hindered by mobility limitations.',
    author: 'Abel Feyisa',
    content: 'For many residents in Humboldt, Del Norte, Trinity, and Shasta counties, traveling to regional specialist hospitals or recurring dialysis centers requires specialized vehicles equipped with wheelchair ramps or group shuttles. Non-Emergency Medical Transportation (NEMT) bridges this gap, providing compassionate, curb-to-curb care.',
    image: heroVanImg
  },
  {
    id: 'blog-2',
    title: 'How Carelink Leverages Bambi NEMT Tech for Zero-Delay Hospital Discharges',
    category: 'HEALTHCARE LOGISTICS',
    date: 'July 10, 2026',
    readTime: '5 min read',
    summary: 'Discover how automated dispatch software reduces hospital bed-block and ensures on-time patient pick-ups.',
    excerpt: 'Hospital discharge coordinators require reliable arrival times to free up acute care beds efficiently.',
    author: 'Sarah Jenkins',
    content: 'By integrating Bambi NEMT scheduling software directly with hospital case management workflows, Carelink provides real-time vehicle GPS tracking, automated driver assignment, and instant digital proof of transport completion.',
    image: hospitalPartnerImg
  },
  {
    id: 'blog-3',
    title: 'Top 5 Safety Standards to Look for in a Wheelchair Van Provider',
    category: 'SAFETY & COMPLIANCE',
    date: 'June 28, 2026',
    readTime: '3 min read',
    summary: 'Learn about Q’Straint floor locks, PASS driver certifications, and HIPAA privacy standards in patient transit.',
    excerpt: 'Patient safety is paramount during every mile of medical transport.',
    author: 'Marcus Vance',
    content: 'Not all transportation providers are created equal. When selecting a medical transport service for a loved one, insist on 4-point automatic tie-downs, regular lift inspections, and CPR-certified drivers.',
    image: driverCareImg
  }
];

export const TRUSTED_PARTNERS = [
  { name: 'St. Joseph Hospital Eureka', type: 'Regional Hospital' },
  { name: 'Mad River Community Hospital', type: 'Medical Center' },
  { name: 'Redwoods Rural Health Center', type: 'Community Clinic' },
  { name: 'Shasta Regional Medical Center', type: 'Specialty Center' },
  { name: 'Bambi NEMT Scheduling', type: 'Technology Partner' },
  { name: 'Northern California VA Clinic', type: 'Veterans Health' }
];
