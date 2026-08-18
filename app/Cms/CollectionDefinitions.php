<?php

namespace App\Cms;

/**
 * Default rows for every CMS-managed collection (services, fleet vehicles,
 * team members, FAQs, blog posts). This is the single source of truth used
 * by CarelinkContentSeeder and by the restore-to-defaults actions, so the
 * collections always reset to exactly the seeded content.
 *
 * Rows are keyed by the unique column their model is matched on in the
 * seeder: services and blog posts by `slug`, fleet and team by `name`,
 * FAQs by `question`.
 */
class CollectionDefinitions
{
    /**
     * @return array<string, array<int, array<string, mixed>>>
     */
    public static function all(): array
    {
        return [
            'services' => self::services(),
            'fleet' => self::fleetVehicles(),
            'team' => self::teamMembers(),
            'faqs' => self::faqs(),
            'blog' => self::blogPosts(),
        ];
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private static function services(): array
    {
        return [
            [
                'slug' => 'wheelchair-transport',
                'category' => 'MEDICAL',
                'title' => 'Wheelchair Transport',
                'short_description' => 'ADA-compliant hydraulic vans with curb-to-curb driveway assistance.',
                'full_description' => 'Our wheelchair-accessible vans feature state-of-the-art hydraulic ramps, 4-point Q\'Straint automatic floor tie-downs, and lowered floors. Highly trained drivers provide safe curb-to-curb assistance, helping passengers step into and out of the vehicle at their driveway.',
                'benefits' => [
                    'Heavy-duty hydraulic lift supports',
                    '4-Point Q\'Straint wheelchair restraint system',
                    'Curb-to-curb safe driveway assistance',
                    'Accommodates extra companion passenger at no charge',
                ],
                'image' => '/images/wheelchair.webp',
                'icon_name' => 'Wheelchair',
                'suitable_for' => ['Standard Wheelchairs', 'Electric Power Chairs', 'Reclining Wheelchairs'],
                'typical_destinations' => ['Dialysis Centers', 'Physical Therapy', 'Specialist Clinics', 'Family Visits'],
                'base_rate' => 45,
                'mileage_rate' => 3.5,
                'sort_order' => 1,
            ],
            [
                'slug' => 'group-transit-shuttle',
                'category' => 'MEDICAL',
                'title' => 'Group Transit Shuttle',
                'short_description' => 'Multi-passenger shuttle services for senior facilities and community outings.',
                'full_description' => 'Our high-roof commercial transit shuttles are designed for senior living communities, rehabilitation clinics, and adult day centers requiring simultaneous multi-passenger transport. Fully ADA-compliant with wide ramps and safety rails.',
                'benefits' => [
                    'High-capacity configuration fits',
                    'Dual commercial wheelchair security ramps',
                    'Fully integrated non-slip grab rails',
                    'Cost-effective group rates for medical facilities',
                ],
                'image' => '/images/public-transit.webp',
                'icon_name' => 'Users',
                'suitable_for' => ['Senior Care Groups', 'Adult Day Care Members', 'Large Families', 'Dialysis Groups'],
                'typical_destinations' => ['Senior Centers', 'Group Therapy', 'Community Events', 'Medical Outings'],
                'base_rate' => 85,
                'mileage_rate' => 4.5,
                'sort_order' => 2,
            ],
            [
                'slug' => 'ambulatory-sedan',
                'category' => 'MEDICAL',
                'title' => 'Ambulatory Sedan',
                'short_description' => 'Comfortable sedan rides for patients walking with minimal aid.',
                'full_description' => 'Ideal for ambulatory seniors and patients who require a reliable ride to medical appointments but do not require a wheelchair ramp. Includes curb-to-curb assistance in and out of the vehicle and help with mobility walkers.',
                'benefits' => [
                    'Spacious late-model sedan seating',
                    'Driver assistance with walkers and bags',
                    'Direct pickup from home driveway',
                    'Covered by many managed care insurance plans',
                ],
                'image' => '/images/carelink_ambulatory_sedan_1786020571564.jpg',
                'icon_name' => 'Car',
                'suitable_for' => ['Seniors', 'Routine Doctor Visits', 'Lab Work', 'Pharmacy Visits'],
                'typical_destinations' => ['Primary Care Physicians', 'Optometry & Dental Clinics', 'Outpatient Surgery'],
                'base_rate' => 20,
                'mileage_rate' => 2.5,
                'sort_order' => 3,
            ],
            [
                'slug' => 'hospital-discharges',
                'category' => 'SPECIALTY',
                'title' => 'Hospital Discharges',
                'short_description' => 'Fast B2B discharge transfers for hospitals and clinics.',
                'full_description' => 'Direct B2B integration with hospital case managers and social workers to prevent discharge delays and reduce bed-block. Connects with NEMT software for real-time dispatch tracking.',
                'benefits' => [
                    'Fast response time for urgent hospital discharges',
                    'Direct facility invoicing & electronic billing',
                    'NEMT software portal integration for case managers',
                    'Dedicated facility liaison phone line',
                ],
                'image' => '/images/hospital-discharge.webp',
                'icon_name' => 'Building2',
                'suitable_for' => ['Hospital Social Workers', 'Case Managers', 'Discharge Coordinators'],
                'typical_destinations' => ['St. Joseph Hospital Eureka', 'Mad River Community Hospital', 'Redwoods Rural Health'],
                'base_rate' => 75,
                'mileage_rate' => 3.5,
                'sort_order' => 4,
            ],
            [
                'slug' => 'community-rides',
                'category' => 'NON_MEDICAL',
                'title' => 'Community Rides',
                'short_description' => 'Dignified rides for seniors for errands, events, and family visits.',
                'full_description' => 'Healthcare goes beyond doctor visits. We provide dignified transport for life events, grocery shopping, adult day care, bank visits, and family celebrations across Northern California.',
                'benefits' => [
                    'Flexible hourly charter options',
                    'Patient driver waits during quick errands',
                    'Curb-to-curb courteous help',
                    'Family peace-of-mind real-time ride tracking',
                ],
                'image' => '/images/carelink_driver_care_1785061489888.jpg',
                'icon_name' => 'Heart',
                'suitable_for' => ['Seniors', 'Wheelchair Users', 'Adult Day Care Members'],
                'typical_destinations' => ['Community Centers', 'Grocery Stores', 'Family Reunions', 'Religious Services'],
                'base_rate' => 45,
                'mileage_rate' => 3.0,
                'sort_order' => 5,
            ],
            [
                'slug' => 'long-distance-trips',
                'category' => 'MEDICAL',
                'title' => 'Long-Distance Trips',
                'short_description' => 'Long-distance trips: safe and reliable service',
                'full_description' => 'Providing dependable long-distance transportation to the Bay Area, San Francisco, San Jose, Chico, Sacramento, and other destinations.',
                'benefits' => [
                    'Comfortable climate-controlled vehicles',
                    'Experienced long-distance drivers',
                    'Door-to-door safe service',
                    'Reliable specialized medical transport',
                ],
                'image' => '/images/carelink_ambulatory_sedan_1786020571564.jpg',
                'icon_name' => 'MapPin',
                'suitable_for' => ['Specialist Appointments', 'Out-of-Area Surgeries', 'Hospital Transfers'],
                'typical_destinations' => ['San Francisco', 'San Jose', 'Chico', 'Sacramento', 'Bay Area'],
                'base_rate' => 90,
                'mileage_rate' => 4.0,
                'sort_order' => 6,
            ],
        ];
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private static function fleetVehicles(): array
    {
        return [
            [
                'name' => 'Carelink Transporter Max (Wheelchair Van)',
                'type' => 'WHEELCHAIR',
                'capacity' => '1 Wheelchair + 3 Ambulatory Passengers',
                'description' => 'Custom lowered-floor vehicle fitted with heavy-duty BraunAbility hydraulic lift, dual AC, and impact-absorbing flooring.',
                'features' => ['BraunAbility Electric Lift', '4-Point Q\'Straint Locks', 'High-Visibility Safety Steps', 'Dual Zone Climate Control'],
                'image' => '/images/carelink_hero_van_1785061463464.jpg',
                'accessibility_specs' => ['Door opening height: 58 inches', 'Lift capacity: 800 lbs', 'ADA Compliant'],
                'hourly_rate_est' => 75,
                'sort_order' => 1,
            ],
            [
                'name' => 'Carelink Multi-Passenger Shuttle Van',
                'type' => 'TRANSIT_SHUTTLE',
                'capacity' => '1 Wheelchair + 5 Ambulatory Passengers',
                'description' => 'High-capacity conversion van offering spacious bench seating, non-slip entry steps, and generous rear cargo space for folders/walkers.',
                'features' => ['Curb-Side Entry Step', 'Aisle Safety Rails', 'Foldable Mobility Storage', 'Rear Climate Controls'],
                'image' => '/images/carelink_driver_care_1785061489888.jpg',
                'accessibility_specs' => ['Step height: 8 inches', 'Wide entry grab rails', 'Spacious aisle configuration'],
                'hourly_rate_est' => 90,
                'sort_order' => 2,
            ],
            [
                'name' => 'Carelink Executive Ambulatory Cruiser',
                'type' => 'AMBULATORY',
                'capacity' => '4 Passengers + Luggage/Walker',
                'description' => 'Premium fuel-efficient sedan offering plush leather seating, easy low-step entry, and generous trunk room for foldable wheelchairs.',
                'features' => ['Low Step-In Height', 'Deep Trunk Space for Walkers', 'Heated Seats', 'GPS Real-Time Tracking'],
                'image' => '/images/carelink_driver_care_1785061489888.jpg',
                'accessibility_specs' => ['Extra wide door opening angle', 'Non-slip running boards'],
                'hourly_rate_est' => 55,
                'sort_order' => 3,
            ],
            [
                'name' => 'Carelink Community Transit Shuttle',
                'type' => 'TRANSIT_SHUTTLE',
                'capacity' => '2 Wheelchairs + 6 Ambulatory Passengers',
                'description' => 'High-roof transit bus designed for group transfers from senior living communities and adult care centers.',
                'features' => ['Commercial Rear Wheelchair Ramp', 'Aisle Handrails', 'Emergency First Aid Kit', 'PA System'],
                'image' => '/images/carelink_hospital_partner_1785061502105.jpg',
                'accessibility_specs' => ['High-ceiling clearance (72in)', 'ADA Approved Lighting'],
                'hourly_rate_est' => 110,
                'sort_order' => 4,
            ],
        ];
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private static function teamMembers(): array
    {
        return [
            [
                'name' => 'Abel Feyisa',
                'role' => 'Managing Director & Founder',
                'title' => 'Carelink Executive Representative',
                'bio' => 'Abel founded Carelink Medical Transportation LLC with a mission to eliminate healthcare transportation barriers in Northern California. With extensive background in healthcare logistics and community transit, Abel leads Carelink with compassion and operational discipline.',
                'image' => 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80',
                'certifications' => ['NEMT Executive Leadership', 'HIPAA Healthcare Logistics', 'First Aid / CPR Certified'],
                'experience_years' => 12,
                'sort_order' => 1,
            ],
            [
                'name' => 'Sarah Jenkins',
                'role' => 'Chief Dispatcher & Operations Manager',
                'title' => 'Lead Dispatch Specialist',
                'bio' => 'Oversees the Bambi NEMT software dispatch system, route optimization across Humboldt and Shasta counties, and real-time fleet communication.',
                'image' => 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
                'certifications' => ['Certified NEMT Dispatcher', 'Bambi System Specialist', 'Emergency Response Coordinator'],
                'experience_years' => 9,
                'sort_order' => 2,
            ],
            [
                'name' => 'Marcus Vance',
                'role' => 'Head of Fleet Safety & Driver Training',
                'title' => 'Safety Compliance Officer',
                'bio' => 'Conducts rigorous defensive driving, wheelchair lift operation, and patient handling training for all Carelink transport personnel.',
                'image' => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
                'certifications' => ['PASS Certified Trainer', 'Defensive Driving Master Instructor', 'ADA Compliance Specialist'],
                'experience_years' => 15,
                'sort_order' => 3,
            ],
        ];
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private static function faqs(): array
    {
        return [
            [
                'question' => 'How do I book a non-emergency medical ride with Carelink?',
                'answer' => 'You can book directly on our website using our instant Ride Booking Intake form, call our dispatch line at (707) 854-9350, or ask your hospital case manager to book via our NEMT portal.',
                'category' => 'BOOKING & SERVICE',
                'sort_order' => 1,
            ],
            [
                'question' => 'Which counties in California does Carelink serve?',
                'answer' => 'Carelink primarily operates across Northern California including Humboldt, Del Norte, Trinity, and Shasta counties, as well as regional long-distance medical transfers to specialty medical centers in San Francisco or Sacramento.',
                'category' => 'COVERAGE & COUNTIES',
                'sort_order' => 2,
            ],
            [
                'question' => 'Does Carelink bill Medicaid, Medi-Cal, or insurance directly?',
                'answer' => 'Yes! We work with managed care organizations, Medi-Cal, worker\'s compensation plans, and hospital facilities for direct billing. We also accept PCI-compliant credit card payments via Stripe and Square for private-pay passengers.',
                'category' => 'PAYMENT & INSURANCE',
                'sort_order' => 3,
            ],
            [
                'question' => 'What if I do not own a wheelchair?',
                'answer' => 'Carelink provides wheelchairs for the duration of the transport. Our curb-to-curb drivers will assist you safely from your driveway into the vehicle and help you step out at your medical appointment.',
                'category' => 'ACCESSIBILITY & WHEELCHAIRS',
                'sort_order' => 4,
            ],
            [
                'question' => 'How do hospital social workers and discharge planners partner with Carelink?',
                'answer' => 'Hospitals can register on our B2B Partnership portal for streamlined dispatching, guaranteed response times for hospital discharge, and consolidated monthly facility invoicing.',
                'category' => 'B2B & HOSPITALS',
                'sort_order' => 5,
            ],
            [
                'question' => 'Can a family member or caregiver ride along with the patient?',
                'answer' => 'Yes! One family companion or certified personal care aide can ride along with the patient at no extra charge.',
                'category' => 'COMPANIONS & FAMILY',
                'sort_order' => 6,
            ],
        ];
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private static function blogPosts(): array
    {
        return [
            [
                'title' => 'Understanding Non-Emergency Medical Transportation (NEMT) in Northern California',
                'slug' => 'understanding-nemt-northern-california',
                'category' => 'PATIENT ADVISORY',
                'read_time' => '4 min read',
                'summary' => 'A complete guide to booking curb-to-curb wheelchair and group shuttle transport across Humboldt and Shasta counties.',
                'excerpt' => 'Accessing specialized medical appointments in rural Northern California shouldn\'t be hindered by mobility limitations.',
                'content' => 'For many residents in Humboldt, Del Norte, Trinity, and Shasta counties, traveling to regional specialist hospitals or recurring dialysis centers requires specialized vehicles equipped with wheelchair ramps or group shuttles. Non-Emergency Medical Transportation (NEMT) bridges this gap, providing compassionate, curb-to-curb care.',
                'author' => 'Abel Feyisa',
                'image' => '/images/carelink_hero_van_1785061463464.jpg',
                'published_at' => '2026-07-18 09:00:00',
            ],
            [
                'title' => 'How Carelink Leverages Bambi NEMT Tech for Zero-Delay Hospital Discharges',
                'slug' => 'bambi-nemt-zero-delay-hospital-discharges',
                'category' => 'HEALTHCARE LOGISTICS',
                'read_time' => '5 min read',
                'summary' => 'Discover how automated dispatch software reduces hospital bed-block and ensures on-time patient pick-ups.',
                'excerpt' => 'Hospital discharge coordinators require reliable arrival times to free up acute care beds efficiently.',
                'content' => 'By integrating Bambi NEMT scheduling software directly with hospital case management workflows, Carelink provides real-time vehicle GPS tracking, automated driver assignment, and instant digital proof of transport completion.',
                'author' => 'Sarah Jenkins',
                'image' => '/images/carelink_hospital_partner_1785061502105.jpg',
                'published_at' => '2026-07-10 09:00:00',
            ],
            [
                'title' => 'Top 5 Safety Standards to Look for in a Wheelchair Van Provider',
                'slug' => 'top-5-safety-standards-wheelchair-van',
                'category' => 'SAFETY & COMPLIANCE',
                'read_time' => '3 min read',
                'summary' => 'Learn about Q\'Straint floor locks, PASS driver certifications, and HIPAA privacy standards in patient transit.',
                'excerpt' => 'Patient safety is paramount during every mile of medical transport.',
                'content' => 'Not all transportation providers are created equal. When selecting a medical transport service for a loved one, insist on 4-point automatic tie-downs, regular lift inspections, and CPR-certified drivers.',
                'author' => 'Marcus Vance',
                'image' => '/images/carelink_driver_care_1785061489888.jpg',
                'published_at' => '2026-06-28 09:00:00',
            ],
        ];
    }
}
