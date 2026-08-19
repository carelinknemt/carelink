<?php

use App\Models\User;

test('guests are redirected from the knowledge base', function () {
    $this->get(route('kms'))->assertRedirect(route('login'));
});

test('authenticated users can open the knowledge base', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get(route('kms'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('kms'));
});
