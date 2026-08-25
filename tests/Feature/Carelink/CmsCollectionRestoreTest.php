<?php

use App\Cms\CollectionDefinitions;
use App\Models\BlogPost;
use App\Models\ContentSection;
use App\Models\Faq;
use App\Models\FleetVehicle;
use App\Models\Service;
use App\Models\TeamMember;
use App\Models\User;
use Database\Seeders\CarelinkContentSeeder;
use Illuminate\Database\Eloquent\Model;
use Inertia\Testing\AssertableInertia;

beforeEach(function () {
    $this->seed(CarelinkContentSeeder::class);
});

dataset('cms collections', [
    'services' => [Service::class, 'cms.services.restore', 'slug', 'custom-service', 'wheelchair-transport'],
    'fleet' => [FleetVehicle::class, 'cms.fleet.restore', 'name', 'Custom Vehicle', 'Carelink Transporter Max (Wheelchair Van)'],
    'team' => [TeamMember::class, 'cms.team.restore', 'name', 'Custom Member', 'Abel Feyisa'],
    'faqs' => [Faq::class, 'cms.faqs.restore', 'question', 'Custom question?', 'How do I book a non-emergency medical ride with Carelink?'],
    'blog' => [BlogPost::class, 'cms.blog.restore', 'slug', 'custom-post', 'understanding-nemt-northern-california'],
]);

/**
 * @param  class-string<Model>  $model
 */
test('collections can be restored to their defaults', function (string $model, string $route, string $uniqueKey, string $customValue, string $defaultMatch) {
    $admin = User::factory()->admin()->create();

    $default = $model::first();

    $custom = collect($default->getAttributes())
        ->except(['id', 'created_at', 'updated_at', $uniqueKey])
        ->all();

    $model::create([...$custom, $uniqueKey => $customValue]);

    expect($model::where($uniqueKey, $customValue)->exists())->toBeTrue();

    $this->actingAs($admin)->post(route($route))->assertRedirect();

    expect($model::where($uniqueKey, $customValue)->exists())->toBeFalse()
        ->and($model::where($uniqueKey, $defaultMatch)->exists())->toBeTrue();
})->with('cms collections');

test('collections restore to exactly the default row count', function () {
    $admin = User::factory()->admin()->create();

    $this->actingAs($admin)->post(route('cms.services.restore'))->assertRedirect();

    expect(Service::count())->toBe(count(CollectionDefinitions::all()['services']));
});

test('any authenticated user can restore a collection', function () {
    $user = User::factory()->admin()->create();

    $this->actingAs($user)->post(route('cms.faqs.restore'))->assertRedirect();

    expect(Faq::count())->toBe(count(CollectionDefinitions::all()['faqs']));
});

test('restore-all resets sections and every collection', function () {
    $admin = User::factory()->admin()->create();

    $default = Service::first();

    Service::create([
        ...collect($default->getAttributes())
            ->except(['id', 'created_at', 'updated_at', 'slug'])
            ->all(),
        'slug' => 'custom-service',
    ]);

    $this->actingAs($admin)->post(route('cms.sections.restore-all'))->assertRedirect();

    expect(ContentSection::count())->toBe(0)
        ->and(Service::where('slug', 'custom-service')->exists())->toBeFalse()
        ->and(Service::count())->toBe(count(CollectionDefinitions::all()['services']))
        ->and(FleetVehicle::count())->toBe(count(CollectionDefinitions::all()['fleet']))
        ->and(TeamMember::count())->toBe(count(CollectionDefinitions::all()['team']))
        ->and(Faq::count())->toBe(count(CollectionDefinitions::all()['faqs']))
        ->and(BlogPost::count())->toBe(count(CollectionDefinitions::all()['blog']));

    $this->get(route('cms.index'))
        ->assertOk()
        ->assertInertia(fn (AssertableInertia $page) => $page
            ->component('cms/sections')
            ->has('flash.toast'));
});
