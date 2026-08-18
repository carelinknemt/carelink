<?php

use App\Models\User;
use Database\Seeders\CmsContentSeeder;

test('guests are redirected from the CMS editor', function () {
    $this->get(route('cms.index'))->assertRedirect(route('login'));

    $this->put(route('cms.sections.update', 'company_info'), [
        'name' => 'Hacked',
    ])->assertRedirect(route('login'));
});

test('any authenticated user can access the CMS editor', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get(route('cms.index'))
        ->assertOk();

    $this->actingAs($user)
        ->put(route('cms.sections.update', 'company_info'), ['name' => 'Hacked'])
        ->assertRedirect();

    $this->actingAs($user)
        ->post(route('cms.services.store'), ['title' => 'Handicap Van'])
        ->assertRedirect();
});

test('admins can open the CMS section editor', function () {
    $this->seed(CmsContentSeeder::class);

    $admin = User::factory()->admin()->create();

    $this->actingAs($admin)
        ->get(route('cms.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('cms/sections')
            ->has('sections', 10)
            ->where('sections.0.slug', 'company_info')
        );
});
