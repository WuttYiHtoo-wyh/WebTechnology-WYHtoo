<?php

namespace App\Http\Controllers;

use App\Models\Student;
use Illuminate\Http\Request;

class StudentController extends Controller
{
    public function index()
    {
        $students = Student::with('attendance')->get();

        $students->each(function ($student) {
            $totalSessions = $student->attendance->count();
            $presentSessions = $student->attendance->where('status', 'present')->count(); // Use collection where()
            $student->attendance_percentage = $totalSessions > 0 ? ($presentSessions / $totalSessions) * 100 : 0;
        });

        return response()->json($students);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'email' => 'required|email|unique:students,email',
            'enrollment_date' => 'required|date',
            'status' => 'required|in:active,inactive',
        ]);

        $student = Student::create($validated);
        return response()->json($student, 201);
    }

    public function show(Student $student)
    {
        $student->load('attendance');

        $totalSessions = $student->attendance->count();
        $presentSessions = $student->attendance->where('status', 'present')->count(); // Use collection where()
        $student->attendance_percentage = $totalSessions > 0 ? ($presentSessions / $totalSessions) * 100 : 0;

        return $student;
    }

    public function update(Request $request, Student $student)
    {
        $validated = $request->validate([
            'name' => 'string|max:100',
            'email' => 'email|unique:students,email,' . $student->student_id . ',student_id',
            'enrollment_date' => 'date',
            'status' => 'in:active,inactive',
        ]);

        $student->update($validated);
        return response()->json($student);
    }

    public function destroy(Student $student)
    {
        $student->delete();
        return response()->json(null, 204);
    }
}