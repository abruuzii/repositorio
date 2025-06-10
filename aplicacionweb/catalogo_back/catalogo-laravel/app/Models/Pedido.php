<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pedido extends Model
{
    protected $fillable = [
        'user_id',
        'direccion_id',
        'total',
        'estado', // pendiente, enviado, entregado, cancelado
    ];
     
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function direccion()
    {
        return $this->belongsTo(Direccion::class, 'direccion_id');
    }

    public function pedidoProductos()
    {
        return $this->hasMany(PedidoProducto::class, 'pedido_id');
    }
}
