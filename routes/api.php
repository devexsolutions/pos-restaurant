<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
    // Rutas solo para administradores
});

Route::middleware(['auth:sanctum', 'role:mesero'])->group(function () {
    // Rutas para meseros
});

Route::middleware(['auth:sanctum'])->group(function () {
    Route::apiResource('tables', TableController::class);
    Route::post('tables/{table}/assign', [TableController::class, 'assignCustomer']);
});

Route::middleware(['auth:sanctum'])->group(function () {
    Route::apiResource('products', ProductController::class);
    Route::apiResource('categories', CategoryController::class);
    Route::apiResource('inventory-items', InventoryItemController::class);
});

Route::middleware(['auth:sanctum'])->group(function () {
    Route::apiResource('orders', OrderController::class);
    Route::post('orders/{order}/items', [OrderController::class, 'addItem']);
    Route::delete('orders/{order}/items/{item}', [OrderController::class, 'removeItem']);
});

Route::middleware(['auth:sanctum'])->group(function () {
    Route::apiResource('transactions', TransactionController::class);
    Route::post('orders/{order}/split-payment', [TransactionController::class, 'splitPayment']);
});

Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('reports/sales', [ReportController::class, 'salesReport']);
    Route::get('reports/inventory', [ReportController::class, 'inventoryReport']);
    Route::get('reports/staff-performance', [ReportController::class, 'staffPerformanceReport']);
    Route::get('reports/top-selling-products', [ReportController::class, 'topSellingProducts']);
});


Route::prefix('v1')->group(function () {
    Route::get('products', [ApiController::class, 'getProducts']);
    Route::post('orders', [ApiController::class, 'createOrder'])->middleware('auth:sanctum');
    Route::get('orders/{orderId}/status', [ApiController::class, 'getOrderStatus'])->middleware('auth:sanctum');
});

Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);
Route::middleware('auth:api')->post('logout', [AuthController::class, 'logout']);

Route::apiResource('reservations', ReservationController::class);
