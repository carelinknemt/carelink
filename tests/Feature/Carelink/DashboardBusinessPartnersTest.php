<?php

use App\Mail\BusinessPartnerApproved;
use App\Mail\BusinessPartnerRejected;
use App\Models\BusinessPartnerRequest;
use App\Models\User;
use Illuminate\Support\Facades\Mail;

test('guests are redirected to the login page', function () {
    $this->get(route('dashboard.business-partners'))->assertRedirect(route('login'));
});

test('authenticated users can view the business inquiries page', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    BusinessPartnerRequest::factory()->create([
        'company_name' => 'Acme Medical Center',
    ]);

    $this->get(route('dashboard.business-partners'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('dashboard/business-partners')
            ->has('requests.data', 1)
            ->where('requests.data.0.company_name', 'Acme Medical Center'));
});

test('inquiries are listed newest first', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $older = BusinessPartnerRequest::factory()->create([
        'company_name' => 'Older Care Home',
    ]);
    $older->forceFill(['created_at' => now()->subDays(4)])->save();

    $newer = BusinessPartnerRequest::factory()->create([
        'company_name' => 'Newer Care Home',
    ]);
    $newer->forceFill(['created_at' => now()->subDay()])->save();

    $this->get(route('dashboard.business-partners'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->where('requests.data.0.company_name', 'Newer Care Home')
            ->where('requests.data.1.company_name', 'Older Care Home'));
});

test('inquiries can be searched by company, contact, email, or type', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    BusinessPartnerRequest::factory()->create(['company_name' => 'Acme Medical Center']);
    $zelda = BusinessPartnerRequest::factory()->create([
        'contact_name' => 'Zelda Harkness',
    ]);

    $this->get(route('dashboard.business-partners', ['search' => 'Acme']))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('requests.data', 1)
            ->where('requests.data.0.company_name', 'Acme Medical Center'));

    $this->get(route('dashboard.business-partners', ['search' => $zelda->email]))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('requests.data', 1)
            ->where('requests.data.0.contact_name', 'Zelda Harkness'));
});

test('inquiries are paginated', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    BusinessPartnerRequest::factory()->count(3)->create();

    $this->get(route('dashboard.business-partners', ['page' => 2]))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->where('requests.current_page', 2)
            ->where('requests.total', 3));
});

test('the dashboard lists pending inquiries by default', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $pending = BusinessPartnerRequest::factory()->create();
    BusinessPartnerRequest::factory()->create(['status' => BusinessPartnerRequest::STATUS_APPROVED]);
    BusinessPartnerRequest::factory()->create(['status' => BusinessPartnerRequest::STATUS_REJECTED]);

    $this->get(route('dashboard.business-partners'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('requests.data', 1)
            ->where('requests.data.0.id', $pending->id)
            ->where('filters.status', BusinessPartnerRequest::STATUS_PENDING));
});

test('inquiries can be filtered by status', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $approved = BusinessPartnerRequest::factory()->create(['status' => BusinessPartnerRequest::STATUS_APPROVED]);
    BusinessPartnerRequest::factory()->create();

    $this->get(route('dashboard.business-partners', [
        'status' => BusinessPartnerRequest::STATUS_APPROVED,
    ]))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('requests.data', 1)
            ->where('requests.data.0.id', $approved->id)
            ->where('filters.status', BusinessPartnerRequest::STATUS_APPROVED));
});

test('inquiries can be filtered by rejected status', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $rejected = BusinessPartnerRequest::factory()->create(['status' => BusinessPartnerRequest::STATUS_REJECTED]);
    BusinessPartnerRequest::factory()->create();

    $this->get(route('dashboard.business-partners', [
        'status' => BusinessPartnerRequest::STATUS_REJECTED,
    ]))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('requests.data', 1)
            ->where('requests.data.0.id', $rejected->id));
});

test('the all statuses filter reveals every inquiry', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    BusinessPartnerRequest::factory()->create();
    BusinessPartnerRequest::factory()->create(['status' => BusinessPartnerRequest::STATUS_APPROVED]);
    BusinessPartnerRequest::factory()->create(['status' => BusinessPartnerRequest::STATUS_REJECTED]);

    $this->get(route('dashboard.business-partners', [
        'status' => BusinessPartnerRequest::STATUS_FILTER_ALL,
    ]))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('requests.data', 3)
            ->where('filters.status', BusinessPartnerRequest::STATUS_FILTER_ALL));
});

test('a manager can approve an inquiry and the company is emailed at the entered address', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    Mail::fake();

    $inquiry = BusinessPartnerRequest::factory()->create([
        'company_name' => 'Acme Medical Center',
        'contact_name' => 'Jane Doe',
        'email' => 'registered@acmemedical.org',
    ]);

    $this->post(route('dashboard.business-partners.approve', $inquiry), [
        'email' => 'partnerships@acmemedical.org',
    ])->assertRedirect();

    expect($inquiry->fresh()->status)->toBe(BusinessPartnerRequest::STATUS_APPROVED);

    Mail::assertSent(BusinessPartnerApproved::class, function (BusinessPartnerApproved $mail): bool {
        return $mail->hasTo('partnerships@acmemedical.org')
            && $mail->companyName === 'Acme Medical Center'
            && $mail->contactName === 'Jane Doe';
    });
});

test('approving an inquiry requires a valid email', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    Mail::fake();

    $inquiry = BusinessPartnerRequest::factory()->create();

    $this->post(route('dashboard.business-partners.approve', $inquiry), [
        'email' => 'not-an-email',
    ])->assertSessionHasErrors('email');

    expect($inquiry->fresh()->status)->toBe(BusinessPartnerRequest::STATUS_PENDING);

    Mail::assertNotSent(BusinessPartnerApproved::class);
});

test('a manager can reject an inquiry and the reason is emailed to the registered address', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    Mail::fake();

    $inquiry = BusinessPartnerRequest::factory()->create([
        'company_name' => 'Acme Medical Center',
        'contact_name' => 'Jane Doe',
        'email' => 'registered@acmemedical.org',
    ]);

    $this->post(route('dashboard.business-partners.reject', $inquiry), [
        'reason' => 'Your service area is outside our coverage region.',
    ])->assertRedirect();

    expect($inquiry->fresh()->status)->toBe(BusinessPartnerRequest::STATUS_REJECTED);

    Mail::assertSent(BusinessPartnerRejected::class, function (BusinessPartnerRejected $mail): bool {
        return $mail->hasTo('registered@acmemedical.org')
            && $mail->reason === 'Your service area is outside our coverage region.'
            && $mail->companyName === 'Acme Medical Center';
    });
});

test('rejecting an inquiry requires a reason', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    Mail::fake();

    $inquiry = BusinessPartnerRequest::factory()->create();

    $this->post(route('dashboard.business-partners.reject', $inquiry), [
        'reason' => '',
    ])->assertSessionHasErrors('reason');

    expect($inquiry->fresh()->status)->toBe(BusinessPartnerRequest::STATUS_PENDING);

    Mail::assertNotSent(BusinessPartnerRejected::class);
});
