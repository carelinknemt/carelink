<?php

namespace App\Models;

use Database\Factories\BusinessPartnerRequestFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BusinessPartnerRequest extends Model
{
    /** @use HasFactory<BusinessPartnerRequestFactory> */
    use HasFactory;

    public const STATUS_PENDING = 'PENDING';

    public const STATUS_APPROVED = 'APPROVED';

    public const STATUS_REJECTED = 'REJECTED';

    /**
     * Sentinel used by the dashboard status filter to request every
     * status (as opposed to no filter, which means pending only).
     */
    public const STATUS_FILTER_ALL = '__all';

    public const STATUSES = [
        self::STATUS_PENDING,
        self::STATUS_APPROVED,
        self::STATUS_REJECTED,
    ];

    public const BUSINESS_TYPES = [
        'Healthcare Facility',
        'Hospital / Clinic',
        'Medi-Cal / Insurance',
        'Community Organization',
        'Other',
    ];

    protected $fillable = [
        'company_name',
        'contact_name',
        'email',
        'phone',
        'business_type',
        'estimated_monthly_trips',
        'message',
        'status',
    ];

    protected $attributes = [
        'status' => self::STATUS_PENDING,
    ];

    /**
     * Display summary used by the manager dashboard list.
     */
    public function managerSummary(): array
    {
        return [
            'id' => $this->id,
            'company_name' => $this->company_name,
            'contact_name' => $this->contact_name,
            'email' => $this->email,
            'phone' => $this->phone,
            'business_type' => $this->business_type,
            'estimated_monthly_trips' => $this->estimated_monthly_trips,
            'message' => $this->message,
            'status' => $this->status,
            'submitted_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
