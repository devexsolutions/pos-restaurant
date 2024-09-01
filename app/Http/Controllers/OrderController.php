<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function index()
    {
        $orders = Order::with(['table', 'items.product'])->get();
        return response()->json($orders);
    }

    public function store(Request $request)
    {
        $request->validate([
            'table_id' => 'required|exists:tables,id',
            'items' => 'required|array',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        DB::beginTransaction();

        try {
            $order = Order::create([
                'table_id' => $request->table_id,
                'user_id' => auth()->id(),
                'status' => 'pending',
                'total_amount' => 0,
            ]);

            $totalAmount = 0;

            foreach ($request->items as $item) {
                $product = Product::findOrFail($item['product_id']);
                $orderItem = new OrderItem([
                    'product_id' => $product->id,
                    'quantity' => $item['quantity'],
                    'unit_price' => $product->price,
                    'notes' => $item['notes'] ?? null,
                ]);
                $order->items()->save($orderItem);
                $totalAmount += $product->price * $item['quantity'];
            }

            $order->update(['total_amount' => $totalAmount]);

            DB::commit();

            return response()->json($order->load('items.product'), 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Error creating order'], 500);
        }
    }

    public function show(Order $order)
    {
        return response()->json($order->load('items.product'));
    }

    public function update(Request $request, Order $order)
    {
        $request->validate([
            'status' => 'required|in:pending,in_progress,completed,cancelled',
        ]);

        $order->update($request->only('status'));

        return response()->json($order);
    }

    public function destroy(Order $order)
    {
        $order->delete();
        return response()->json(null, 204);
    }

    public function addItem(Request $request, Order $order)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
        ]);

        $product = Product::findOrFail($request->product_id);

        $orderItem = new OrderItem([
            'product_id' => $product->id,
            'quantity' => $request->quantity,
            'unit_price' => $product->price,
            'notes' => $request->notes ?? null,
        ]);

        $order->items()->save($orderItem);
        $order->increment('total_amount', $product->price * $request->quantity);

        return response()->json($order->load('items.product'));
    }

    public function removeItem(Order $order, OrderItem $item)
    {
        $order->decrement('total_amount', $item->unit_price * $item->quantity);
        $item->delete();

        return response()->json($order->load('items.product'));
    }
}
