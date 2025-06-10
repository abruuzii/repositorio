<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Categoria;
use App\Models\CarritoProducto;
use App\Models\PedidoProducto;

class producto extends Model
{
    protected $fillable = [
        'titulo',
        'descripcion',
        'precio',
        'imagen',
        'stock',
    ];

    public function categorias()
    {
        return $this->belongsToMany(Categoria::class, 'categoria_producto', 'producto_id', 'categoria_id');
    }

    public function carritoProductos()
    {
        return $this->hasMany(CarritoProducto::class);
    }

    public function pedidoProductos()
    {
        return $this->hasMany(PedidoProducto::class);
    }
}
