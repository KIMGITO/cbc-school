<?php

namespace Database\Factories\Users;

use App\Models\User;
use App\Models\Cores\Department;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Users\Teacher>
 */
class TeacherFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'department_id' => Department::factory(),
            'tsc_number' => $this->faker->unique()->regexify('[A-Z0-9]{8}'),
            'hire_date' => $this->faker->date(),
            'qualifications' => [$this->faker->word(), $this->faker->word()],
            'phone_number' => $this->faker->unique()->phoneNumber(),
            'phone_number_2' => $this->faker->optional()->phoneNumber(),
            'is_active' => $this->faker->boolean(90),
        ];
    }
}
