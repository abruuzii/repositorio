<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Producto;

class ProductoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
{
    $productos = Producto::with('categorias:id,nombre')->get();

    return $productos->map(function ($producto) {
        return [
            'id' => $producto->id,
            'titulo' => $producto->titulo,
            'descripcion' => $producto->descripcion,
            'precio' => $producto->precio,
            'imagen' => $producto->imagen,
            'stock' => $producto->stock,
            'categorias' => $producto->categorias->map(function ($cat) {
                return [
                    'id' => $cat->id,
                    'nombre' => $cat->nombre,
                ];
            }),
        ];
    });
}


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
{
    $validated = $request->validate([
        'titulo' => 'required|string|max:255',
        'descripcion' => 'required|string',
        'precio' => 'required|numeric|min:0',
        'imagen' => 'nullable|string',
        'stock' => 'required|integer|min:0',
        'categorias' => 'nullable|array',
        'categorias.*' => 'exists:categorias,id',
    ]);

    $producto = DB::transaction(function () use ($validated, $request) {
        $producto = Producto::create($validated);

        if ($request->has('categorias')) {
            $producto->categorias()->sync($validated['categorias']);
        }

        return $producto;
    });

    return response()->json($producto->load('categorias'), 201);
}


    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $producto = Producto::with('categorias')->findOrFail($id);
        return response()->json($producto);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $producto = Producto::findOrFail($id);
        $validated = $request->validate([
            'titulo' => 'sometimes|required|string|max:255',
            'descripcion' => 'sometimes|required|string',
            'precio' => 'sometimes|required|numeric|min:0',
            'imagen' => 'nullable|string',
            'stock' => 'sometimes|required|integer|min:0',
            'categorias' => 'nullable|array',
            'categorias.*' => 'exists:categorias,id',
        ]);
        $producto = DB::transaction(function () use ($producto, $validated, $request) {
            $producto->update($validated);

            if ($request->has('categorias')) {
                $producto->categorias()->sync($validated['categorias']);
            }
        });
            return response()->json($producto->load('categorias'));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $producto = Producto::findOrFail($id);
        $producto->categorias()->detach();
        $producto->delete();

        return response()->json([
            'message' => 'Producto eliminado correctamente'
        ], 200);
    }
}
