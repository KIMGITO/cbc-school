<?php

namespace Database\Factories\People;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\People\Student>
 */
class StudentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'first_name' => $this->faker->firstName(),
            'other_names' => $this->faker->lastName(),
            'sir_name' => $this->faker->lastName(),
            'adm_no' => $this->faker->unique()->regexify('[A-Z0-9]{5,10}'),
            'date_of_birth' => $this->faker->date('Y-m-d', '-6 years'),
            'gender' => $this->faker->randomElement(['male', 'female']),
            'profile_photo' => null,
            // residential address
            'county' => $this->faker->word(),
            'sub_county' => $this->faker->word(),
            'ward' => $this->faker->word(),
            'location' => $this->faker->word(),
            'sub_location' => $this->faker->word(),
            'upi_number' => $this->faker->unique()->regexify('[0-9]{10}'),
            // medical safety
            'blood_group' => $this->faker->randomElement(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']),
            'allergies' => $this->faker->optional()->randomElements([
                'Peanuts',
                'Milk',
                'Eggs',
                'Soy',
                'Wheat',
                'Fish',
                'Shellfish',
                'None'
            ], $this->faker->numberBetween(0, 2)),
            'special_medical_needs' => $this->faker->optional()->randomElements([
                'Asthma',
                'Diabetes',
                'Epilepsy',
                'None'
            ], $this->faker->numberBetween(0, 1)),
            // school and admission
            'grade_level' => $this->faker->numberBetween(1, 12),
            'stream_id' => null,
            'admission_date' => $this->faker->date('Y-m-d', 'now'),
            'enrollment_type' => $this->faker->randomElement(['new', 'transfer']),
            'boarding_status' => $this->faker->randomElement(['day', 'boarding']),
            // cbc 
            'talent_areas' => $this->faker->randomElements([
                'Music',
                'Sports',
                'Drama',
                'Debate',
                'Scouting',
                'Math Club'
            ], $this->faker->numberBetween(0, 2)),
            'learning_support' => $this->faker->boolean(),
            'assessment_rating' => $this->faker->randomElement(['EE', 'ME', 'AE', 'BE']),
            // academic related
            'academic_status' => $this->faker->randomElement(['active', 'inactive', 'transferred', 'graduated']),
            'exit_date' => null,
            'exit_reason' => null,
            'crated_by' => 1,
        ];
    }
}
