<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use App\Models\RequestCall;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Mentor;
use Illuminate\Support\Facades\Validator;

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

    public function getStudentAttendanceStats()
    {
        try {
            $stats = DB::select("
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
            ", [now()->format('Y-m-d'), now()->format('Y-m-d')]);

            return response()->json([
                'success' => true,
                'data' => $stats
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching student attendance stats: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error fetching student attendance statistics',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getCounselingRequests($mentorId)
    {
        try {
            // Find the mentor by ID
            $mentor = User::find($mentorId);
            
            if (!$mentor) {
                \Log::warning('Mentor not found:', ['mentor_id' => $mentorId]);
                return response()->json([
                    'success' => false,
                    'message' => 'Mentor not found'
                ], 404);
            }

            // Log the mentor data for debugging
            \Log::info('Mentor data:', [
                'id' => $mentor->id,
                'name' => $mentor->name,
                'email' => $mentor->email,
                'role' => $mentor->role,
                'raw_role' => $mentor->getRawOriginal('role')
            ]);

            // Verify the user is a mentor (case-insensitive check)
            if (strtolower(trim($mentor->role)) !== 'mentor') {
                \Log::warning('User role check failed:', [
                    'user_id' => $mentor->id,
                    'role' => $mentor->role,
                    'trimmed_role' => trim($mentor->role),
                    'lowercase_role' => strtolower(trim($mentor->role))
                ]);
                
                return response()->json([
                    'success' => false,
                    'message' => 'User is not a mentor',
                    'debug' => [
                        'role' => $mentor->role,
                        'trimmed_role' => trim($mentor->role),
                        'lowercase_role' => strtolower(trim($mentor->role))
                    ]
                ], 403);
            }

            // Get counseling requests for this mentor
            $requests = RequestCall::where('mentor_id', $mentor->id)
                ->with(['student', 'mentor'])
                ->orderBy('created_at', 'desc')
                ->get();

            \Log::info('Found counseling requests:', [
                'mentor_id' => $mentor->id,
                'request_count' => $requests->count()
            ]);

            return response()->json([
                'success' => true,
                'requests' => $requests
            ]);
        } catch (\Exception $e) {
            \Log::error('Error fetching counseling requests: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch counseling requests',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getAvailableSlots(Request $request, $mentorId)
    {
        try {
            $validator = Validator::make($request->all(), [
                'date' => 'required|date|after:today'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation error',
                    'errors' => $validator->errors()
                ], 422);
            }

            $mentor = Mentor::findOrFail($mentorId);
            $date = $request->date;

            // Get all slots for the date
            $allSlots = $this->generateTimeSlots($date, $mentor->availability);

            // Get booked slots
            $bookedSlots = RequestCall::where('mentor_id', $mentorId)
                ->where('date', $date)
                ->where('status', '!=', 'cancelled')
                ->pluck('time')
                ->toArray();

            // Filter out booked slots
            $availableSlots = array_diff($allSlots, $bookedSlots);

            Log::info('Available slots retrieved', [
                'mentor_id' => $mentorId,
                'date' => $date,
                'available_slots' => $availableSlots
            ]);

            return response()->json([
                'success' => true,
                'data' => array_values($availableSlots)
            ]);

        } catch (\Exception $e) {
            Log::error('Error fetching available slots: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error fetching available slots: ' . $e->getMessage()
            ], 500);
        }
    }

    public function updateRequestStatus(Request $request, $mentorId, $requestId)
    {
        try {
            $validator = Validator::make($request->all(), [
                'status' => 'required|in:accepted,rejected,cancelled'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation error',
                    'errors' => $validator->errors()
                ], 422);
            }

            $requestCall = RequestCall::where('mentor_id', $mentorId)
                ->where('id', $requestId)
                ->firstOrFail();

            $requestCall->update(['status' => $request->status]);

            Log::info('Request status updated', [
                'request_id' => $requestId,
                'mentor_id' => $mentorId,
                'new_status' => $request->status
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Request status updated successfully',
                'data' => $requestCall
            ]);

        } catch (\Exception $e) {
            Log::error('Error updating request status: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error updating request status: ' . $e->getMessage()
            ], 500);
        }
    }

    private function generateTimeSlots($date, $availability)
    {
        // Implementation of time slot generation
        // This is just a placeholder - implement according to your needs
        return ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];
    }
} 