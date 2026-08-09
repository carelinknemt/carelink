<?php

namespace App\Http\Requests;

use App\Models\Service;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class UpdateServiceRatesRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->is_admin === true;
    }

    /**
     * @return array<string, array<int, mixed>>
     */
    public function rules(): array
    {
        return [
            'services' => ['required', 'array', 'min:1'],
            'services.*.id' => ['required', 'integer', 'distinct', Rule::exists('services', 'id')],
            'services.*.base_rate' => ['required', 'numeric', 'min:0', 'max:10000'],
            'services.*.mileage_rate' => ['required', 'numeric', 'min:0', 'max:100'],
        ];
    }

    public function after(): array
    {
        return [
            function (Validator $validator) {
                $ids = collect($this->input('services'))->pluck('id');
                $found = Service::whereIn('id', $ids)->count();
                if ($found !== $ids->unique()->count()) {
                    $validator->errors()->add('services', 'One or more services no longer exist.');
                }
            },
        ];
    }
}
