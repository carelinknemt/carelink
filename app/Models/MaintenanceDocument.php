<?php

namespace App\Models;

use Database\Factories\MaintenanceDocumentFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MaintenanceDocument extends Model
{
    /** @use HasFactory<MaintenanceDocumentFactory> */
    use HasFactory;

    protected $fillable = [
        'vehicle_maintenance_record_id',
        'file_path',
        'file_name',
        'file_size',
    ];

    /**
     * @return BelongsTo<VehicleMaintenanceRecord, $this>
     */
    public function record(): BelongsTo
    {
        return $this->belongsTo(VehicleMaintenanceRecord::class, 'vehicle_maintenance_record_id');
    }
}
