<?php

use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

test('admins can upload an image and receive its public URL', function () {
    Storage::fake('public');

    $admin = User::factory()->admin()->create();

    $response = $this->actingAs($admin)->post(route('cms.images.store'), [
        'image' => UploadedFile::fake()->image('logo.png', 200, 100),
    ]);

    $response->assertOk()->assertJsonStructure(['url']);

    expect(str_starts_with($response->json('url'), '/storage/cms/'))->toBeTrue();

    Storage::disk('public')->assertExists('cms/'.basename($response->json('url')));
});

test('non-admin users cannot upload images', function () {
    Storage::fake('public');

    $user = User::factory()->create();

    $this->actingAs($user)
        ->post(route('cms.images.store'), [
            'image' => UploadedFile::fake()->image('logo.png', 200, 100),
        ])
        ->assertForbidden();

    expect(Storage::disk('public')->allFiles('cms'))->toBeEmpty();
});

test('guests are redirected from the image upload endpoint', function () {
    $this->post(route('cms.images.store'), [
        'image' => UploadedFile::fake()->image('logo.png', 200, 100),
    ])->assertRedirect(route('login'));
});

test('non-image files are rejected', function () {
    Storage::fake('public');

    $admin = User::factory()->admin()->create();

    $this->actingAs($admin)
        ->post(route('cms.images.store'), [
            'image' => UploadedFile::fake()->create('script.txt', 100),
        ])
        ->assertSessionHasErrors('image');
});
