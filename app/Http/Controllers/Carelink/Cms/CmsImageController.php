<?php

namespace App\Http\Controllers\Carelink\Cms;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class CmsImageController extends Controller
{
    /**
     * Admin-only image upload for CMS fields (logo, hero backgrounds,
     * payment method logos, avatars, and collection images). Returns the
     * public /storage URL for the stored file.
     */
    public function store(Request $request): JsonResponse
    {
        abort_unless($request->user()->is_admin, 403);

        $validated = $request->validate([
            'image' => ['required', 'image', 'max:4096'],
        ]);

        $path = $validated['image']->store('cms', 'public');

        return response()->json([
            'url' => Storage::disk('public')->url($path),
        ]);
    }
}
