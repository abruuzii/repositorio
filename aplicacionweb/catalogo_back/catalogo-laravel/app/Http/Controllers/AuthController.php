<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User; // corregido
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => 'cliente',
        ]);

        return response()->json($user, 201);
    }

    public function login(Request $request)
{
    $credentials = $request->validate([
        'email' => 'required|string|email',
        'password' => 'required',
    ]);

    if (!Auth::attempt($credentials)) {
        return response()->json([
            'message' => 'Credenciales inválidas',
        ], 401);
    }

    $user = Auth::user();
    $token = $user->createToken('auth_token')->plainTextToken;

    return response()->json([
        'user' => $user,
        'token' => $token,
        'token_type' => 'Bearer',
    ]);
}

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Sesión cerrada correctamente'], 200);
    }



}
