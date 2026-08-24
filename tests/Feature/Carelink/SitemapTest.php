<?php

use App\Models\BlogPost;
use App\Models\TripRequest;

test('the sitemap lists every public page and published blog post', function () {
    $post = BlogPost::factory()->create();

    $response = $this->get(route('sitemap'));

    $response->assertOk();
    $response->assertHeader('Content-Type', 'application/xml; charset=UTF-8');

    $content = $response->getContent();

    expect($content)->toContain('<urlset')
        ->toContain('<loc>'.url('/').'</loc>')
        ->toContain('<loc>'.url('/services').'</loc>')
        ->toContain('<loc>'.url('/fleet').'</loc>')
        ->toContain('<loc>'.url('/faq').'</loc>')
        ->toContain('<loc>'.url('/careers').'</loc>')
        ->toContain('<loc>'.url('/for-businesses').'</loc>')
        ->toContain('<loc>'.route('blog.show', ['post' => $post->slug]).'</loc>');
});

test('the sitemap excludes unpublished blog posts', function () {
    BlogPost::factory()->create(['active' => false]);

    $content = $this->get(route('sitemap'))->getContent();

    expect($content)->not->toContain('blog/');
});

test('robots.txt points to the sitemap and allows crawling', function () {
    $content = $this->get(route('robots'))
        ->assertOk()
        ->assertHeader('Content-Type', 'text/plain; charset=UTF-8')
        ->getContent();

    expect($content)
        ->toContain('User-agent: *')
        ->toContain('Sitemap: '.route('sitemap'));
});

test('the booking tracking page sends a noindex header', function () {
    $tripRequest = TripRequest::factory()->create();

    $this->get(route('bookings.show', $tripRequest->booking_number))
        ->assertOk()
        ->assertHeader('X-Robots-Tag', 'noindex, nofollow');
});
