<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'role' => 'required|in:admin,mentor,student',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password),
            'role' => $request->role,
            'phone' => $request->phone,
            'address' => $request->address,
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
        ], 201);
    }

    public function login(Request $request)
    {
        try {
            $request->validate([
                'email' => 'required|email',
                'password' => 'required',
                'role' => 'required|in:admin,mentor,student'
            ]);

            $user = User::where('email', $request->email)
                        ->where('role', $request->role)
                        ->first();

            if (!$user) {
                return response()->json([
                    'message' => 'User not found with the specified email and role.'
                ], 401);
            }

            if ($request->password !== $user->password) {
                return response()->json([
                    'message' => 'Invalid password.'
                ], 401);
            }

            $token = $user->createToken('auth-token')->plainTextToken;

            return response()->json([
                'token' => $token,
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role
                ]
            ]);
        } catch (\Exception $e) {
            \Log::error('Login error: ' . $e->getMessage());
            return response()->json([
                'message' => 'An error occurred during login.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Successfully logged out',
        ]);
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return User::all();
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users',
                'password' => 'required|string|min:8',
                'role' => 'required|in:admin,mentor,student',
                'phone' => 'nullable|string|max:255',
                'address' => 'nullable|string'
            ]);

            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => bcrypt($request->password),
                'role' => $request->role,
                'phone' => $request->phone,
                'address' => $request->address,
            ]);

            return response()->json([
                'message' => 'User created successfully',
                'user' => $user
            ], 201);

        } catch (\Exception $e) {
            \Log::error('Error creating user: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error creating user',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        return $user;
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user)
    {
        try {
            $request->validate([
                'name' => 'string|max:255',
                'email' => 'string|email|max:255|unique:users,email,' . $user->id,
                'role' => 'in:admin,mentor,student',
                'phone' => 'nullable|string|max:20',
                'address' => 'nullable|string',
            ]);

            // Only hash password if it's provided
            if ($request->has('password') && !empty($request->password)) {
                $request->validate(['password' => 'string|min:8']);
                $user->password = bcrypt($request->password);
            }

            $user->fill($request->except('password'));
            $user->save();

            return response()->json([
                'message' => 'User updated successfully',
                'user' => $user
            ]);
        } catch (\Exception $e) {
            \Log::error('Error updating user: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error updating user',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        try {
            $user->delete();
            return response()->json([
                'success' => true,
                'message' => 'User deleted successfully'
            ]);
        } catch (\Exception $e) {
            \Log::error('Error deleting user: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error deleting user',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get all mentors
     */
    public function getMentors()
    {
        $mentors = User::where('role', 'mentor')
            ->select('id', 'name', 'email')
            ->get();
        
        return response()->json($mentors);
    }

    /**
     * Import users from CSV data
     */
    public function import(Request $request)
    {
        try {
            $request->validate([
                'users' => 'required|array',
                'users.*.name' => 'required|string|max:255',
                'users.*.email' => 'required|string|email|max:255',
                'users.*.role' => 'required|in:admin,mentor,student',
                'users.*.phone' => 'nullable|string|max:20',
                'users.*.address' => 'nullable|string',
            ]);

            $imported = 0;
            $errors = [];

            foreach ($request->users as $userData) {
                try {
                    // Check if user already exists
                    $existingUser = User::where('email', $userData['email'])->first();
                    if ($existingUser) {
                        $errors[] = "User with email {$userData['email']} already exists";
                        continue;
                    }

                    // Create new user
                    User::create([
                        'name' => $userData['name'],
                        'email' => $userData['email'],
                        'password' => bcrypt('password123'), // Default password
                        'role' => $userData['role'],
                        'phone' => $userData['phone'] ?? null,
                        'address' => $userData['address'] ?? null,
                    ]);

                    $imported++;
                } catch (\Exception $e) {
                    $errors[] = "Error importing user {$userData['email']}: {$e->getMessage()}";
                }
            }

            return response()->json([
                'success' => true,
                'message' => 'Import completed',
                'imported' => $imported,
                'errors' => $errors
            ]);

        } catch (\Exception $e) {
            \Log::error('Error importing users: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error importing users',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
