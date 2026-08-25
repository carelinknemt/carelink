<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class StoreBlacklistRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, array<int, string>>
     */
    public function rules(): array
    {
        return [
            'email' => ['nullable', 'email:rfc,dns'],
            'phone' => ['nullable', 'string', 'regex:/^(?:\+1|1)?\s*(?:\(\d{3}\)|\d{3})[\s.-]?\d{3}[\s.-]?\d{4}$/'],
            'reason' => ['required', 'string', 'min:20', 'max:2000'],
        ];
    }

    protected function withValidator(Validator $validator): void
    {
        $validator->after(function ($validator): void {
            if (! $this->email && ! $this->phone) {
                $validator->errors()->add(
                    'email',
                    'At least one of email or phone is required.',
                );
            }
        });
    }
}
