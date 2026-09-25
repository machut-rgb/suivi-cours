<?php

namespace Database\Factories;

use App\Models\Matiere;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<\App\Models\Programme>
 */
class ProgrammeFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => 'Programme '.fake()->word(),
            'matiere_id' => Matiere::factory(),
        ];
    }
}
