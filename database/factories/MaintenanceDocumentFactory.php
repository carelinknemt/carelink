<?php

namespace Database\Factories;

use App\Models\MaintenanceDocument;
use App\Models\VehicleMaintenanceRecord;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<MaintenanceDocument>
 */
class MaintenanceDocumentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'vehicle_maintenance_record_id' => VehicleMaintenanceRecord::factory(),
            'file_path' => "maintenance-documents/{$this->faker->sha1()}.pdf",
            'file_name' => $this->faker->words(2, true).'.pdf',
            'file_size' => $this->faker->numberBetween(10_000, 500_000),
        ];
    }
}
