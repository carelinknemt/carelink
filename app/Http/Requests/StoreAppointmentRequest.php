<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreAppointmentRequest extends FormRequest
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
            'passenger_name' => ['required', 'string', 'max:255'],
            'phone' => ['required', 'string', 'max:32'],
            'email' => ['nullable', 'email', 'max:255'],
            'service_type' => ['required', 'string', Rule::in(['Ambulatory Sedan', 'Wheelchair Van', 'Gurney Stretcher', 'Transit Shuttle'])],
            'pickup_address' => ['required', 'string', 'max:255'],
            'pickup_county' => ['required', 'string', 'max:255'],
            'destination_address' => ['required', 'string', 'max:255'],
            'destination_county' => ['required', 'string', 'max:255'],
            'ride_date' => ['required', 'date', 'after_or_equal:today'],
            'ride_time' => ['required', 'string', 'max:32'],
            'is_round_trip' => ['sometimes', 'boolean'],
            'wheelchair_needed' => ['sometimes', 'boolean'],
            'oxygen_needed' => ['sometimes', 'boolean'],
            'additional_notes' => ['nullable', 'string', 'max:2000'],
            'payment_method' => ['required', 'string', Rule::in(['Insurance / Medicaid', 'Facility Billing', 'Credit Card (Stripe/Square)', 'Private Pay Cash'])],
            'estimated_cost' => ['nullable', 'numeric', 'min:0', 'max:10000'],
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'is_round_trip' => $this->boolean('is_round_trip'),
            'wheelchair_needed' => $this->boolean('wheelchair_needed'),
            'oxygen_needed' => $this->boolean('oxygen_needed'),
        ]);
    }
}
