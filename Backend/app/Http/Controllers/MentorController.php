<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Support\Facades\Log;

class MentorController extends Controller
{
    public function index()
    {
        $mentors = User::where('role', 'mentor')->get();
        
        // Log the mentor data for debugging
        Log::info('Mentors data:', [
            'mentors' => $mentors->map(function($mentor) {
                return [
                    'id' => $mentor->id,
                    'name' => $mentor->name,
                    'email' => $mentor->email
                ];
            })
        ]);
        
        return $mentors;
    }
} 