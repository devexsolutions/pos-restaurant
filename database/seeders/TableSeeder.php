<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Table;

class TableSeeder extends Seeder
{
    public function run()
    {
        for ($i = 1; $i <= 10; $i++) {
            Table::create([
                'number' => 'T' . $i,
                'status' => 'available',
                'capacity' => rand(2, 8),
            ]);
        }
    }
}


