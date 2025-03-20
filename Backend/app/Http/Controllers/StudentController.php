<?php

namespace App\Http\Controllers;

use App\Models\Student;
use Illuminate\Http\Request;

class StudentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Student::with('user')->get();
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
            'user_id' => 'required|exists:users,id',
            'student_id' => 'required|string|unique:students',
            'program' => 'required|string',
            'semester' => 'required|string',
            'cgpa' => 'nullable|string',
            'academic_status' => 'nullable|string',
            'intervention_plan' => 'nullable|string',
        ]);

        $student = Student::create($request->all());

        return response()->json($student, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Student $student)
    {
        return $student->load('user', 'progress', 'counsellings');
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
    public function update(Request $request, Student $student)
    {
        $request->validate([
            'student_id' => 'string|unique:students,student_id,' . $student->id,
            'program' => 'string',
            'semester' => 'string',
            'cgpa' => 'nullable|string',
            'academic_status' => 'nullable|string',
            'intervention_plan' => 'nullable|string',
        ]);

        $student->update($request->all());

        return $student;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
