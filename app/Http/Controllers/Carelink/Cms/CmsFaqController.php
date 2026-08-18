<?php

namespace App\Http\Controllers\Carelink\Cms;

use App\Cms\ResetsCmsContent;
use App\Http\Controllers\Controller;
use App\Models\Faq;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CmsFaqController extends Controller
{
    /**
     * Admin-only FAQ management: the questions behind the public FAQ page.
     */
    public function index(Request $request): Response
    {

        $faqs = Faq::query()->ordered()->get()->map(fn (Faq $faq): array => $this->summary($faq));

        return Inertia::render('cms/faqs', [
            'faqs' => $faqs,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {

        $validated = $request->validate($this->rules());

        Faq::create($this->values($validated));

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'The FAQ was added.',
        ]);

        return back();
    }

    public function update(Request $request, Faq $faq): RedirectResponse
    {

        $validated = $request->validate($this->rules());

        $faq->update($this->values($validated));

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'The FAQ was updated.',
        ]);

        return back();
    }

    public function destroy(Request $request, Faq $faq): RedirectResponse
    {

        $faq->delete();

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'The FAQ was deleted.',
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

        (new ResetsCmsContent)->resetCollection('faqs');

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'FAQs were reset to their defaults.',
        ]);

        return back();
    }

    private function rules(): array
    {
        return [
            'question' => ['required', 'string', 'max:20000'],
            'answer' => ['required', 'string', 'max:20000'],
            'category' => ['nullable', 'string', 'max:255'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
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

        return $validated;
    }

    /**
     * @return array<string, mixed>
     */
    private function summary(Faq $faq): array
    {
        return [
            'id' => $faq->id,
            'question' => $faq->question,
            'answer' => $faq->answer,
            'category' => $faq->category,
            'sort_order' => $faq->sort_order,
            'active' => $faq->active,
        ];
    }
}
