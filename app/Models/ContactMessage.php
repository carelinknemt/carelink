<?php

namespace App\Models;

use Database\Factories\ContactMessageFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ContactMessage extends Model
{
    /** @use HasFactory<ContactMessageFactory> */
    use HasFactory;

    public const STATUS_PENDING = 'PENDING';

    public const STATUS_READ = 'READ';

    /**
     * Sentinel used by the dashboard status filter to request every
     * status (as opposed to no filter, which means pending only).
     */
    public const STATUS_FILTER_ALL = '__all';

    public const STATUSES = [
        self::STATUS_PENDING,
        self::STATUS_READ,
    ];

    protected $fillable = [
        'name',
        'email',
        'phone',
        'message',
        'status',
        'read_at',
    ];

    protected $attributes = [
        'status' => self::STATUS_PENDING,
    ];

    protected function casts(): array
    {
        return [
            'read_at' => 'datetime',
        ];
    }

    /**
     * Display summary used by the manager dashboard list.
     */
    public function managerSummary(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'message' => $this->message,
            'status' => $this->status,
            'read_at' => $this->read_at?->toIso8601String(),
            'submitted_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
