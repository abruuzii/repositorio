<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductoController;
Use App\Http\Controllers\AuthController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

//Rutas Públicas
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

//Productos
Route::get('/productos', [ProductoController::class, 'index']);
Route::get('/productos/{id}', [ProductoController::class, 'show']);

//Rutas protegidas
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/productos', [ProductoController::class, 'store'])->middleware('is_admin');
    Route::put('/productos/{id}', [ProductoController::class, 'update'])->middleware('is_admin');
    Route::delete('/productos/{id}', [ProductoController::class, 'destroy']);
});
Route::apiResource('productos', ProductoController::class);
