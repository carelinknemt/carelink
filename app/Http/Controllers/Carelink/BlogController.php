<?php

namespace App\Http\Controllers\Carelink;

use App\Http\Controllers\Controller;
use App\Models\BlogPost;
use Inertia\Inertia;
use Inertia\Response;

class BlogController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('blog', [
            'posts' => BlogPost::published()->ordered()->get(),
        ]);
    }

    public function show(string $post): Response
    {
        $blogPost = BlogPost::published()
            ->where('slug', $post)
            ->firstOrFail();

        return Inertia::render('blog/show', [
            'post' => $blogPost,
            'recent_posts' => BlogPost::published()
                ->ordered()
                ->whereKeyNot($blogPost->getKey())
                ->limit(3)
                ->get(),
        ]);
    }
}
