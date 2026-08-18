<?php

namespace Database\Seeders;

use App\Cms\CollectionDefinitions;
use App\Models\BlogPost;
use App\Models\Career;
use App\Models\Faq;
use App\Models\FleetVehicle;
use App\Models\RideBooking;
use App\Models\Service;
use App\Models\TeamMember;
use Illuminate\Database\Seeder;

class CarelinkContentSeeder extends Seeder
{
    /**
     * Seed the public Carelink NEMT content with the data from the design prototype.
     */
    public function run(): void
    {
        $this->seedServices();
        $this->seedFleet();
        $this->seedTeam();
        $this->seedFaqs();
        $this->seedBlogPosts();
        $this->seedCareers();
        $this->seedDemoBookings();
    }

    private function seedServices(): void
    {
        $services = CollectionDefinitions::all()['services'];

        foreach ($services as $service) {
            Service::updateOrCreate(['slug' => $service['slug']], $service);
        }
    }

    private function seedFleet(): void
    {
        $vehicles = CollectionDefinitions::all()['fleet'];

        foreach ($vehicles as $vehicle) {
            FleetVehicle::updateOrCreate(['name' => $vehicle['name']], $vehicle);
        }
    }

    private function seedTeam(): void
    {
        $members = CollectionDefinitions::all()['team'];

        foreach ($members as $member) {
            TeamMember::updateOrCreate(['name' => $member['name']], $member);
        }
    }

    private function seedFaqs(): void
    {
        $faqs = CollectionDefinitions::all()['faqs'];

        foreach ($faqs as $faq) {
            Faq::updateOrCreate(['question' => $faq['question']], $faq);
        }
    }

    private function seedBlogPosts(): void
    {
        $posts = CollectionDefinitions::all()['blog'];

        foreach ($posts as $post) {
            BlogPost::updateOrCreate(['slug' => $post['slug']], $post);
        }
    }

    private function seedCareers(): void
    {
        $careers = [
            [
                'title' => 'NEMT Driver (Non-Emergency Medical Transport)',
                'location' => 'Eureka, CA Headquarters',
                'employment_type' => 'Full-Time / Part-Time',
                'summary' => 'Transport patients safely to medical appointments with compassion and professionalism.',
                'requirements' => [
                    'Valid CA Driver\'s License required',
                    'CPR & First Aid certification preferred',
                    'Clean driving record',
                ],
                'sort_order' => 1,
            ],
            [
                'title' => 'Dispatch Coordinator',
                'location' => 'Eureka, CA Headquarters',
                'employment_type' => 'Full-Time',
                'summary' => 'Coordinate real-time ride assignments and hospital discharge dispatching.',
                'requirements' => [
                    'Experience with dispatch or logistics software',
                    'Strong communication skills',
                ],
                'sort_order' => 2,
            ],
        ];

        foreach ($careers as $career) {
            Career::updateOrCreate(['title' => $career['title']], $career);
        }
    }

    private function seedDemoBookings(): void
    {
        $bookings = [
            [
                'booking_number' => 'CL-9021',
                'passenger_name' => 'Eleanor Vance',
                'phone' => '(707) 555-0192',
                'email' => 'eleanor.v@example.com',
                'service_type' => 'Wheelchair Van',
                'pickup_address' => '1420 Harrison Ave, Eureka, CA',
                'pickup_county' => 'Humboldt',
                'destination_address' => 'St. Joseph Hospital, Eureka, CA',
                'destination_county' => 'Humboldt',
                'ride_date' => '2026-07-26',
                'ride_time' => '09:30 AM',
                'is_round_trip' => true,
                'wheelchair_needed' => true,
                'oxygen_needed' => true,
                'additional_notes' => 'Requires companion seat.',
                'payment_method' => 'Insurance / Medicaid',
                'estimated_cost' => 85,
                'status' => 'IN_TRANSIT',
                'bambi_dispatch_ref' => 'Marcus Miller (Van 104)',
            ],
            [
                'booking_number' => 'CL-9022',
                'passenger_name' => 'Robert Sterling',
                'phone' => '(707) 555-0844',
                'email' => 'rsterling@example.com',
                'service_type' => 'Transit Shuttle',
                'pickup_address' => '885 Redwood Way, Arcata, CA',
                'pickup_county' => 'Humboldt',
                'destination_address' => 'Mad River Community Hospital, Arcata, CA',
                'destination_county' => 'Humboldt',
                'ride_date' => '2026-07-26',
                'ride_time' => '11:00 AM',
                'is_round_trip' => false,
                'wheelchair_needed' => false,
                'oxygen_needed' => false,
                'additional_notes' => 'Requires multi-passenger shuttle for group therapy session.',
                'payment_method' => 'Facility Billing',
                'estimated_cost' => 120,
                'status' => 'BAMBI_DISPATCHED',
                'bambi_dispatch_ref' => 'Sarah Jenkins (Shuttle Unit 08)',
            ],
            [
                'booking_number' => 'CL-9023',
                'passenger_name' => 'Maria Rodriguez',
                'phone' => '(707) 555-3311',
                'email' => 'm.rodriguez@example.com',
                'service_type' => 'Ambulatory Sedan',
                'pickup_address' => '310 5th Street, Eureka, CA',
                'pickup_county' => 'Humboldt',
                'destination_address' => 'Open Door Community Health Center, Fortuna, CA',
                'destination_county' => 'Humboldt',
                'ride_date' => '2026-07-26',
                'ride_time' => '02:15 PM',
                'is_round_trip' => true,
                'wheelchair_needed' => false,
                'oxygen_needed' => false,
                'additional_notes' => 'Bilingual driver preferred.',
                'payment_method' => 'Private Pay Cash',
                'estimated_cost' => 65,
                'status' => 'PENDING_DISPATCH',
                'bambi_dispatch_ref' => null,
            ],
        ];

        foreach ($bookings as $booking) {
            RideBooking::updateOrCreate(['booking_number' => $booking['booking_number']], $booking);
        }
    }
}
