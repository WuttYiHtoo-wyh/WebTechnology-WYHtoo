<?php

namespace App\Http\Controllers;

use App\Models\Progress;
use Illuminate\Http\Request;

class ProgressController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Progress::with(['student', 'module'])->get();
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
            'module_id' => 'required|exists:modules,id',
            'grade' => 'nullable|string',
            'feedback' => 'nullable|string',
            'assessment_date' => 'required|date',
            'status' => 'required|string|in:pending,completed',
        ]);

        $progress = Progress::create($request->all());

        return response()->json($progress, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Progress $progress)
    {
        return $progress->load(['student', 'module']);
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
    public function update(Request $request, Progress $progress)
    {
        $request->validate([
            'grade' => 'nullable|string',
            'feedback' => 'nullable|string',
            'assessment_date' => 'date',
            'status' => 'string|in:pending,completed',
        ]);

        $progress->update($request->all());

        return $progress;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
