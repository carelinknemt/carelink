<?php

use App\Cms\BookingFee;
use App\Cms\SectionDefinitions;
use App\Models\ContentSection;
use App\Models\User;
use Database\Seeders\CmsContentSeeder;
use Inertia\Testing\AssertableInertia;

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

test('admins can change the booking fees and BookingFee reflects them', function () {
    expect(BookingFee::amountInCents())->toBe(3000);
    expect(BookingFee::amountInCentsFor('ambulatory'))->toBe(2000);
    expect(BookingFee::amountInCentsFor('wheelchair'))->toBe(3000);

    $admin = User::factory()->admin()->create();

    $this->actingAs($admin)->put(route('cms.sections.update', 'booking_fee_settings'), [
        'fee_amount_cents' => '4500',
        'ambulatory_fee_amount_cents' => '2500',
        'label' => 'CareLink Booking Fee',
    ])->assertRedirect();

    expect(BookingFee::amountInCents())->toBe(4500);
    expect(BookingFee::amountInDollars())->toBe('45.00');
    expect(BookingFee::amountInCentsFor('ambulatory'))->toBe(2500);
    expect(BookingFee::amountInCentsFor('wheelchair'))->toBe(4500);
    expect(BookingFee::dollarsFor('ambulatory'))->toBe('$25.00');
    expect(BookingFee::dollarsFor('wheelchair'))->toBe('$45.00');
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

test('admins can restore a section back to its defaults', function () {
    $admin = User::factory()->admin()->create();

    $this->actingAs($admin)->put(route('cms.sections.update', 'company_info'), [
        'name' => 'CareLink Medical Transportation LLC',
        'logo_url' => '/images/cllogo.png',
        'tagline' => 'Custom tagline',
        'headquarters' => 'Eureka, California',
        'phone' => '(707) 854-9350',
        'email' => 'dispatch@carelinknemt.com',
        'dispatch_phone' => '(707) 854-9350',
        'address' => '3857 Walnut Drive, Suite B, Eureka, CA 95503',
        'service_region' => 'Northern California Region',
        'counties' => ['Humboldt'],
    ]);

    expect(ContentSection::where('slug', 'company_info')->first())
        ->content->tagline->toBe('Custom tagline');

    $this->actingAs($admin)
        ->post(route('cms.sections.restore', 'company_info'))
        ->assertRedirect();

    expect(ContentSection::where('slug', 'company_info')->exists())->toBeFalse();

    $this->get(route('cms.index'))
        ->assertOk()
        ->assertInertia(fn (AssertableInertia $page) => $page
            ->component('cms/sections')
            ->has('flash.toast')
            ->where(
                'cms.company_info.tagline',
                SectionDefinitions::all()['company_info']['defaults']['tagline'],
            ));
});

test('restoring a section is gated to admins', function () {
    $this->seed(CmsContentSeeder::class);

    $user = User::factory()->create();

    $this->actingAs($user)
        ->post(route('cms.sections.restore', 'company_info'))
        ->assertForbidden();

    expect(ContentSection::where('slug', 'company_info')->exists())->toBeTrue();
});

test('restoring an unknown section returns 404', function () {
    $admin = User::factory()->admin()->create();

    $this->actingAs($admin)
        ->post(route('cms.sections.restore', 'does-not-exist'))
        ->assertNotFound();
});

test('admins can restore all content at once', function () {
    $admin = User::factory()->admin()->create();

    $this->actingAs($admin)->post(route('cms.sections.restore-all'))
        ->assertRedirect();

    expect(ContentSection::count())->toBe(0);

    $this->get(route('cms.index'))
        ->assertOk()
        ->assertInertia(fn (AssertableInertia $page) => $page
            ->component('cms/sections')
            ->has('flash.toast'));
});

test('restoring all content is gated to admins', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post(route('cms.sections.restore-all'))
        ->assertForbidden();

    expect(ContentSection::count())->toBeGreaterThan(0);
});
