<?php

namespace App\Http\Controllers;

use App\Models\Table;
use Illuminate\Http\Request;

class TableController extends Controller
{
    public function index()
    {
        $tables = Table::all();
        return response()->json($tables);
    }

    public function store(Request $request)
    {
        $request->validate([
            'number' => 'required|string|unique:tables',
            'capacity' => 'required|integer|min:1',
        ]);

        $table = Table::create($request->all());
        return response()->json($table, 201);
    }

    public function show(Table $table)
    {
        return response()->json($table);
    }

    public function update(Request $request, Table $table)
    {
        $request->validate([
            'number' => 'string|unique:tables,number,' . $table->id,
            'capacity' => 'integer|min:1',
            'status' => 'in:available,occupied,reserved',
        ]);

        $table->update($request->all());
        return response()->json($table);
    }

    public function destroy(Table $table)
    {
        $table->delete();
        return response()->json(null, 204);
    }

    public function assignCustomer(Request $request, Table $table)
    {
        $request->validate([
            'customer_name' => 'required|string',
        ]);

        $table->status = 'occupied';
        $table->save();

        // Aquí podrías crear una nueva orden asociada a esta mesa si es necesario

        return response()->json(['message' => 'Customer assigned successfully', 'table' => $table]);
    }
}
