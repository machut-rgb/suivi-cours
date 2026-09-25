<?php

namespace Database\Factories;

use App\Models\Programme;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<\App\Models\Chapitre>
 */
class ChapitreFactory extends Factory
{
    public function definition(): array
    {
        return [
            'title' => 'Chapitre '.fake()->sentence(3),
            'isFinished' => false,
            'programme_id' => Programme::factory(),
        ];
    }

    public function finished(): static
    {
        return $this->state(fn (array $attributes) => [
            'isFinished' => true,
        ]);
    }
}
