<?php

namespace Database\Factories;

use App\Models\Parcours;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<\App\Models\Classe>
 */
class ClasseFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => 'Classe '.fake()->unique()->bothify('?#'),
            'parcours_id' => Parcours::factory(),
        ];
    }
}
