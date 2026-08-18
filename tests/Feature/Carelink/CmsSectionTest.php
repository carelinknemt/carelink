<?php

use App\Cms\BookingFee;
use App\Models\ContentSection;
use App\Models\User;
use Database\Seeders\CmsContentSeeder;

beforeEach(function () {
    $this->seed(CmsContentSeeder::class);
});

test('admins can update a text section', function () {
    $admin = User::factory()->admin()->create();

    $this->actingAs($admin)->put(route('cms.sections.update', 'company_info'), [
        'name' => 'CareLink Medical Transportation LLC',
        'logo_url' => '/images/cllogo.png',
        'tagline' => 'New tagline',
        'headquarters' => 'Eureka, California',
        'phone' => '(707) 854-9350',
        'email' => 'dispatch@carelinknemt.com',
        'dispatch_phone' => '(707) 854-9350',
        'address' => '3857 Walnut Drive, Suite B, Eureka, CA 95503',
        'service_region' => 'Northern California Region',
        'counties' => ['Humboldt', 'Del Norte', 'Trinity', 'Shasta'],
        'home_description' => 'Home description',
        'about_description' => 'About description',
    ])->assertRedirect();

    $section = ContentSection::where('slug', 'company_info')->first();

    expect($section)
        ->content->toBeArray()
        ->content->tagline->toBe('New tagline');

    $this->assertDatabaseHas('content_sections', [
        'slug' => 'company_info',
    ]);
});

test('admins can change the booking fee and BookingFee reflects it', function () {
    expect(BookingFee::amountInCents())->toBe(3000);

    $admin = User::factory()->admin()->create();

    $this->actingAs($admin)->put(route('cms.sections.update', 'booking_fee_settings'), [
        'fee_amount_cents' => '4500',
        'label' => 'CareLink Booking Fee',
    ])->assertRedirect();

    expect(BookingFee::amountInCents())->toBe(4500);
    expect(BookingFee::amountInDollars())->toBe('45.00');
});

test('list fields are trimmed and empty lines dropped', function () {
    $admin = User::factory()->admin()->create();

    $this->actingAs($admin)->put(route('cms.sections.update', 'company_info'), [
        'name' => 'CareLink Medical Transportation LLC',
        'logo_url' => '/images/cllogo.png',
        'tagline' => 'Tagline',
        'headquarters' => 'Eureka, California',
        'phone' => '(707) 854-9350',
        'email' => 'dispatch@carelinknemt.com',
        'dispatch_phone' => '(707) 854-9350',
        'address' => '3857 Walnut Drive, Suite B, Eureka, CA 95503',
        'service_region' => 'Northern California Region',
        'counties' => ['Humboldt', '  ', 'Trinity', 'Shasta'],
    ])->assertRedirect();

    expect(ContentSection::where('slug', 'company_info')->first())
        ->content->counties->toBe(['Humboldt', 'Trinity', 'Shasta']);
});

test('invalid values are rejected with validation errors', function () {
    $admin = User::factory()->admin()->create();

    $this->actingAs($admin)
        ->put(route('cms.sections.update', 'booking_fee_settings'), [
            'fee_amount_cents' => 'not-a-number',
            'label' => 'CareLink Booking Fee',
        ])
        ->assertSessionHasErrors('fee_amount_cents');

    expect(BookingFee::amountInCents())->toBe(3000);
});

test('unknown sections return 404', function () {
    $admin = User::factory()->admin()->create();

    $this->actingAs($admin)
        ->put(route('cms.sections.update', 'does-not-exist'), [
            'name' => 'Anything',
        ])
        ->assertNotFound();
});
