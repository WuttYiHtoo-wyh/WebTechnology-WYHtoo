<?php

namespace App\Http\Controllers;

use App\Models\Counselling;
use Illuminate\Http\Request;

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
        $request->validate([
            'student_id' => 'required|exists:students,id',
            'mentor_id' => 'required|exists:users,id',
            'session_date' => 'required|date',
            'notes' => 'required|string',
            'recommendations' => 'nullable|string',
            'status' => 'required|string|in:scheduled,completed,cancelled',
        ]);

        $counselling = Counselling::create($request->all());

        return response()->json($counselling, 201);
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
