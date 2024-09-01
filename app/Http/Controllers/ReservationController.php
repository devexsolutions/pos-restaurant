<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use App\Models\Table;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class ReservationController extends Controller
{
    public function index()
    {
        $reservations = Reservation::with('table')->get();
        return response()->json($reservations);
    }

    public function store(Request $request)
    {
        $request->validate([
            'customer_name' => 'required|string',
            'customer_email' => 'required|email',
            'customer_phone' => 'required|string',
            'reservation_time' => 'required|date',
            'party_size' => 'required|integer|min:1',
            'special_requests' => 'nullable|string',
        ]);

        // Find an available table
        $table = Table::where('capacity', '>=', $request->party_size)
            ->whereDoesntHave('reservations', function ($query) use ($request) {
                $query->where('reservation_time', $request->reservation_time)
                    ->where('status', '!=', 'cancelled');
            })
            ->first();

        if (!$table) {
            return response()->json(['message' => 'No available tables for the requested time and party size'], 400);
        }

        $reservation = Reservation::create([
            'table_id' => $table->id,
            'customer_name' => $request->customer_name,
            'customer_email' => $request->customer_email,
            'customer_phone' => $request->customer_phone,
            'reservation_time' => $request->reservation_time,
            'party_size' => $request->party_size,
            'special_requests' => $request->special_requests,
            'status' => 'confirmed',
        ]);

        // Send confirmation email
        $this->sendConfirmationEmail($reservation);

        return response()->json($reservation, 201);
    }

    public function show(Reservation $reservation)
    {
        return response()->json($reservation->load('table'));
    }

    public function update(Request $request, Reservation $reservation)
    {
        $request->validate([
            'status' => 'required|in:confirmed,cancelled,completed',
        ]);

        $reservation->update($request->only('status'));

        return response()->json($reservation);
    }

    public function destroy(Reservation $reservation)
    {
        $reservation->delete();
        return response()->json(null, 204);
    }

    private function sendConfirmationEmail($reservation)
    {
        // Implement email sending logic here
        // You can use Laravel's built-in Mail facade or a third-party service

        // Example using Laravel's Mail facade:
        /*
        Mail::send('emails.reservation_confirmation', ['reservation' => $reservation], function ($message) use ($reservation) {
            $message->to($reservation->customer_email, $reservation->customer_name)
                ->subject('Reservation Confirmation');
        });
        */
    }
}
