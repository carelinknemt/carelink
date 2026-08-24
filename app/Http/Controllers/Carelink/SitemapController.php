<?php

namespace App\Http\Controllers\Carelink;

use App\Http\Controllers\Controller;
use App\Models\BlogPost;
use Illuminate\Http\Response;

class SitemapController extends Controller
{
    /**
     * Static public pages included in the sitemap, mapped to their route names.
     *
     * @var array<string, string>
     */
    private const STATIC_PAGES = [
        'home' => '1.0',
        'services' => '0.9',
        'about' => '0.8',
        'fleet' => '0.7',
        'faq' => '0.7',
        'blog' => '0.8',
        'careers' => '0.6',
        'book' => '0.9',
        'business' => '0.6',
        'terms' => '0.3',
        'privacy' => '0.3',
    ];

    /**
     * Return an XML sitemap of every indexable public URL.
     */
    public function __invoke(): Response
    {
        $urls = [];

        foreach (self::STATIC_PAGES as $route => $priority) {
            $urls[] = [
                'loc' => route($route),
                'lastmod' => null,
                'priority' => $priority,
            ];
        }

        BlogPost::published()
            ->orderByDesc('published_at')
            ->get(['slug', 'updated_at'])
            ->each(function (BlogPost $post) use (&$urls): void {
                $urls[] = [
                    'loc' => route('blog.show', ['post' => $post->slug]),
                    'lastmod' => $post->updated_at?->toAtomString(),
                    'priority' => '0.6',
                ];
            });

        return response()
            ->view('sitemap', ['urls' => $urls])
            ->header('Content-Type', 'application/xml; charset=UTF-8');
    }
}
