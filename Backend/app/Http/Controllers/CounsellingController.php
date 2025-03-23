<?php

namespace App\Http\Controllers;

use App\Models\Counselling;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class CounsellingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Counselling::with(['student', 'mentor'])->get();
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
                'student_id' => 'required|exists:students,id',
                'mentor_id' => 'required|exists:users,id',
                'date' => 'required|date',
                'notes' => 'required|string'
            ]);

            // Generate a unique ticket ID
            $ticketId = 'TICKET' . strtoupper(Str::random(4));

            // Log the data being inserted
            \Log::info('Creating counselling record with data:', [
                'ticket_id' => $ticketId,
                'student_id' => $request->student_id,
                'mentor_id' => $request->mentor_id,
                'date' => $request->date,
                'notes' => $request->notes
            ]);

            // Use raw query to match the working SQL
            $counselling = DB::table('counselling')->insert([
                'ticket_id' => $ticketId,
                'student_id' => $request->student_id,
                'mentor_id' => $request->mentor_id,
                'date' => $request->date,
                'notes' => $request->notes,
                'created_at' => now(),
                'updated_at' => now()
            ]);

            if (!$counselling) {
                throw new \Exception('Failed to create counselling record');
            }

            return response()->json([
                'message' => 'Counselling session created successfully',
                'ticket_id' => $ticketId
            ], 201);
        } catch (\Illuminate\Database\QueryException $e) {
            \Log::error('Database error while creating counselling: ' . $e->getMessage());
            \Log::error('SQL State: ' . $e->getSqlState());
            \Log::error('Error Code: ' . $e->getCode());
            return response()->json([
                'message' => 'Database error occurred',
                'error' => $e->getMessage(),
                'sql_state' => $e->getSqlState(),
                'error_code' => $e->getCode()
            ], 500);
        } catch (\Exception $e) {
            \Log::error('Error while creating counselling: ' . $e->getMessage());
            return response()->json([
                'message' => 'An error occurred while creating the counselling session',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Counselling $counselling)
    {
        return $counselling->load(['student', 'mentor']);
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
    public function update(Request $request, Counselling $counselling)
    {
        $request->validate([
            'session_date' => 'date',
            'notes' => 'string',
            'recommendations' => 'nullable|string',
            'status' => 'string|in:scheduled,completed,cancelled',
        ]);

        $counselling->update($request->all());

        return $counselling;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Counselling $counselling)
    {
        $counselling->delete();

        return response()->json([
            'message' => 'Counselling session deleted successfully',
        ]);
    }
}
