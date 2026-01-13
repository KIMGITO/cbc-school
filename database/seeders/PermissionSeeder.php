<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Database\Seeders\SchoolRoleSeeder;
use Spatie\Permission\PermissionRegistrar;

class PermissionSeeder extends Seeder
{
    public function run()
    {
        // Reset cached roles and permissions
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        // Run the school role seeder
        $this->call(SchoolRoleSeeder::class);

        // Create default admin user
        $this->createDefaultAdmin();
    }

    protected function createDefaultAdmin()
    {
        // Create or get the super admin role
        $superAdminRole = Role::firstOrCreate([
            'name' => 'super_admin',
            'guard_name' => 'web'
        ]);

        // Create default admin user
        $admin = User::firstOrCreate(
            ['email' => 'admin@cbcschool.edu'],
            [
                'first_name' => 'System',
                'other_names' => 'Administrator',
                'sir_name' => 'Default',
                'password' => bcrypt('admin123'), // Change this in production!
                'email_verified_at' => now(),
            ]
        );

        // Assign super admin role
        $admin->assignRole($superAdminRole);

        $this->command->info('✓ Default admin user created:');
        $this->command->info('  Email: admin@cbcschool.edu');
        $this->command->info('  Password: admin123');
        $this->command->warn('  ⚠️  Change this password immediately in production!');
    }
}
