<?php

use App\Models\BusinessPartnerRequest;

test('the business partnership page renders with organization types', function () {
    $this->get(route('business'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('business')
            ->where('business_types', BusinessPartnerRequest::BUSINESS_TYPES));
});

test('a business inquiry can be submitted', function () {
    $this->post(route('business.store'), [
        'company_name' => 'Acme Medical Center',
        'contact_name' => 'Jane Doe',
        'email' => 'jane@acmemedical.org',
        'phone' => '+1 707-555-0192',
        'business_type' => 'Hospital / Clinic',
        'estimated_monthly_trips' => 120,
        'message' => 'We need reliable wheelchair transportation for our dialysis patients.',
    ])->assertRedirect();

    $inquiry = BusinessPartnerRequest::first();

    expect($inquiry)
        ->not->toBeNull()
        ->company_name->toBe('Acme Medical Center')
        ->contact_name->toBe('Jane Doe')
        ->email->toBe('jane@acmemedical.org')
        ->phone->toBe('+1 707-555-0192')
        ->business_type->toBe('Hospital / Clinic')
        ->estimated_monthly_trips->toBe(120)
        ->message->toContain('dialysis patients');
});

test('a business inquiry can be submitted without optional fields', function () {
    $this->post(route('business.store'), [
        'company_name' => 'Humboldt Care Home',
        'contact_name' => 'John Smith',
        'email' => 'john@carehome.org',
        'phone' => '(707) 555-0100',
        'business_type' => 'Healthcare Facility',
    ])->assertRedirect();

    $this->assertDatabaseHas('business_partner_requests', [
        'company_name' => 'Humboldt Care Home',
        'estimated_monthly_trips' => null,
        'message' => null,
    ]);
});

test('the business partnership form validates required fields', function () {
    $this->post(route('business.store'), [])
        ->assertSessionHasErrors([
            'company_name',
            'contact_name',
            'email',
            'phone',
            'business_type',
        ]);

    $this->assertDatabaseCount('business_partner_requests', 0);
});

test('an inquiry cannot reference an unknown organization type', function () {
    $this->post(route('business.store'), [
        'company_name' => 'Acme Medical Center',
        'contact_name' => 'Jane Doe',
        'email' => 'jane@acmemedical.org',
        'phone' => '+1 707-555-0192',
        'business_type' => 'Not A Real Type',
    ])->assertSessionHasErrors(['business_type']);

    $this->assertDatabaseCount('business_partner_requests', 0);
});
