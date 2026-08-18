<?php

namespace App\Http\Controllers\Carelink\Cms;

use App\Cms\ResetsCmsContent;
use App\Http\Controllers\Controller;
use App\Models\BlogPost;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CmsBlogPostController extends Controller
{
    /**
     * Admin-only blog management: the posts behind the public blog pages.
     */
    public function index(Request $request): Response
    {

        $posts = BlogPost::query()->ordered()->get()->map(fn (BlogPost $post): array => $this->summary($post));

        return Inertia::render('cms/blog', [
            'posts' => $posts,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {

        $validated = $request->validate($this->rules());

        $post = BlogPost::create($this->values($validated));

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => "{$post->title} was added.",
        ]);

        return back();
    }

    public function update(Request $request, BlogPost $post): RedirectResponse
    {

        $validated = $request->validate($this->rules());

        $post->update($this->values($validated));

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => "{$post->title} was updated.",
        ]);

        return back();
    }

    public function destroy(Request $request, BlogPost $post): RedirectResponse
    {

        $title = $post->title;
        $post->delete();

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => "{$title} was deleted.",
        ]);

        return back();
    }

    /**
     * @return array<string, array<int, mixed>>
     */
    /**
     * Replace every row with the CollectionDefinitions defaults.
     */
    public function restore(Request $request): RedirectResponse
    {

        (new ResetsCmsContent)->resetCollection('blog');

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Blog posts were reset to their defaults.',
        ]);

        return back();
    }

    private function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255'],
            'category' => ['nullable', 'string', 'max:255'],
            'read_time' => ['nullable', 'string', 'max:255'],
            'summary' => ['nullable', 'string', 'max:20000'],
            'excerpt' => ['nullable', 'string', 'max:20000'],
            'content' => ['nullable', 'string', 'max:20000'],
            'author' => ['nullable', 'string', 'max:255'],
            'image' => ['nullable', 'string', 'max:1000'],
            'published_at' => ['nullable', 'date'],
            'active' => ['nullable', 'boolean'],
        ];
    }

    /**
     * @param  array<string, mixed>  $validated
     * @return array<string, mixed>
     */
    private function values(array $validated): array
    {
        $validated['category'] = $validated['category'] ?? '';
        $validated['read_time'] = $validated['read_time'] ?? '';
        $validated['summary'] = $validated['summary'] ?? '';
        $validated['content'] = $validated['content'] ?? '';
        $validated['author'] = $validated['author'] ?? '';
        $validated['image'] = $validated['image'] ?? '';
        $validated['active'] = (bool) ($validated['active'] ?? false);

        return $validated;
    }

    /**
     * @return array<string, mixed>
     */
    private function summary(BlogPost $post): array
    {
        return [
            'id' => $post->id,
            'title' => $post->title,
            'slug' => $post->slug,
            'category' => $post->category,
            'read_time' => $post->read_time,
            'summary' => $post->summary,
            'excerpt' => $post->excerpt,
            'content' => $post->content,
            'author' => $post->author,
            'image' => $post->image,
            'published_at' => $post->getRawOriginal('published_at'),
            'active' => $post->active,
        ];
    }
}
