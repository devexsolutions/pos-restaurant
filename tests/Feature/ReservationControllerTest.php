<?php

namespace Tests\Feature;

use App\Models\Table;
use App\Models\Reservation;
use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

class ReservationControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_create_reservation()
    {
        $table = Table::factory()->create(['capacity' => 4]);

        $response = $this->postJson('/api/reservations', [
            'customer_name' => 'John Doe',
            'customer_email' => 'john@example.com',
            'customer_phone' => '1234567890',
            'reservation_time' => '2023-06-01 19:00:00',
            'party_size' => 2,
            'special_requests' => 'No nuts please',
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'id',
                'table_id',
                'customer_name',
                'customer_email',
                'customer_phone',
                'reservation_time',
                'party_size',
                'special_requests',
                'status',
            ]);

        $this->assertDatabaseHas('reservations', [
            'customer_name' => 'John Doe',
            'customer_email' => 'john@example.com',
            'status' => 'confirmed',
        ]);
    }

    public function test_cannot_create_reservation_when_no_tables_available()
    {
        $table = Table::factory()->create(['capacity' => 2]);
        Reservation::factory()->create([
            'table_id' => $table->id,
            'reservation_time' => '2023-06-01 19:00:00',
            'party_size' => 2,
        ]);

        $response = $this->postJson('/api/reservations', [
            'customer_name' => 'Jane Doe',
            'customer_email' => 'jane@example.com',
            'customer_phone' => '0987654321',
            'reservation_time' => '2023-06-01 19:00:00',
            'party_size' => 2,
        ]);

        $response->assertStatus(400)
            ->assertJson([
                'message' => 'No available tables for the requested time and party size',
            ]);
    }

    public function test_can_update_reservation_status()
    {
        $reservation = Reservation::factory()->create();

        $response = $this->putJson("/api/reservations/{$reservation->id}", [
            'status' => 'cancelled',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'status' => 'cancelled',
            ]);

        $this->assertDatabaseHas('reservations', [
            'id' => $reservation->id,
            'status' => 'cancelled',
        ]);
    }
}
