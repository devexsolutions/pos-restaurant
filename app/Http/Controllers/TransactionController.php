<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TransactionController extends Controller
{
    public function index()
    {
        $transactions = Transaction::with('order')->get();
        return response()->json($transactions);
    }

    public function store(Request $request)
    {
        $request->validate([
            'order_id' => 'required|exists:orders,id',
            'amount' => 'required|numeric|min:0',
            'payment_method' => 'required|in:cash,credit_card,debit_card,other',
            'transaction_reference' => 'nullable|string',
        ]);

        DB::beginTransaction();

        try {
            $order = Order::findOrFail($request->order_id);

            if ($order->total_amount != $request->amount) {
                throw new \Exception('Payment amount does not match order total');
            }

            $transaction = Transaction::create($request->all());
            $order->update(['status' => 'completed']);

            DB::commit();

            return response()->json($transaction, 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }

    public function show(Transaction $transaction)
    {
        return response()->json($transaction->load('order'));
    }

    public function splitPayment(Request $request, Order $order)
    {
        $request->validate([
            'payments' => 'required|array',
            'payments.*.amount' => 'required|numeric|min:0',
            'payments.*.payment_method' => 'required|in:cash,credit_card,debit_card,other',
            'payments.*.transaction_reference' => 'nullable|string',
        ]);

        $totalPaid = array_sum(array_column($request->payments, 'amount'));

        if ($totalPaid != $order->total_amount) {
            return response()->json(['error' => 'Total paid amount does not match order total'], 400);
        }

        DB::beginTransaction();

        try {
            foreach ($request->payments as $payment) {
                Transaction::create([
                    'order_id' => $order->id,
                    'amount' => $payment['amount'],
                    'payment_method' => $payment['payment_method'],
                    'transaction_reference' => $payment['transaction_reference'] ?? null,
                ]);
            }

            $order->update(['status' => 'completed']);

            DB::commit();

            return response()->json(['message' => 'Payment split successfully'], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }
}
