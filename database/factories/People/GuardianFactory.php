<?php

namespace Database\Factories\People;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\People\Guardian>
 */
class GuardianFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => null,
            'national_id' => $this->faker->unique()->regexify('[0-9]{8,12}'),
            'phone_number' => $this->faker->unique()->phoneNumber(),
            'phone_number_2' => $this->faker->optional()->phoneNumber(),
            'email' => $this->faker->unique()->safeEmail(),
            'occupation' => $this->faker->optional()->jobTitle(),
            'address' => $this->faker->address(),
            'county' => $this->faker->word(),
            'sub_county' => $this->faker->word(),
            'ward' => $this->faker->word(),
            'location' => $this->faker->word(),
            'sub_location' => $this->faker->word(),

        ];
    }
}
