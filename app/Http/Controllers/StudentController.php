<?php

namespace App\Http\Controllers;

use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\RequestCall;
use App\Models\Mentor;
use Carbon\Carbon;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

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
        // Get the student with their user relationship
        $student = $student->load('user');
        
        // If the student has a user relationship, use the user's email
        if ($student->user) {
            $student->email = $student->user->email;
        }
        
        return $student;
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
        try {
            \Log::info('Update request received:', [
                'student_id' => $student->id,
                'request_data' => $request->all()
            ]);

            // Validate the request data
            $validated = $request->validate([
                'phone' => 'required|string|max:20',
                'address' => 'required|string',
                'date_of_birth' => 'required|date',
                'gender' => 'required|in:male,female,other'
            ]);

            \Log::info('Validation passed, updating data');

            // Update student information
            $updateData = [
                'phone' => $validated['phone'],
                'address' => $validated['address'],
                'date_of_birth' => $validated['date_of_birth'],
                'gender' => $validated['gender']
            ];

            \Log::info('Updating student with data:', $updateData);
            $student->update($updateData);
            \Log::info('Student update successful');

            // Load the updated relationships
            $student->load('user');

            return response()->json([
                'message' => 'Student information updated successfully',
                'student' => $student
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            \Log::error('Validation error:', [
                'errors' => $e->errors(),
                'student_id' => $student->id
            ]);
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            \Log::error('Error updating student:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'student_id' => $student->id
            ]);
            return response()->json([
                'message' => 'Error updating student information',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    public function getModules(Student $student, Request $request)
    {
        try {
            \Log::info('Fetching modules for student:', ['student_id' => $student->id]);

            // First, verify the student exists
            if (!$student) {
                \Log::error('Student not found', ['student_id' => $student->id]);
                return response()->json([
                    'message' => 'Student not found'
                ], 404);
            }

            // Get filter from request, default to 'all'
            $filter = $request->input('filter', 'all');

            // Base query
            $query = "
                SELECT 
                    m.name AS Module_Name,
                    CASE 
                        WHEN COUNT(a.id) = 0 THEN 'N/A' 
                        ELSE ROUND((COUNT(CASE WHEN a.status = 'present' THEN 1 END) / NULLIF(COUNT(a.id), 0)) * 100, 2) 
                    END AS Attendance_Percentage,
                    m.end_date AS Completion_Date,
                    COALESCE(p.result, 'N/A') AS Result,
                    CASE 
                        WHEN CURDATE() BETWEEN m.start_date AND m.end_date THEN 'Ongoing'
                        WHEN CURDATE() < m.start_date THEN 'Upcoming'
                        WHEN CURDATE() > m.end_date THEN 'Completed'
                    END AS Status
                FROM early_intervention.modules m
                LEFT JOIN early_intervention.attendances a 
                    ON m.id = a.module_id AND a.student_id = ?
                LEFT JOIN early_intervention.progress p 
                    ON m.id = p.module_id AND p.student_id = ?
            ";

            // Add WHERE clause based on filter
            switch ($filter) {
                case 'completed':
                    $query .= " WHERE CURDATE() > m.end_date";
                    break;
                case 'ongoing':
                    $query .= " WHERE CURDATE() BETWEEN m.start_date AND m.end_date";
                    break;
                case 'upcoming':
                    $query .= " WHERE CURDATE() < m.start_date";
                    break;
                default:
                    // 'all' - no additional WHERE clause needed
                    break;
            }

            // Add GROUP BY clause
            $query .= " GROUP BY m.id, m.name, m.end_date, p.result, m.start_date";

            // Execute the query
            $modules = DB::select($query, [$student->id, $student->id]);

            \Log::info('Modules fetched successfully', [
                'student_id' => $student->id,
                'module_count' => count($modules),
                'filter' => $filter
            ]);

            if (empty($modules)) {
                \Log::info('No modules found for student', [
                    'student_id' => $student->id,
                    'filter' => $filter
                ]);
                return response()->json([
                    'message' => 'No modules found for this student',
                    'filter' => $filter,
                    'modules' => []
                ]);
            }

            return response()->json([
                'filter' => $filter,
                'modules' => $modules
            ]);
        } catch (\Illuminate\Database\QueryException $e) {
            \Log::error('Database error fetching modules:', [
                'error' => $e->getMessage(),
                'sql' => $e->getSql(),
                'bindings' => $e->getBindings(),
                'student_id' => $student->id,
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'message' => 'Database error while fetching modules',
                'error' => $e->getMessage(),
                'details' => 'Please check if all required tables exist in the early_intervention database.'
            ], 500);
        } catch (\Exception $e) {
            \Log::error('Error fetching module data:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'student_id' => $student->id
            ]);
            return response()->json([
                'message' => 'Error fetching module data',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function testEmail(Request $request)
    {
        try {
            \Log::info('Testing email configuration');
            
            $mentor = \App\Models\Mentor::first();
            if (!$mentor) {
                throw new \Exception('No mentor found for testing');
            }

            // Create a test request
            $testRequest = new \App\Models\RequestCall([
                'student_id' => 1,
                'mentor_id' => $mentor->id,
                'reason' => 'test',
                'preferred_date' => now(),
                'additional_notes' => 'This is a test email',
                'status' => 'Pending'
            ]);

            // Send test notification
            $mentor->notify(new \App\Notifications\NewCounselingRequest($testRequest));

            \Log::info('Test email sent successfully to: ' . $mentor->email);
            
            return response()->json([
                'message' => 'Test email sent successfully',
                'to' => $mentor->email
            ]);
        } catch (\Exception $e) {
            \Log::error('Error sending test email:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'message' => 'Error sending test email',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function submitCounselingRequest(Student $student, Request $request)
    {
        try {
            Log::info('Submitting counseling request', [
                'student_id' => $student->id,
                'request_data' => $request->all()
            ]);

            // Validate the request
            $validated = $request->validate([
                'mentor_id' => 'required|exists:mentors,id',
                'reason' => 'required|string|in:personal_issues,assignment_support,coding_issues',
                'date' => 'required|date|after:today',
                'notes' => 'nullable|string|max:500',
                'student_name' => 'required|string',
                'student_email' => 'required|email'
            ]);

            Log::info('Validation passed, creating counseling request');

            // Create the counseling request using RequestCall model
            $counselingRequest = RequestCall::create([
                'student_id' => $student->id,
                'mentor_id' => $validated['mentor_id'],
                'reason' => $validated['reason'],
                'preferred_date' => $validated['date'],
                'additional_notes' => $validated['notes'] ?? '',
                'status' => 'Pending'
            ]);

            Log::info('Counseling request created', [
                'request_id' => $counselingRequest->id,
                'mentor_id' => $validated['mentor_id']
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Counseling request submitted successfully',
                'data' => $counselingRequest
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('Validation error in counseling request', [
                'errors' => $e->errors(),
                'student_id' => $student->id
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Error submitting counseling request', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'student_id' => $student->id
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to submit counseling request: ' . $e->getMessage()
            ], 500);
        }
    }

    public function statistics()
    {
        try {
            $today = Carbon::now()->format('Y-m-d');
            
            $statistics = DB::select("
                SELECT
                    COUNT(*) AS total_learners,
                    SUM(CASE 
                        WHEN attendance_percent < 75 THEN 1
                        ELSE 0
                    END) AS at_risk_learners,
                    SUM(CASE 
                        WHEN attendance_percent >= 75 THEN 1
                        ELSE 0
                    END) AS on_track_learners
                FROM (
                    SELECT 
                        s.id,
                        ROUND(
                            (SUM(CASE WHEN a.status = 'present' THEN 1 ELSE 0 END) / 
                            (SUM(CASE WHEN a.status = 'present' THEN 1 ELSE 0 END) + SUM(CASE WHEN a.status = 'absent' THEN 1 ELSE 0 END))) * 100, 
                            2
                        ) AS attendance_percent
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
                        s.id
                ) AS subquery
            ", [$today, $today]);

            if (empty($statistics)) {
                return response()->json([
                    'success' => true,
                    'data' => [
                        'total_learners' => 0,
                        'at_risk_learners' => 0,
                        'on_track_learners' => 0
                    ]
                ]);
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'total_learners' => $statistics[0]->total_learners,
                    'at_risk_learners' => $statistics[0]->at_risk_learners,
                    'on_track_learners' => $statistics[0]->on_track_learners
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching statistics: ' . $e->getMessage()
            ], 500);
        }
    }

    public function submitRequest(Request $request, $studentId)
    {
        try {
            $validator = Validator::make($request->all(), [
                'mentor_id' => 'required|exists:mentors,id',
                'date' => 'required|date|after:today',
                'time' => 'required|date_format:H:i',
                'duration' => 'required|integer|min:15|max:120',
                'purpose' => 'required|string|max:255',
                'notes' => 'nullable|string|max:1000',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation error',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Check for existing requests at the same time
            $existingRequest = RequestCall::where('mentor_id', $request->mentor_id)
                ->where('date', $request->date)
                ->where('time', $request->time)
                ->where('status', '!=', 'cancelled')
                ->first();

            if ($existingRequest) {
                return response()->json([
                    'success' => false,
                    'message' => 'This time slot is already requested'
                ], 409);
            }

            // Get student and mentor details
            $student = Student::findOrFail($studentId);
            $mentor = Mentor::findOrFail($request->mentor_id);

            // Create the request
            $requestCall = RequestCall::create([
                'student_id' => $studentId,
                'mentor_id' => $request->mentor_id,
                'date' => $request->date,
                'time' => $request->time,
                'duration' => $request->duration,
                'purpose' => $request->purpose,
                'notes' => $request->notes,
                'status' => 'pending'
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Request submitted successfully',
                'data' => $requestCall
            ]);

        } catch (\Exception $e) {
            Log::error('Error submitting request: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error submitting request: ' . $e->getMessage()
            ], 500);
        }
    }

    public function getRequests($studentId)
    {
        try {
            $requests = RequestCall::where('student_id', $studentId)
                ->with('mentor')
                ->orderBy('date', 'desc')
                ->orderBy('time', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $requests
            ]);

        } catch (\Exception $e) {
            Log::error('Error fetching requests: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error fetching requests: ' . $e->getMessage()
            ], 500);
        }
    }

    public function cancelRequest($studentId, $requestId)
    {
        try {
            $request = RequestCall::where('student_id', $studentId)
                ->where('id', $requestId)
                ->firstOrFail();

            if ($request->status === 'cancelled') {
                return response()->json([
                    'success' => false,
                    'message' => 'Request is already cancelled'
                ], 400);
            }

            $request->update(['status' => 'cancelled']);

            return response()->json([
                'success' => true,
                'message' => 'Request cancelled successfully',
                'data' => $request
            ]);

        } catch (\Exception $e) {
            Log::error('Error cancelling request: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error cancelling request: ' . $e->getMessage()
            ], 500);
        }
    }

    public function getCounselingRequests()
    {
        try {
            Log::info('Attempting to fetch counseling requests');

            $requests = RequestCall::with(['student', 'mentor'])
                ->orderBy('created_at', 'desc')
                ->get();

            Log::info('Successfully fetched counseling requests', [
                'count' => $requests->count()
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Counseling requests retrieved successfully',
                'data' => $requests
            ]);

        } catch (\Exception $e) {
            Log::error('Error fetching counseling requests', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch counseling requests',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
