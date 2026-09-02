<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TripRequestAudit extends Model
{
    /** @use HasFactory<TripRequestAuditFactory> */
    use HasFactory;

    public const UPDATED_AT = null;

    public const ACTION_STATUS_CHANGED = 'status_changed';

    public const ACTION_CANCELLED = 'cancelled';

    public const ACTION_UPDATED = 'updated';

    protected $fillable = [
        'trip_request_id',
        'user_id',
        'user_name',
        'role',
        'action',
        'from_value',
        'to_value',
        'reason',
    ];

    protected $casts = [
        'created_at' => 'datetime',
    ];

    public function tripRequest(): BelongsTo
    {
        return $this->belongsTo(TripRequest::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
