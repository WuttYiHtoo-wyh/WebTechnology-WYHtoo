<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Models\Attendance;
use App\Models\Module;
use Illuminate\Http\Request;

class AttendanceController extends Controller
{
    public function getStudentAttendance()
    {
        $students = Student::with(['user', 'module'])->get();
        $attendanceData = [];

        foreach ($students as $student) {
            $totalDays = Attendance::where('student_id', $student->id)->count();
            $presentDays = Attendance::where('student_id', $student->id)
                ->where('status', 'present')
                ->count();
            
            $attendancePercentage = $totalDays > 0 ? ($presentDays / $totalDays) * 100 : 0;
            $status = $attendancePercentage >= 75 ? 'On Track Learner' : 'At Risk Learner';

            $attendanceData[] = [
                'student_id' => $student->student_id,
                'name' => $student->user->name,
                'module_name' => $student->module ? $student->module->name : 'Not Assigned',
                'start_date' => $student->module ? $student->module->start_date : null,
                'end_date' => $student->module ? $student->module->end_date : null,
                'total_days' => $totalDays,
                'present_days' => $presentDays,
                'absent_days' => $totalDays - $presentDays,
                'attendance_percentage' => round($attendancePercentage, 2),
                'status' => $status,
            ];
        }

        return response()->json($attendanceData);
    }
} 