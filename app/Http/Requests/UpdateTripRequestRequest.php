<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateTripRequestRequest extends FormRequest
{
    private const BOOLEAN_FIELDS = [
        'will_call',
        'passenger_is_bariatric',
        'oxygen_required',
        'pickup_stairs',
        'must_provide_wheelchair',
        'has_infectious_disease',
    ];

    public function authorize(): bool
    {
        return true;
    }

    /**
     * Only the fields actually submitted are validated, so a manager can
     * save a single details card without touching the others. Every rule
     * is "sometimes": when a field is absent (other cards) it is skipped,
     * and when present it must satisfy the same constraints as the store
     * request.
     *
     * @return array<string, array<int, mixed>>
     */
    public function rules(): array
    {
        return [
            'passenger_first_name' => ['sometimes', 'required', 'string', 'max:255'],
            'passenger_last_name' => ['sometimes', 'required', 'string', 'max:255'],
            'payer' => ['sometimes', 'required', 'string', Rule::in(['Private Pay'])],
            'transport_type' => ['sometimes', 'required', 'string', Rule::in(['ambulatory', 'wheelchair', 'wheelchair xl', 'broda chair', 'geri chair'])],
            'service_type' => ['sometimes', 'required', 'string', Rule::in(['curb-to-curb', 'door-to-door', 'door-through-door', 'person-to-person'])],
            'will_call' => ['sometimes', 'boolean'],
            'trip_date' => ['sometimes', 'required', 'date', 'after_or_equal:today'],
            'input_price' => ['sometimes', 'required', 'numeric', 'min:0', 'max:100000'],
            'pickup_address' => ['sometimes', 'required', 'string', 'max:255'],
            'pickup_time' => ['sometimes', 'required', 'string', 'max:32'],
            'dropoff_address' => ['sometimes', 'required', 'string', 'max:255'],
            'passenger_phone_number' => ['sometimes', 'nullable', 'string', 'regex:/^(?:\+1|1)?\s*(?:\(\d{3}\)|\d{3})[\s.-]?\d{3}[\s.-]?\d{4}$/'],
            'passenger_email' => ['sometimes', 'required', 'email', 'max:255'],
            'passenger_dob' => ['sometimes', 'nullable', 'date', 'before:today'],
            'passenger_gender' => ['sometimes', 'nullable', 'string', 'max:32'],
            'passenger_weight' => ['sometimes', 'nullable', 'numeric', 'min:0', 'max:2000'],
            'passenger_is_bariatric' => ['sometimes', 'boolean'],
            'passenger_notes' => ['sometimes', 'nullable', 'string', 'max:5000'],
            'attendants_needed' => ['sometimes', 'nullable', 'integer', 'min:0', 'max:20'],
            'additional_passengers' => ['sometimes', 'nullable', 'integer', 'min:0', 'max:50'],
            'oxygen_required' => ['sometimes', 'boolean'],
            'oxygen_liters_per_min' => ['sometimes', 'nullable', 'integer', 'min:1', 'max:100'],
            'requested_by_name' => ['sometimes', 'nullable', 'string', 'max:255'],
            'requested_by_phone_number' => ['sometimes', 'nullable', 'string', 'regex:/^(?:\+1|1)?\s*(?:\(\d{3}\)|\d{3})[\s.-]?\d{3}[\s.-]?\d{4}$/'],
            'dispatcher_notes' => ['sometimes', 'nullable', 'string', 'max:5000'],
            'pickup_address_details' => ['sometimes', 'nullable', 'string', 'max:255'],
            'pickup_stairs' => ['sometimes', 'boolean'],
            'pickup_stair_equipment' => ['sometimes', 'nullable', 'string', 'max:255'],
            'pickup_driver_notes' => ['sometimes', 'nullable', 'string', 'max:5000'],
            'pickup_contact_name' => ['sometimes', 'nullable', 'string', 'max:255'],
            'pickup_contact_phone_number' => ['sometimes', 'nullable', 'string', 'regex:/^(?:\+1|1)?\s*(?:\(\d{3}\)|\d{3})[\s.-]?\d{3}[\s.-]?\d{4}$/'],
            'load_time' => ['sometimes', 'nullable', 'string', 'max:32'],
            'dropoff_address_details' => ['sometimes', 'nullable', 'string', 'max:255'],
            'appointment_time' => ['sometimes', 'nullable', 'string', 'max:32'],
            'dropoff_stairs' => ['sometimes', 'integer', 'min:0', 'max:999'],
            'dropoff_stair_equipment' => ['sometimes', 'nullable', 'string', 'max:255'],
            'dropoff_driver_notes' => ['sometimes', 'nullable', 'string', 'max:5000'],
            'dropoff_contact_name' => ['sometimes', 'nullable', 'string', 'max:255'],
            'dropoff_contact_phone_number' => ['sometimes', 'nullable', 'string', 'regex:/^(?:\+1|1)?\s*(?:\(\d{3}\)|\d{3})[\s.-]?\d{3}[\s.-]?\d{4}$/'],
            'unload_time' => ['sometimes', 'nullable', 'string', 'max:32'],
            'pickup_latitude' => ['sometimes', 'nullable', 'numeric', 'between:-90,90'],
            'pickup_longitude' => ['sometimes', 'nullable', 'numeric', 'between:-180,180'],
            'dropoff_latitude' => ['sometimes', 'nullable', 'numeric', 'between:-90,90'],
            'dropoff_longitude' => ['sometimes', 'nullable', 'numeric', 'between:-180,180'],
            'must_provide_wheelchair' => ['sometimes', 'boolean'],
            'has_infectious_disease' => ['sometimes', 'boolean'],
            'tag_list' => ['sometimes', 'nullable', 'string', 'max:500'],
        ];
    }

    protected function prepareForValidation(): void
    {
        foreach (self::BOOLEAN_FIELDS as $field) {
            if ($this->has($field)) {
                $this->merge([$field => $this->boolean($field)]);
            }
        }
    }
}
