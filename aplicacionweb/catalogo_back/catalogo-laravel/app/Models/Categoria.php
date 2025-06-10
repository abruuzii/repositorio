<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Producto;

class Categoria extends Model
{
    protected $fillable = [
        'nombre',
        'descripcion',
        'slug',

    ];

    public function productos()
    {
        return $this->belongsToMany(Producto::class, 'categoria_producto', 'categoria_id', 'producto_id');
    }
}