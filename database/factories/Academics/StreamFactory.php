<?php

namespace Database\Factories\Academics;

use App\Models\Academics\GradeLevel;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Academics\Stream>
 */
class StreamFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->unique()->word(),
            'description' => $this->faker->optional()->sentence(),
            'is_active' => $this->faker->boolean(90),
            'grade_level_id' => GradeLevel::factory(),
            'teacher_id' => null,
        ];
    }
}
