<?php

namespace App\Http\Requests;

use App\Models\TripRequest;
use Closure;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Carbon;
use Illuminate\Validation\Rule;

class StoreTripRequestRequest extends FormRequest
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
            'passenger_first_name' => ['required', 'string', 'max:255'],
            'passenger_last_name' => ['required', 'string', 'max:255'],
            'payer' => ['required', 'string', Rule::in(['Private Pay'])],
            'transport_type' => ['required', 'string', Rule::in(['ambulatory', 'wheelchair', 'wheelchair xl', 'broda chair', 'geri chair'])],
            'service_type' => ['required', 'string', Rule::in(['curb-to-curb', 'door-to-door', 'door-through-door', 'person-to-person'])],
            'will_call' => ['sometimes', 'boolean'],
            'trip_date' => ['required', 'date', 'after_or_equal:today'],
            'input_price' => ['nullable', 'numeric', 'min:0', 'max:100000'],
            'pickup_address' => ['required', 'string', 'max:255'],
            'pickup_time' => ['required', 'string', 'max:32', function (string $attribute, mixed $value, Closure $fail): void {
                if ($this->isWithinTwelveHours((string) $value)) {
                    $fail('Please call dispatch (707) 854-9350 for last minute ride request.');
                }
            }],
            'dropoff_address' => ['required', 'string', 'max:255'],
            'passenger_phone_number' => ['required', 'string', 'regex:/^(?:\+1|1)?\s*(?:\(\d{3}\)|\d{3})[\s.-]?\d{3}[\s.-]?\d{4}$/'],
            'passenger_email' => ['required', 'email', 'max:255'],
            'passenger_dob' => ['nullable', 'date', 'before:today'],
            'passenger_gender' => ['nullable', 'string', 'max:32'],
            'passenger_weight' => ['nullable', 'numeric', 'min:0', 'max:2000'],
            'passenger_is_bariatric' => ['sometimes', 'boolean'],
            'passenger_notes' => ['nullable', 'string', 'max:5000'],
            'attendants_needed' => ['nullable', 'integer', 'min:0', 'max:20'],
            'additional_passengers' => ['nullable', 'integer', 'min:0', 'max:50'],
            'oxygen_required' => ['sometimes', 'boolean'],
            'oxygen_liters_per_min' => ['nullable', 'integer', 'min:1', 'max:100'],
            'requested_by_name' => ['nullable', 'string', 'max:255'],
            'requested_by_phone_number' => ['nullable', 'string', 'max:32'],
            'dispatcher_notes' => ['nullable', 'string', 'max:5000'],
            'pickup_address_details' => ['nullable', 'string', 'max:255'],
            'pickup_stairs' => ['sometimes', 'integer', 'min:0', 'max:999'],
            'pickup_stair_equipment' => ['nullable', 'string', 'max:255'],
            'pickup_driver_notes' => ['nullable', 'string', 'max:5000'],
            'pickup_contact_name' => ['nullable', 'string', 'max:255'],
            'pickup_contact_phone_number' => ['nullable', 'string', 'max:32'],
            'load_time' => ['nullable', 'string', 'max:32'],
            'dropoff_address_details' => ['nullable', 'string', 'max:255'],
            'appointment_time' => ['nullable', 'string', 'max:32'],
            'dropoff_stairs' => ['sometimes', 'integer', 'min:0', 'max:999'],
            'dropoff_stair_equipment' => ['nullable', 'string', 'max:255'],
            'dropoff_driver_notes' => ['nullable', 'string', 'max:5000'],
            'dropoff_contact_name' => ['nullable', 'string', 'max:255'],
            'dropoff_contact_phone_number' => ['nullable', 'string', 'max:32'],
            'unload_time' => ['nullable', 'string', 'max:32'],
            'pickup_latitude' => ['nullable', 'numeric', 'between:-90,90'],
            'pickup_longitude' => ['nullable', 'numeric', 'between:-180,180'],
            'dropoff_latitude' => ['nullable', 'numeric', 'between:-90,90'],
            'dropoff_longitude' => ['nullable', 'numeric', 'between:-180,180'],
            'must_provide_wheelchair' => ['sometimes', 'boolean'],
            'has_infectious_disease' => ['sometimes', 'boolean'],
            'tag_list' => ['nullable', 'string', 'max:500'],
            'status' => [Rule::in(TripRequest::STATUSES)],
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'will_call' => $this->boolean('will_call'),
            'passenger_is_bariatric' => $this->boolean('passenger_is_bariatric'),
            'oxygen_required' => $this->boolean('oxygen_required'),
            'must_provide_wheelchair' => $this->boolean('must_provide_wheelchair'),
            'has_infectious_disease' => $this->boolean('has_infectious_disease'),
        ]);
    }

    /**
     * Whether the requested pickup time falls within 12 hours of the
     * current time — a "last minute" ride the dispatcher cannot plan for
     * via the online form. Returns false when either the trip date or
     * pickup time is unparseable so the required/string rules handle those.
     */
    private function isWithinTwelveHours(string $pickupTime): bool
    {
        $tripDate = $this->input('trip_date');

        if (! $tripDate) {
            return false;
        }

        try {
            $pickup = Carbon::parse($tripDate.' '.$pickupTime);
        } catch (\Throwable) {
            return false;
        }

        return $pickup->isAfter(now()) && $pickup->lte(now()->addHours(12));
    }
}
