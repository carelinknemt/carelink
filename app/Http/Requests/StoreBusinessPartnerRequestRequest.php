<?php

namespace App\Http\Requests;

use App\Models\BusinessPartnerRequest;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreBusinessPartnerRequestRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, array<int, mixed>>
     */
    public function rules(): array
    {
        return [
            'company_name' => ['required', 'string', 'max:255'],
            'contact_name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'phone' => ['required', 'string', 'max:32'],
            'business_type' => ['required', Rule::in(BusinessPartnerRequest::BUSINESS_TYPES)],
            'estimated_monthly_trips' => ['nullable', 'integer', 'min:0', 'max:100000'],
            'message' => ['nullable', 'string', 'max:5000'],
        ];
    }
}
