<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class CheckDatabase extends Command
{
    protected $signature = 'db:check';
    protected $description = 'Check database structure and data';

    public function handle()
    {
        $this->info('Checking database structure...');

        // Check tables
        $tables = ['students', 'modules', 'attendances', 'progress'];
        foreach ($tables as $table) {
            if (Schema::hasTable($table)) {
                $this->info("✓ Table '{$table}' exists");
                $count = DB::table($table)->count();
                $this->info("  - Contains {$count} records");
            } else {
                $this->error("✗ Table '{$table}' does not exist");
            }
        }

        // Check foreign keys
        $this->info("\nChecking foreign key constraints...");
        $constraints = DB::select("
            SELECT 
                TABLE_NAME,
                COLUMN_NAME,
                CONSTRAINT_NAME,
                REFERENCED_TABLE_NAME,
                REFERENCED_COLUMN_NAME
            FROM
                information_schema.KEY_COLUMN_USAGE
            WHERE
                REFERENCED_TABLE_SCHEMA = DATABASE()
                AND REFERENCED_TABLE_NAME IS NOT NULL
                AND TABLE_SCHEMA = DATABASE();
        ");

        foreach ($constraints as $constraint) {
            $this->info("✓ Foreign key: {$constraint->TABLE_NAME}.{$constraint->COLUMN_NAME} -> {$constraint->REFERENCED_TABLE_NAME}.{$constraint->REFERENCED_COLUMN_NAME}");
        }

        // Check sample data
        $this->info("\nChecking sample data...");
        $student = DB::table('students')->first();
        if ($student) {
            $this->info("Sample student: ID {$student->id}, Name {$student->name}");
            
            $modules = DB::table('modules')
                ->where('end_date', '<', now())
                ->count();
            $this->info("Completed modules: {$modules}");
        } else {
            $this->warn("No students found in the database");
        }
    }
} 