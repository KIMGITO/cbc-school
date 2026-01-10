<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class SchoolRoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Define all possible permissions in a CBC school system
        $permissions = [
            // User Management
            'view users',
            'create users',
            'edit users',
            'delete users',
            'activate users',
            'deactivate users',
            'reset passwords',

            // Student Management
            'view students',
            'create students',
            'edit students',
            'delete students',
            'admit students',
            'promote students',
            'transfer students',
            'graduate students',
            'view student profiles',
            'export student data',

            // Parent/Guardian Management
            'view parents',
            'create parents',
            'edit parents',
            'delete parents',
            'assign parents to students',
            'view parent profiles',

            // Teacher Management
            'view teachers',
            'create teachers',
            'edit teachers',
            'delete teachers',
            'assign teachers to classes',
            'assign teachers to subjects',
            'view teacher profiles',

            // Staff Management (Non-teaching)
            'view staff',
            'create staff',
            'edit staff',
            'delete staff',

            // Class Management
            'view classes',
            'create classes',
            'edit classes',
            'delete classes',
            'assign students to classes',
            'view class lists',

            // Subject/Course Management (CBC)
            'view subjects',
            'create subjects',
            'edit subjects',
            'delete subjects',
            'assign subjects to classes',
            'view subject curriculum',

            // CBC Strands & Sub-strands
            'view strands',
            'create strands',
            'edit strands',
            'delete strands',
            'view sub-strands',
            'create sub-strands',
            'edit sub-strands',
            'delete sub-strands',

            // Timetable Management
            'view timetable',
            'create timetable',
            'edit timetable',
            'delete timetable',
            'generate timetable',
            'publish timetable',

            // Attendance Management
            'view attendance',
            'take attendance',
            'edit attendance',
            'delete attendance',
            'approve attendance',
            'view attendance reports',
            'export attendance',

            // Assignment/Homework
            'view assignments',
            'create assignments',
            'edit assignments',
            'delete assignments',
            'grade assignments',
            'publish assignments',

            // Exams & Tests
            'view exams',
            'create exams',
            'edit exams',
            'delete exams',
            'grade exams',
            'publish exam results',
            'view exam analysis',

            // CBC Assessments & Competencies
            'view assessments',
            'create assessments',
            'edit assessments',
            'delete assessments',
            'conduct assessments',
            'record competencies',
            'view competency reports',

            // Grades/Marks
            'view grades',
            'enter grades',
            'edit grades',
            'delete grades',
            'approve grades',
            'calculate GPA',

            // Report Cards
            'view report cards',
            'generate report cards',
            'edit report cards',
            'approve report cards',
            'publish report cards',
            'print report cards',

            // Fees Management
            'view fees',
            'create fee structures',
            'edit fee structures',
            'delete fee structures',
            'view payments',
            'record payments',
            'edit payments',
            'delete payments',
            'generate receipts',
            'view fee reports',
            'waive fees',
            'add discounts',

            // Library Management
            'view library books',
            'add library books',
            'edit library books',
            'delete library books',
            'issue books',
            'return books',
            'view book history',

            // Inventory/Resources
            'view inventory',
            'add inventory',
            'edit inventory',
            'delete inventory',
            'issue resources',
            'view resource usage',

            // Transport Management
            'view transport',
            'manage transport routes',
            'assign students to buses',
            'view transport reports',

            // Notice/Announcement
            'view notices',
            'create notices',
            'edit notices',
            'delete notices',
            'publish notices',
            'approve notices',

            // Events Management
            'view events',
            'create events',
            'edit events',
            'delete events',
            'publish events',

            // Clubs & Societies
            'view clubs',
            'create clubs',
            'edit clubs',
            'delete clubs',
            'manage club members',

            // Discipline Management
            'view discipline records',
            'create discipline records',
            'edit discipline records',
            'delete discipline records',
            'approve disciplinary actions',

            // Health Records
            'view health records',
            'create health records',
            'edit health records',
            'delete health records',

            // Counseling
            'view counseling sessions',
            'create counseling sessions',
            'edit counseling sessions',
            'delete counseling sessions',

            // Special Needs
            'view special needs',
            'create special needs profiles',
            'edit special needs profiles',
            'delete special needs profiles',

            // Academic Year/Term
            'view academic years',
            'create academic years',
            'edit academic years',
            'close academic years',
            'view terms',
            'create terms',
            'edit terms',
            'close terms',

            // System Settings
            'view settings',
            'edit settings',
            'manage school profile',
            'manage academic structure',
            'manage grading system',
            'manage CBC framework',

            // Reports & Analytics
            'view analytics dashboard',
            'generate student reports',
            'generate teacher reports',
            'generate financial reports',
            'generate academic reports',
            'export reports',

            // Admission Process
            'view applications',
            'process applications',
            'approve applications',
            'reject applications',
            'view admission statistics',

            // Audit & Logs
            'view audit logs',
            'export audit logs',
            'clear audit logs',

            // Backup & Restore
            'create backups',
            'restore backups',
            'download backups',

            // Role & Permission Management
            'view roles',
            'create roles',
            'edit roles',
            'delete roles',
            'assign permissions',
            'view permissions',

            // Communication
            'send messages',
            'view messages',
            'delete messages',
            'send bulk SMS',
            'send emails',
            'view communication logs',

            // Portal Access
            'access parent portal',
            'access student portal',
            'access teacher portal',
            'access admin portal',

            // Self-service permissions
            'edit own profile',
            'view own grades',
            'view own attendance',
            'view own timetable',
            'view own child',
            'pay own fees',
            'view own payments',
        ];

        // Create all permissions
        foreach ($permissions as $permission) {
            Permission::firstOrCreate([
                'name' => $permission,
                'guard_name' => 'web'
            ]);
        }

        // Create roles with their specific permissions - ONLY USING PERMISSIONS THAT EXIST
        $roles = [
            'head_teacher' => [
                // User Management
                'view users',
                'create users',
                'edit users',
                'delete users',
                'activate users',
                'deactivate users',
                'reset passwords',

                // Student Management
                'view students',
                'create students',
                'edit students',
                'delete students',
                'admit students',
                'promote students',
                'transfer students',
                'graduate students',
                'view student profiles',
                'export student data',

                // Parent Management
                'view parents',
                'create parents',
                'edit parents',
                'delete parents',
                'assign parents to students',
                'view parent profiles',

                // Teacher Management
                'view teachers',
                'create teachers',
                'edit teachers',
                'delete teachers',
                'assign teachers to classes',
                'assign teachers to subjects',
                'view teacher profiles',

                // Staff Management
                'view staff',
                'create staff',
                'edit staff',
                'delete staff',

                // Class Management
                'view classes',
                'create classes',
                'edit classes',
                'delete classes',
                'assign students to classes',
                'view class lists',

                // Subject Management
                'view subjects',
                'create subjects',
                'edit subjects',
                'delete subjects',
                'assign subjects to classes',
                'view subject curriculum',

                // CBC Strands
                'view strands',
                'create strands',
                'edit strands',
                'delete strands',
                'view sub-strands',
                'create sub-strands',
                'edit sub-strands',
                'delete sub-strands',

                // Timetable
                'view timetable',
                'create timetable',
                'edit timetable',
                'delete timetable',
                'generate timetable',
                'publish timetable',

                // Attendance
                'view attendance',
                'take attendance',
                'edit attendance',
                'delete attendance',
                'approve attendance',
                'view attendance reports',
                'export attendance',

                // Assignments
                'view assignments',
                'create assignments',
                'edit assignments',
                'delete assignments',
                'grade assignments',
                'publish assignments',

                // Exams
                'view exams',
                'create exams',
                'edit exams',
                'delete exams',
                'grade exams',
                'publish exam results',
                'view exam analysis',

                // Assessments
                'view assessments',
                'create assessments',
                'edit assessments',
                'delete assessments',
                'conduct assessments',
                'record competencies',
                'view competency reports',

                // Grades
                'view grades',
                'enter grades',
                'edit grades',
                'delete grades',
                'approve grades',
                'calculate GPA',

                // Report Cards
                'view report cards',
                'generate report cards',
                'edit report cards',
                'approve report cards',
                'publish report cards',
                'print report cards',

                // Fees
                'view fees',
                'create fee structures',
                'edit fee structures',
                'delete fee structures',
                'view payments',
                'record payments',
                'edit payments',
                'delete payments',
                'generate receipts',
                'view fee reports',
                'waive fees',
                'add discounts',

                // Notices & Events
                'view notices',
                'create notices',
                'edit notices',
                'delete notices',
                'publish notices',
                'approve notices',
                'view events',
                'create events',
                'edit events',
                'delete events',
                'publish events',

                // Discipline & Records
                'view discipline records',
                'create discipline records',
                'edit discipline records',
                'delete discipline records',
                'approve disciplinary actions',
                'view health records',
                'create health records',
                'edit health records',
                'delete health records',
                'view counseling sessions',
                'create counseling sessions',
                'edit counseling sessions',
                'delete counseling sessions',
                'view special needs',
                'create special needs profiles',
                'edit special needs profiles',
                'delete special needs profiles',

                // Academic Year/Term
                'view academic years',
                'create academic years',
                'edit academic years',
                'close academic years',
                'view terms',
                'create terms',
                'edit terms',
                'close terms',

                // Settings
                'view settings',
                'edit settings',
                'manage school profile',
                'manage academic structure',
                'manage grading system',
                'manage CBC framework',

                // Reports
                'view analytics dashboard',
                'generate student reports',
                'generate teacher reports',
                'generate financial reports',
                'generate academic reports',
                'export reports',

                // Admission
                'view applications',
                'process applications',
                'approve applications',
                'reject applications',
                'view admission statistics',

                // Communication
                'send messages',
                'view messages',
                'delete messages',
                'send bulk SMS',
                'send emails',
                'view communication logs',

                // Portals
                'access admin portal',
                'access teacher portal',

                // Self-service
                'edit own profile',
            ],

            'deputy_head_teacher' => [
                'view users',
                'create users',
                'edit users',
                'view students',
                'create students',
                'edit students',
                'admit students',
                'promote students',
                'view parents',
                'create parents',
                'edit parents',
                'view teachers',
                'create teachers',
                'edit teachers',
                'view classes',
                'create classes',
                'edit classes',
                'view subjects',
                'create subjects',
                'edit subjects',
                'view timetable',
                'create timetable',
                'edit timetable',
                'view attendance',
                'take attendance',
                'edit attendance',
                'view attendance reports',
                'view assignments',
                'create assignments',
                'edit assignments',
                'view exams',
                'create exams',
                'edit exams',
                'publish exam results',
                'view assessments',
                'create assessments',
                'edit assessments',
                'view grades',
                'enter grades',
                'edit grades',
                'view report cards',
                'generate report cards',
                'approve report cards',
                'view fees',
                'view payments',
                'record payments',
                'view notices',
                'create notices',
                'edit notices',
                'publish notices',
                'view events',
                'create events',
                'edit events',
                'view discipline records',
                'create discipline records',
                'edit discipline records',
                'view academic years',
                'edit academic years',
                'view settings',
                'edit settings',
                'view analytics dashboard',
                'generate student reports',
                'view applications',
                'process applications',
                'send messages',
                'view messages',
                'access admin portal',
                'edit own profile',
            ],

            'academic_master' => [
                'view students',
                'edit students',
                'view teachers',
                'edit teachers',
                'view classes',
                'edit classes',
                'view subjects',
                'create subjects',
                'edit subjects',
                'view timetable',
                'create timetable',
                'edit timetable',
                'view attendance',
                'view attendance reports',
                'view assignments',
                'create assignments',
                'edit assignments',
                'view exams',
                'create exams',
                'edit exams',
                'publish exam results',
                'view assessments',
                'create assessments',
                'edit assessments',
                'view grades',
                'enter grades',
                'edit grades',
                'approve grades',
                'view report cards',
                'generate report cards',
                'approve report cards',
                'view strands',
                'create strands',
                'edit strands',
                'view sub-strands',
                'create sub-strands',
                'edit sub-strands',
                'view academic years',
                'edit academic years',
                'manage academic structure',
                'manage grading system',
                'manage CBC framework',
                'generate academic reports',
                'access admin portal',
                'edit own profile',
            ],

            'teacher' => [
                'view students',
                'view attendance',
                'take attendance',
                'edit attendance',
                'view assignments',
                'create assignments',
                'edit assignments',
                'grade assignments',
                'publish assignments',
                'view exams',
                'create exams',
                'edit exams',
                'grade exams',
                'publish exam results',
                'view assessments',
                'conduct assessments',
                'record competencies',
                'view grades',
                'enter grades',
                'edit grades',
                'view report cards',
                'generate report cards',
                'view strands',
                'view sub-strands',
                'send messages',
                'view messages',
                'view notices',
                'view events',
                'access teacher portal',
                'edit own profile',
                'view own grades',
                'view own attendance',
                'view own timetable',
            ],

            'class_teacher' => [
                'view students',
                'view attendance',
                'take attendance',
                'edit attendance',
                'view assignments',
                'create assignments',
                'edit assignments',
                'grade assignments',
                'view grades',
                'enter grades',
                'edit grades',
                'view report cards',
                'generate report cards',
                'view parents',
                'assign parents to students',
                'send messages',
                'view messages',
                'view discipline records',
                'create discipline records',
                'edit discipline records',
                'edit own profile',
                'view own timetable',
            ],

            'guardian' => [
                'view own child',
                'view own grades',
                'view own attendance',
                'view own timetable',
                'view own payments',
                'pay own fees',
                'view notices',
                'view events',
                'send messages',
                'view messages',
                'access parent portal',
                'edit own profile',
            ],

            'student' => [
                'view own grades',
                'view own attendance',
                'view own timetable',
                'view assignments',
                'view exams',
                'view notices',
                'view events',
                'send messages',
                'view messages',
                'access student portal',
                'edit own profile',
            ],

            'accountant' => [
                'view fees',
                'create fee structures',
                'edit fee structures',
                'delete fee structures',
                'view payments',
                'record payments',
                'edit payments',
                'delete payments',
                'generate receipts',
                'view fee reports',
                'waive fees',
                'add discounts',
                'generate financial reports',
                'access admin portal',
                'edit own profile',
            ],

            'librarian' => [
                'view library books',
                'add library books',
                'edit library books',
                'delete library books',
                'issue books',
                'return books',
                'view book history',
                'access admin portal',
                'edit own profile',
            ],

            'admin' => [
                'view users',
                'create users',
                'edit users',
                'delete users',
                'view settings',
                'edit settings',
                'view audit logs',
                'create backups',
                'restore backups',
                'download backups',
                'access admin portal',
                'edit own profile',
            ],

            'super_admin' => [
                '*'
            ]
        ];

        // Create roles and assign permissions
        foreach ($roles as $roleName => $rolePermissions) {
            $role = Role::firstOrCreate([
                'name' => $roleName,
                'guard_name' => 'web'
            ]);

            if ($rolePermissions === ['*']) {
                // Super admin gets all permissions
                $role->givePermissionTo(Permission::all());
            } else {
                // Filter out any permissions that don't exist
                $existingPermissions = array_intersect($rolePermissions, $permissions);
                $role->givePermissionTo($existingPermissions);
            }
        }

        $this->command->info('✓ School roles and permissions seeded successfully!');
        $this->command->info('Roles created: ' . implode(', ', array_keys($roles)));

        // Show any permissions that were assigned to non-existent roles
        foreach ($roles as $roleName => $rolePermissions) {
            if ($rolePermissions !== ['*']) {
                $nonExistent = array_diff($rolePermissions, $permissions);
                if (!empty($nonExistent)) {
                    $this->command->warn("Role '{$roleName}' had non-existent permissions: " . implode(', ', $nonExistent));
                }
            }
        }
    }
}
