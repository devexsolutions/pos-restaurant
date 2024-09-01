<?php

namespace Tests\Unit;

use App\Models\Order;
use App\Models\User;
use App\Models\Table;
use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

class OrderTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_create_order()
    {
        $user = User::factory()->create();
        $table = Table::factory()->create();

        $order = Order::create([
            'table_id' => $table->id,
            'user_id' => $user->id,
            'status' => 'pending',
            'total_amount' => 100.00,
        ]);

        $this->assertInstanceOf(Order::class, $order);
        $this->assertEquals('pending', $order->status);
        $this->assertEquals(100.00, $order->total_amount);
    }

    public function test_order_belongs_to_user()
    {
        $user = User::factory()->create();
        $table = Table::factory()->create();
        $order = Order::factory()->create(['user_id' => $user->id, 'table_id' => $table->id]);

        $this->assertInstanceOf(User::class, $order->user);
        $this->assertEquals($user->id, $order->user->id);
    }

    public function test_order_belongs_to_table()
    {
        $user = User::factory()->create();
        $table = Table::factory()->create();
        $order = Order::factory()->create(['user_id' => $user->id, 'table_id' => $table->id]);

        $this->assertInstanceOf(Table::class, $order->table);
        $this->assertEquals($table->id, $order->table->id);
    }
}
