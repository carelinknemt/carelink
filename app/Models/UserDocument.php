<?php

namespace App\Models;

use Database\Factories\UserDocumentFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserDocument extends Model
{
    /** @use HasFactory<UserDocumentFactory> */
    use HasFactory;

    public const TYPE_LICENSE = 'license';

    public const TYPE_CPR_CERTIFICATE = 'cpr_certificate';

    public const TYPE_MVR = 'mvr';

    public const TYPE_FIRST_AID_CERTIFICATE = 'first_aid_certificate';

    public const TYPE_CUSTOM = 'custom';

    /** @var array<int, string> */
    public const TYPES = [
        self::TYPE_LICENSE,
        self::TYPE_CPR_CERTIFICATE,
        self::TYPE_MVR,
        self::TYPE_FIRST_AID_CERTIFICATE,
        self::TYPE_CUSTOM,
    ];

    /** @var array<string, string> */
    public const TYPE_LABELS = [
        self::TYPE_LICENSE => 'License',
        self::TYPE_CPR_CERTIFICATE => 'CPR certificate',
        self::TYPE_MVR => 'MVR',
        self::TYPE_FIRST_AID_CERTIFICATE => 'First aid certificate',
        self::TYPE_CUSTOM => 'Other',
    ];

    protected $fillable = [
        'user_id',
        'type',
        'label',
        'file_path',
        'file_name',
        'file_size',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function typeLabel(): string
    {
        return self::TYPE_LABELS[$this->type] ?? $this->label ?? self::TYPE_LABELS[self::TYPE_CUSTOM];
    }
}
