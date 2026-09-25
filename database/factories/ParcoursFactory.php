<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<\App\Models\Parcours>
 */
class ParcoursFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => 'Parcours '.fake()->unique()->word(),
        ];
    }
}
