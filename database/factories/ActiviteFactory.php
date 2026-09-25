<?php

namespace Database\Factories;

use App\Models\Chapitre;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<\App\Models\Activite>
 */
class ActiviteFactory extends Factory
{
    public function definition(): array
    {
        return [
            'note' => fake()->sentence(),
            'date' => fake()->dateTimeBetween('-3 months')->format('Y-m-d'),
            'chapitre_id' => Chapitre::factory(),
            'user_id' => User::factory(),
        ];
    }
}
