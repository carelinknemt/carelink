<?php

use App\Models\BlogPost;

test('a published blog post renders on its detail page', function () {
    $post = BlogPost::factory()->create([
        'content' => "First paragraph.\n\nSecond paragraph.\n\nThird paragraph.",
    ]);

    $this->get(route('blog.show', $post->slug))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('blog/show')
            ->where('post.slug', $post->slug)
            ->where('post.content', $post->content)
            ->has('recent_posts'));
});

test('the blog detail page shows a 404 for unknown slugs', function () {
    $this->get(route('blog.show', 'no-such-article'))
        ->assertNotFound();
});

test('draft blog posts are not reachable on their detail page', function () {
    $draft = BlogPost::factory()->create([
        'active' => false,
        'published_at' => null,
    ]);

    $this->get(route('blog.show', $draft->slug))
        ->assertNotFound();
});

test('the blog detail page lists recent published posts', function () {
    $featured = BlogPost::factory()->create(['title' => 'Featured Article']);
    $relevant = BlogPost::factory()->create(['title' => 'Relevant Recent Post']);
    BlogPost::factory()->create(['active' => false, 'published_at' => null]);

    $this->get(route('blog.show', $featured->slug))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->where('recent_posts.0.title', $relevant->title)
            ->has('recent_posts', 1));
});
