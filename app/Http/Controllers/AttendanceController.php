<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Models\Attendance;
use App\Models\Module;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class AttendanceController extends Controller
{
    public function getStudentAttendance(Request $request)
    {
        try {
            $currentDate = now()->format('Y-m-d');
            
            $attendanceData = DB::select("
                SELECT 
                    s.id AS 'Learner ID',
                    s.name AS 'Name',
                    m.name AS 'Module',
                    m.start_date AS 'Start Date',
                    m.end_date AS 'End Date',
                    SUM(CASE WHEN a.status = 'present' THEN 1 ELSE 0 END) AS 'Present Days',
                    SUM(CASE WHEN a.status = 'absent' THEN 1 ELSE 0 END) AS 'Absent Days',
                    ROUND(
                        (SUM(CASE WHEN a.status = 'present' THEN 1 ELSE 0 END) / 
                        (SUM(CASE WHEN a.status = 'present' THEN 1 ELSE 0 END) + SUM(CASE WHEN a.status = 'absent' THEN 1 ELSE 0 END))) * 100, 
                        2
                    ) AS 'Attendance (%)',
                    CASE 
                        WHEN ROUND(
                            (SUM(CASE WHEN a.status = 'present' THEN 1 ELSE 0 END) / 
                            (SUM(CASE WHEN a.status = 'present' THEN 1 ELSE 0 END) + SUM(CASE WHEN a.status = 'absent' THEN 1 ELSE 0 END))) * 100, 
                            2
                        ) < 75 THEN 'At Risk'
                        ELSE 'OnTrack'
                    END AS 'Status'
                FROM 
                    students s
                LEFT JOIN 
                    attendances a ON s.id = a.student_id
                LEFT JOIN 
                    modules m ON a.module_id = m.id
                WHERE 
                    m.start_date <= ? 
                    AND m.end_date >= ?
                GROUP BY 
                    s.id, s.name, m.name, m.start_date, m.end_date
                ORDER BY 
                    s.id, m.start_date
            ", [$currentDate, $currentDate]);

            // Handle division by zero cases
            foreach ($attendanceData as &$record) {
                if (($record->{'Present Days'} + $record->{'Absent Days'}) === 0) {
                    $record->{'Attendance (%)'} = 0;
                    $record->{'Status'} = 'At Risk';
                }
            }

            return response()->json([
                'success' => true,
                'data' => $attendanceData
            ]);
        } catch (\Exception $e) {
            \Log::error('Error fetching student attendance: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch student attendance data',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getCompletedModules($id)
    {
        try {
            Log::info('Fetching completed modules for student ID: ' . $id);
            
            // First, verify the student exists
            $student = Student::find($id);
            if (!$student) {
                Log::warning('Student not found with ID: ' . $id);
                return response()->json([
                    'success' => false,
                    'message' => 'Student not found'
                ], 404);
            }

            $currentDate = now()->format('Y-m-d');
            
            // Using raw SQL with CTE for better readability and performance
            $query = "
                WITH AttendanceStats AS (
                    SELECT 
                        s.id AS 'Learner ID',
                        s.name AS 'Name',
                        m.name AS 'Module',
                        m.start_date AS 'Start Date',
                        m.end_date AS 'End Date',
                        ROUND(
                            (SUM(CASE WHEN a.status = 'present' THEN 1 ELSE 0 END) / 
                            NULLIF(SUM(CASE WHEN a.status = 'present' THEN 1 ELSE 0 END) + 
                                  SUM(CASE WHEN a.status = 'absent' THEN 1 ELSE 0 END), 0)) * 100, 
                            2
                        ) AS 'Attendance (%)',
                        COALESCE(p.completion_date, m.end_date) AS 'Completion Date',
                        p.result AS 'Result'
                    FROM 
                        students s
                    LEFT JOIN 
                        attendances a ON s.id = a.student_id
                    LEFT JOIN 
                        modules m ON a.module_id = m.id
                    LEFT JOIN 
                        progress p ON s.id = p.student_id AND m.id = p.module_id
                    WHERE 
                        m.end_date < ?
                        AND s.id = ?
                    GROUP BY 
                        s.id, s.name, m.name, m.start_date, m.end_date, p.completion_date, p.result
                )
                SELECT 
                    `Module` AS 'MODULE NAME',
                    `Attendance (%)` AS 'ATTENDANCE (%)',
                    `Completion Date` AS 'COMPLETION DATE',
                    `Result` AS 'RESULT'
                FROM 
                    AttendanceStats
                ORDER BY 
                    `Start Date`
            ";

            $results = DB::select($query, [$currentDate, $id]);

            Log::info('Query executed successfully. Found ' . count($results) . ' modules.');

            if (empty($results)) {
                return response()->json([
                    'success' => true,
                    'data' => [],
                    'message' => 'No completed modules found for this student'
                ]);
            }

            return response()->json([
                'success' => true,
                'data' => $results
            ]);

        } catch (\Exception $e) {
            Log::error('Error in getCompletedModules: ' . $e->getMessage());
            Log::error('Stack trace: ' . $e->getTraceAsString());
            return response()->json([
                'success' => false,
                'message' => 'Error fetching completed modules data',
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ], 500);
        }
    }

    public function getOngoingModules($id)
    {
        try {
            $currentDate = now()->format('Y-m-d');
            
            $query = "WITH AttendanceStats AS (
                SELECT 
                    s.id AS 'Learner ID',
                    s.name AS 'Name',
                    m.name AS 'Module',
                    m.start_date AS 'Start Date',
                    m.end_date AS 'End Date',
                    ROUND(
                        (SUM(CASE WHEN a.status = 'present' THEN 1 ELSE 0 END) / 
                        NULLIF(SUM(CASE WHEN a.status = 'present' THEN 1 ELSE 0 END) + SUM(CASE WHEN a.status = 'absent' THEN 1 ELSE 0 END), 0)) * 100, 
                        2
                    ) AS 'Attendance (%)'
                FROM 
                    students s
                LEFT JOIN 
                    attendances a ON s.id = a.student_id
                LEFT JOIN 
                    modules m ON a.module_id = m.id
                WHERE 
                    m.start_date <= ? 
                    AND m.end_date >= ?
                    AND s.id = ?
                GROUP BY 
                    s.id, s.name, m.name, m.start_date, m.end_date
            )
            SELECT 
                `Module` AS 'MODULE NAME',
                `Attendance (%)` AS 'ATTENDANCE (%)',
                `End Date` AS 'COMPLETION DATE',
                'Pending' AS 'RESULT'
            FROM 
                AttendanceStats
            ORDER BY 
                `Start Date`";

            $results = DB::select($query, [$currentDate, $currentDate, $id]);

            if (empty($results)) {
                return response()->json([
                    'success' => true,
                    'data' => [],
                    'message' => 'No ongoing modules found for this student'
                ]);
            }

            return response()->json([
                'success' => true,
                'data' => $results
            ]);

        } catch (\Exception $e) {
            \Log::error('Error in getOngoingModules: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error fetching ongoing modules data'
            ], 500);
        }
    }

    public function getUpcomingModules($id)
    {
        try {
            $currentDate = now()->format('Y-m-d');
            
            $query = "SELECT 
                m.name AS 'MODULE NAME',
                0 AS 'ATTENDANCE (%)',
                m.end_date AS 'COMPLETION DATE',
                'Pending' AS 'RESULT'
            FROM 
                students s
            CROSS JOIN 
                modules m
            WHERE 
                m.start_date > ?
                AND s.id = ?
            ORDER BY 
                m.start_date";

            $results = DB::select($query, [$currentDate, $id]);

            if (empty($results)) {
                return response()->json([
                    'success' => true,
                    'data' => [],
                    'message' => 'No upcoming modules found for this student'
                ]);
            }

            return response()->json([
                'success' => true,
                'data' => $results
            ]);

        } catch (\Exception $e) {
            \Log::error('Error in getUpcomingModules: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error fetching upcoming modules data'
            ], 500);
        }
    }

    public function getCompletedModulesWithDetails($studentId)
    {
        try {
            Log::info('Fetching completed modules details for student ID: ' . $studentId);
            
            // First, verify the student exists
            $student = Student::find($studentId);
            if (!$student) {
                Log::warning('Student not found with ID: ' . $studentId);
                return response()->json([
                    'success' => false,
                    'message' => 'Student not found'
                ], 404);
            }

            // Get completed modules with detailed statistics
            $completedModules = DB::select("
                WITH ModuleStats AS (
                    SELECT 
                        m.id,
                        m.name,
                        m.start_date,
                        m.end_date,
                        COUNT(DISTINCT a.id) as total_attendance,
                        COUNT(DISTINCT CASE WHEN a.status = 'present' THEN a.id END) as present_count,
                        MAX(p.grade) as grade
                    FROM modules m
                    LEFT JOIN attendances a ON m.id = a.module_id AND a.student_id = ?
                    LEFT JOIN progress p ON m.id = p.module_id AND p.student_id = ?
                    WHERE m.end_date < CURDATE()
                    GROUP BY m.id, m.name, m.start_date, m.end_date
                )
                SELECT 
                    name AS Module_Name,
                    CASE 
                        WHEN total_attendance = 0 THEN 'N/A'
                        ELSE ROUND((present_count / NULLIF(total_attendance, 0)) * 100, 2)
                    END AS Attendance_Percentage,
                    end_date AS Completion_Date,
                    COALESCE(grade, 'N/A') AS Result,
                    CASE 
                        WHEN CURDATE() BETWEEN start_date AND end_date THEN 'Ongoing'
                        WHEN CURDATE() < start_date THEN 'Upcoming'
                        WHEN CURDATE() > end_date THEN 'Completed'
                    END AS Status
                FROM ModuleStats
                ORDER BY end_date DESC
            ", [$studentId, $studentId]);

            Log::info('Completed modules query executed successfully. Found ' . count($completedModules) . ' modules.');

            if (empty($completedModules)) {
                return response()->json([
                    'success' => true,
                    'data' => [],
                    'message' => 'No completed modules found for this student'
                ]);
            }

            return response()->json([
                'success' => true,
                'data' => $completedModules
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching completed modules details: ' . $e->getMessage());
            Log::error('Stack trace: ' . $e->getTraceAsString());
            return response()->json([
                'success' => false,
                'message' => 'Error fetching completed modules details',
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ], 500);
        }
    }
} 