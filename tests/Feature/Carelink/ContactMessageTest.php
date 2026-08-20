<?php

use App\Models\ContactMessage;
use App\Models\User;

test('a visitor can submit a contact form message', function () {
    $this->post(route('contact.store'), [
        'name' => 'Jane Smith',
        'email' => 'jane@example.com',
        'phone' => '+1 707-555-0192',
        'message' => 'Do you transport wheelchair passengers to dialysis in Fortuna?',
    ])->assertRedirect();

    $message = ContactMessage::first();

    expect($message)
        ->not->toBeNull()
        ->name->toBe('Jane Smith')
        ->email->toBe('jane@example.com')
        ->phone->toBe('+1 707-555-0192')
        ->message->toContain('dialysis')
        ->status->toBe(ContactMessage::STATUS_PENDING);
});

test('a contact form message can be submitted without a phone number', function () {
    $this->post(route('contact.store'), [
        'name' => 'John Doe',
        'email' => 'john@example.com',
        'phone' => null,
        'message' => 'Hello, I have a question about booking.',
    ])->assertRedirect();

    $this->assertDatabaseHas('contact_messages', [
        'name' => 'John Doe',
        'phone' => null,
    ]);
});

test('the contact form validates required fields', function () {
    $this->post(route('contact.store'), [])
        ->assertSessionHasErrors(['name', 'email', 'message']);

    $this->assertDatabaseCount('contact_messages', 0);
});

test('guests are redirected from the contact messages dashboard', function () {
    $this->get(route('dashboard.contact-messages'))
        ->assertRedirect(route('login'));
});

test('authenticated users can view contact messages', function () {
    $user = User::factory()->create();
    ContactMessage::factory()->create([
        'name' => 'Jane Smith',
    ]);

    $this->actingAs($user)
        ->get(route('dashboard.contact-messages'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('dashboard/contact-messages')
            ->has('messages.data', 1)
            ->where('messages.data.0.name', 'Jane Smith'));
});

test('contact messages are listed newest first and default to pending', function () {
    $user = User::factory()->create();

    $newer = ContactMessage::factory()->create(['name' => 'Newer Message']);
    $newer->forceFill(['created_at' => now()->subDay()])->save();

    $older = ContactMessage::factory()->create(['name' => 'Older Message']);
    $older->forceFill(['created_at' => now()->subDays(4)])->save();

    ContactMessage::factory()->read()->create(['name' => 'Already Read']);

    $this->actingAs($user)
        ->get(route('dashboard.contact-messages'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('messages.data', 2)
            ->where('messages.data.0.name', 'Newer Message')
            ->where('messages.data.1.name', 'Older Message'));

    $this->actingAs($user)
        ->get(route('dashboard.contact-messages', ['status' => '__all']))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->has('messages.data', 3));
});

test('a contact message can be marked as read', function () {
    $user = User::factory()->create();
    $message = ContactMessage::factory()->create();

    $this->actingAs($user)
        ->post(route('dashboard.contact-messages.read', $message))
        ->assertRedirect();

    expect($message->fresh())
        ->status->toBe(ContactMessage::STATUS_READ)
        ->read_at->not->toBeNull();
});

test('a contact message can be deleted', function () {
    $user = User::factory()->create();
    $message = ContactMessage::factory()->create();

    $this->actingAs($user)
        ->delete(route('dashboard.contact-messages.destroy', $message))
        ->assertRedirect();

    $this->assertDatabaseMissing('contact_messages', ['id' => $message->id]);
});

test('contact messages can be searched by name, email, or message', function () {
    $user = User::factory()->create();
    ContactMessage::factory()->create([
        'name' => 'Unique Name',
        'email' => 'unique@example.com',
        'message' => 'Unique topic about dialysis scheduling',
    ]);
    ContactMessage::factory()->create([
        'name' => 'Another Person',
    ]);

    $this->actingAs($user)
        ->get(route('dashboard.contact-messages', ['search' => 'dialysis']))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('messages.data', 1)
            ->where('messages.data.0.name', 'Unique Name'));
});
