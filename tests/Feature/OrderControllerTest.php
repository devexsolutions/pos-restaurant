<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Table;
use App\Models\Product;
use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

class OrderControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_create_order()
    {
        $user = User::factory()->create();
        $table = Table::factory()->create();
        $product = Product::factory()->create(['price' => 10.00]);

        $response = $this->actingAs($user)->postJson('/api/orders', [
            'table_id' => $table->id,
            'items' => [
                [
                    'product_id' => $product->id,
                    'quantity' => 2,
                ],
            ],
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'id',
                'table_id',
                'user_id',
                'status',
                'total_amount',
                'items' => [
                    '*' => [
                        'id',
                        'product_id',
                        'quantity',
                        'unit_price',
                    ],
                ],
            ]);

        $this->assertDatabaseHas('orders', [
            'table_id' => $table->id,
            'user_id' => $user->id,
            'status' => 'pending',
            'total_amount' => 20.00,
        ]);
    }

    public function test_can_get_order_details()
    {
        $user = User::factory()->create();
        $table = Table::factory()->create();
        $order = Order::factory()->create(['user_id' => $user->id, 'table_id' => $table->id]);

        $response = $this->actingAs($user)->getJson("/api/orders/{$order->id}");

        $response->assertStatus(200)
            ->assertJsonStructure([
                'id',
                'table_id',
                'user_id',
                'status',
                'total_amount',
                'items',
            ]);
    }

    public function test_can_update_order_status()
    {
        $user = User::factory()->create();
        $table = Table::factory()->create();
        $order = Order::factory()->create(['user_id' => $user->id, 'table_id' => $table->id]);

        $response = $this->actingAs($user)->putJson("/api/orders/{$order->id}", [
            'status' => 'completed',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'status' => 'completed',
            ]);

        $this->assertDatabaseHas('orders', [
            'id' => $order->id,
            'status' => 'completed',
        ]);
    }
}
