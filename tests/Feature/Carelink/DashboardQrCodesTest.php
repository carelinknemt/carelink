<?php

use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('QR codes page is visible to admins', function () {
    $admin = User::factory()->admin()->create();

    $this->actingAs($admin);

    $this->get(route('dashboard.qr-codes'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page->component('dashboard/qr-codes'));
});

test('QR codes page is not visible to guests', function () {
    $this->get(route('dashboard.qr-codes'))->assertRedirect(route('login'));
});

test('QR codes page is not visible to managers', function () {
    $manager = User::factory()->manager()->create();

    $this->actingAs($manager)->get(route('dashboard.qr-codes'))->assertRedirect();
});

test('QR codes page is not visible to dispatchers', function () {
    $dispatcher = User::factory()->dispatcher()->create();

    $this->actingAs($dispatcher)->get(route('dashboard.qr-codes'))->assertRedirect();
});

test('QR codes page is not visible to drivers', function () {
    $driver = User::factory()->driver()->create();

    $this->actingAs($driver)->get(route('dashboard.qr-codes'))->assertRedirect();
});
