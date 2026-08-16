<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CareerApplication extends Model
{
    use HasFactory;

    protected $fillable = [
        'career_id',
        'user_id',
        'name',
        'email',
        'phone',
        'cover_letter',
        'resume_path',
        'resume_name',
    ];

    public function career(): BelongsTo
    {
        return $this->belongsTo(Career::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
