<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class SuperAdminSeeder extends Seeder
{
    public function run(): void
    {
        User::firstOrCreate(
            ['email' => 'superadmin@dailynewsbd.com'],
            [
                'name' => 'Super Admin',
                'password' => Hash::make('ChangeThisPassword123!'), // প্রথম লগইনের পর অবশ্যই বদলাবেন
                'role' => 'super_admin',
                'status' => 'active',
            ]
        );

        $categories = ['জাতীয়', 'রাজনীতি', 'আন্তর্জাতিক', 'অর্থনীতি', 'খেলা', 'বিনোদন', 'প্রযুক্তি', 'মতামত'];

        foreach ($categories as $order => $name) {
            Category::firstOrCreate(
                ['slug' => \Illuminate\Support\Str::slug($name, '-', 'bn')],
                ['name' => $name, 'order' => $order, 'is_active' => true]
            );
        }
    }
}