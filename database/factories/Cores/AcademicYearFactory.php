<?php

namespace Database\Factories\Cores;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Cores\AcademicYear>
 */
class AcademicYearFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->unique()->year . '-' . ($this->faker->unique()->year + 1),
            'start_date' => $this->faker->dateTimeBetween('-3 years', 'now')->format('Y-m-d'),
            'end_date' => function (array $attributes) {
                // Add roughly 10 months to start_date for  year
                $start = new \DateTime($attributes['start_date']);
                $end = (clone $start)->modify('+10 months');
                return $end->format('Y-m-d');
            },
            'is_active' => $this->faker->boolean(20),
            'description' => $this->faker->optional()->sentence,
        ];
    }
}
