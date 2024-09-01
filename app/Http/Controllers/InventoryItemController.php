<?php

namespace App\Http\Controllers;

use App\Models\InventoryItem;
use Illuminate\Http\Request;

class InventoryItemController extends Controller
{
    public function index()
    {
        $inventoryItems = InventoryItem::with('product')->get();
        return response()->json($inventoryItems);
    }

    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:0',
        ]);

        $inventoryItem = InventoryItem::create($request->all());
        return response()->json($inventoryItem, 201);
    }

    public function show(InventoryItem $inventoryItem)
    {
        return response()->json($inventoryItem->load('product'));
    }

    public function update(Request $request, InventoryItem $inventoryItem)
    {
        $request->validate([
            'quantity' => 'integer|min:0',
        ]);

        $inventoryItem->update($request->all());
        return response()->json($inventoryItem);
    }

    public function destroy(InventoryItem $inventoryItem)
    {
        $inventoryItem->delete();
        return response()->json(null, 204);
    }
}
