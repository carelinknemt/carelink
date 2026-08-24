<?php

use App\Models\BlogPost;
use App\Models\Faq;
use App\Models\FleetVehicle;
use App\Models\TeamMember;
use App\Models\User;
use Database\Seeders\CmsContentSeeder;

test('guests are redirected from the CMS editor', function () {
    $this->get(route('cms.index'))->assertRedirect(route('login'));

    $this->put(route('cms.sections.update', 'company_info'), [
        'name' => 'Hacked',
    ])->assertRedirect(route('login'));
});

test('guests are redirected from every collection page', function (string $route) {
    $this->get(route($route))->assertRedirect(route('login'));
})->with([
    'services' => ['cms.services.index'],
    'fleet' => ['cms.fleet.index'],
    'faqs' => ['cms.faqs.index'],
    'team' => ['cms.team.index'],
    'blog' => ['cms.blog.index'],
]);

test('guests cannot modify collections', function () {
    $vehicle = FleetVehicle::factory()->create();
    $member = TeamMember::factory()->create();
    $faq = Faq::factory()->create();
    $post = BlogPost::factory()->create();

    $this->post(route('cms.fleet.store'), ['name' => 'Sneaky Van'])
        ->assertRedirect(route('login'));

    $this->put(route('cms.fleet.update', $vehicle), ['name' => 'Hacked Van'])
        ->assertRedirect(route('login'));

    $this->delete(route('cms.fleet.destroy', $vehicle))
        ->assertRedirect(route('login'));

    $this->put(route('cms.team.update', $member), ['name' => 'Hacked Member'])
        ->assertRedirect(route('login'));

    $this->delete(route('cms.team.destroy', $member))
        ->assertRedirect(route('login'));

    $this->put(route('cms.faqs.update', $faq), ['question' => 'Hacked?', 'answer' => 'Hacked.'])
        ->assertRedirect(route('login'));

    $this->delete(route('cms.faqs.destroy', $faq))
        ->assertRedirect(route('login'));

    $this->put(route('cms.blog.update', $post), ['title' => 'Hacked Post', 'slug' => 'hacked-post'])
        ->assertRedirect(route('login'));

    $this->delete(route('cms.blog.destroy', $post))
        ->assertRedirect(route('login'));
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
            ->has('sections', 11)
            ->where('sections.0.slug', 'company_info')
        );
});
