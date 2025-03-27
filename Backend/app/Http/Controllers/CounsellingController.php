<?php

namespace App\Http\Controllers;

use App\Models\Counselling;
use App\Models\Student;
use App\Models\User;
use App\Services\CalendarService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class CounsellingController extends Controller
{
    protected $calendarService;

    public function __construct(CalendarService $calendarService)
    {
        $this->calendarService = $calendarService;
    }

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
            // Validate the request
            $validated = $request->validate([
                'student_id' => 'required|exists:students,id',
                'mentor_id' => 'required|exists:users,id',
                'date' => 'required|date',
                'notes' => 'required|string',
            ]);

            // Generate a unique ticket ID
            $ticketId = 'TICKET' . Str::random(4);

            // Get student and mentor details from students table
            $student = Student::find($validated['student_id']);
            $mentor = User::find($validated['mentor_id']);

            if (!$student) {
                throw new \Exception('Student not found in students table');
            }

            if (!$mentor) {
                throw new \Exception('Mentor not found in users table');
            }

            // Log raw data
            Log::info('Raw request data:', [
                'student_id' => $validated['student_id'],
                'mentor_id' => $validated['mentor_id'],
                'request_data' => $request->all()
            ]);

            // Log user details
            Log::info('User details:', [
                'student' => [
                    'id' => $student->id,
                    'name' => $student->name,
                    'email' => $student->email,
                    'raw_data' => $student->toArray()
                ],
                'mentor' => [
                    'id' => $mentor->id,
                    'name' => $mentor->name,
                    'email' => $mentor->email,
                    'raw_data' => $mentor->toArray()
                ]
            ]);

            // Validate email addresses
            if (!filter_var($student->email, FILTER_VALIDATE_EMAIL)) {
                Log::error('Invalid student email:', ['email' => $student->email]);
                throw new \Exception('Invalid student email address');
            }

            if (!filter_var($mentor->email, FILTER_VALIDATE_EMAIL)) {
                Log::error('Invalid mentor email:', ['email' => $mentor->email]);
                throw new \Exception('Invalid mentor email address');
            }

            // Log the email addresses being used
            Log::info('Creating counselling with emails:', [
                'student_email' => $student->email,
                'mentor_email' => $mentor->email,
                'student_name' => $student->name,
                'mentor_name' => $mentor->name
            ]);

            // Create the counselling record
            $counselling = Counselling::create([
                'ticket_id' => $ticketId,
                'student_id' => $validated['student_id'],
                'mentor_id' => $validated['mentor_id'],
                'date' => $validated['date'],
                'notes' => $validated['notes'],
            ]);

            // Create calendar event
            $eventCreated = false;
            try {
                $calendarService = new CalendarService();
                
                // Use email addresses
                $studentEmail = $student->email;
                $mentorEmail = $mentor->email;
                
                Log::info('Creating calendar event with emails:', [
                    'student_email' => $studentEmail,
                    'mentor_email' => $mentorEmail,
                    'attendees_array' => [$studentEmail, $mentorEmail]
                ]);
                
                $eventId = $calendarService->createEvent(
                    'StrategyFirst College Counselling Session - ' . $ticketId,
                    "Counselling session for {$student->name} with {$mentor->name}.\n\nNotes: {$validated['notes']}",
                    $validated['date'] . "T09:00:00", // Start at 9 AM
                    $validated['date'] . "T10:00:00", // End at 10 AM
                    [$studentEmail, $mentorEmail]
                );

                if ($eventId) {
                    $eventCreated = true;
                    Log::info('Calendar event created successfully for counselling ticket: ' . $counselling->ticket_id);
                } else {
                    Log::error('Failed to create calendar event for counselling ticket: ' . $counselling->ticket_id);
                }
            } catch (\Exception $e) {
                Log::error('Error creating calendar event: ' . $e->getMessage());
                Log::error('Stack trace: ' . $e->getTraceAsString());
            }

            return response()->json([
                'message' => 'Counselling record created successfully',
                'ticket_id' => $counselling->ticket_id,
                'event_created' => $eventCreated
            ], 201);

        } catch (\Exception $e) {
            Log::error('Error creating counselling record: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to create counselling record',
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

    /**
     * Get counselling sessions for a specific student
     */
    public function getStudentCounselling($id)
    {
        try {
            $counsellings = Counselling::where('student_id', $id)
                ->with(['mentor'])
                ->get();

            if ($counsellings->isEmpty()) {
                return response()->json([], 404);
            }

            return response()->json($counsellings);
        } catch (\Exception $e) {
            Log::error('Error fetching student counselling sessions: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to fetch counselling sessions',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
