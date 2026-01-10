<?php

namespace Database\Factories\Cores;

use App\Models\Cores\AcademicYear;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Cores\Term>
 */
class TermFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'academic_year' => AcademicYear::factory(),
            'name' => $this->faker->randomElement(['Term 1', 'Term 2', 'Term 3']),
            'number' => $this->faker->numberBetween(1, 3),
            'start_date' => function (array $attributes) {
                // Set a random start date between -2 years and now
                return $this->faker->dateTimeBetween('-2 years', 'now')->format('Y-m-d');
            },
            'end_date' => function (array $attributes) {
                $start = new \DateTime($attributes['start_date']);
                // Each term spans about 3 months
                $end = (clone $start)->modify('+3 months');
                return $end->format('Y-m-d');
            },
            'is_active' => $this->faker->boolean(20),
        ];
    }
}
