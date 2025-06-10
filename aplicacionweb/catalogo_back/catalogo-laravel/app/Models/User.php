<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'rol', // cliente, administrador
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    public function carrito()
    {
        return $this->hasOne(Carrito::class, 'user_id');
    }

    public function pedidos()
    {
        return $this->hasMany(Pedido::class, 'user_id');
    }

    public function direcciones()
    {
        return $this->hasMany(Direccion::class, 'user_id');
    }
}
