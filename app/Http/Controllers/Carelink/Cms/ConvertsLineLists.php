<?php

namespace App\Http\Controllers\Carelink\Cms;

/**
 * Shared helpers for the admin collection CRUDs: the frontend submits
 * array-valued fields (benefits, features, certifications, ...) as
 * newline-separated textareas, and these converters rebuild the arrays.
 */
trait ConvertsLineLists
{
    /**
     * @return array<int, string>
     */
    protected function linesList(string $text): array
    {
        return collect(explode("\n", $text))
            ->map(fn (string $line): string => trim($line))
            ->filter()
            ->values()
            ->all();
    }
}
