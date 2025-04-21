<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function create(RegisterRequest $request): JsonResponse
    {
        $validated = $request->validated();
        if (!$validated) {
            return response()->json(['status' => false, 'error' => 'Validation error'], 400);
        }
        $validated['password'] = Hash::make($validated['password']);
        User::query()->create($validated);
        return response()->json(['status' => true]);
    }

    public function login(LoginRequest $request): JsonResponse {
        $validated = $request->validated();
        if (!$validated) {
            return response()->json(['status' => false, 'error' => 'Validation error'], 400);
        }
        $user = User::query()->where('name', $validated['name'])->first();
        if (!$user) {
            return response()->json(['status' => false, 'error' => 'User not found'], 404);
        }
        if (!Hash::check($validated['password'], $user->password)) {
            return response()->json(['status' => false, 'error' => 'Wrong password'], 400);
        } else {
            $userRes = new UserResource($user);
            return response()->json(['status' => true, 'user' => $userRes, 'token' => $user->token], 201);
        }
    }

    public function logout(Request $request): JsonResponse {
        $user_id = $request->user()->id;
        try {
            User::query()->where('id', $user_id)->delete();
            return response()->json(['status' => true], 201);
        } catch (\Exception $exception) {
            return response()->json(['status' => false, 'error' => $exception->getMessage()], $exception->getCode());
        }
    }

    public function getToken(Request $request): JsonResponse {
        $user_id = $request->user()->id;
        $token = User::query()->where('id', $user_id)->first()->token;
        if (!$token) {
            return response()->json(['status' => false, 'error' => 'User not found'], 404);
        }
        return response()->json(['token' => $token], 201);
    }
}
