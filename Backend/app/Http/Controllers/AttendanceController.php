<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Models\Attendance;
use App\Models\Module;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

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
                    ) AS 'Attendance (%)',
                    m.end_date AS 'Completion Date',
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
                    s.id, s.name, m.name, m.start_date, m.end_date, p.result
            )
            SELECT 
                `Module` AS 'MODULE NAME',
                `Attendance (%)` AS 'ATTENDANCE (%)',
                `Completion Date` AS 'COMPLETION DATE',
                COALESCE(`Result`, 'Pending') AS 'RESULT'
            FROM 
                AttendanceStats
            ORDER BY 
                `Start Date`";

            $results = DB::select($query, [$currentDate, $id]);

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
            \Log::error('Error in getCompletedModules: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error fetching completed modules data'
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
} 