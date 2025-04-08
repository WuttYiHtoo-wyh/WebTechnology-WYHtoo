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
use App\Notifications\CounsellingSessionCreated;
use Carbon\Carbon;

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
            Log::info('Creating new counselling record', ['request' => $request->all()]);
            
            // Validate the request data
            $validated = $request->validate([
                'student_id' => 'required|exists:students,id',
                'mentor_id' => 'required|exists:users,id',
                'date' => 'required|date',
                'notes' => 'required|string'
            ]);

            // Get student and mentor details
            $student = Student::find($validated['student_id']);
            $mentor = User::find($validated['mentor_id']);

            if (!$student || !$mentor) {
                throw new \Exception('Student or mentor not found');
            }

            // Generate ticket ID in the format "CL-{timestamp}"
            $ticketId = 'CL-' . time();

            // Insert the counselling record
            $counselling = DB::table('counselling')->insert([
                'ticket_id' => $ticketId,
                'learner_id' => $validated['student_id'],
                'mentor_id' => $validated['mentor_id'],
                'date' => $validated['date'],
                'notes' => $validated['notes'],
                'created_at' => now(),
                'updated_at' => now()
            ]);

            if (!$counselling) {
                Log::error('Failed to create counselling record');
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to create counselling record'
                ], 500);
            }

            // Create Google Calendar event
            if ($this->calendarService && $this->calendarService->isServiceInitialized()) {
                try {
                    // Convert date string to Carbon instance and set to 2pm
                    $startDateTime = Carbon::parse($validated['date'])->setTime(14, 0); // Set to 2:00 PM
                    $endDateTime = $startDateTime->copy()->addHour(); // Add 1 hour

                    Log::info('Creating calendar event with attendees:', [
                        'student_email' => $student->email,
                        'mentor_email' => $mentor->email,
                        'ticket_id' => $ticketId,
                        'date' => $startDateTime->format('Y-m-d H:i:s'),
                        'timezone' => 'Asia/Yangon'
                    ]);

                    $event = $this->calendarService->createEvent([
                        'summary' => 'StrategyFirst College Counselling Center - StrategyFirst College Counselling Session',
                        'description' => "Counselling session for {$student->name} with {$mentor->name}.\nTicket ID: {$ticketId}\nNotes: {$validated['notes']}",
                        'start' => [
                            'dateTime' => $startDateTime->format('c'),
                            'timeZone' => 'Asia/Yangon', // GMT+6:30
                        ],
                        'end' => [
                            'dateTime' => $endDateTime->format('c'),
                            'timeZone' => 'Asia/Yangon', // GMT+6:30
                        ],
                        'attendees' => [
                            ['email' => $student->email],
                            ['email' => $mentor->email],
                        ],
                        'reminders' => [
                            'useDefault' => false,
                            'overrides' => [
                                ['method' => 'email', 'minutes' => 24 * 60], // 24 hours before
                                ['method' => 'email', 'minutes' => 60], // 1 hour before
                            ],
                        ],
                        'guestsCanSeeOtherGuests' => true,
                        'guestsCanModify' => false,
                        'transparency' => 'opaque',
                        'visibility' => 'public',
                        'sendUpdates' => 'all',
                        'sendNotifications' => true,
                    ]);

                    if ($event) {
                        Log::info('Calendar event created successfully', [
                            'event_id' => $event->getId(),
                            'html_link' => $event->htmlLink,
                            'attendees' => array_map(function($attendee) {
                                return [
                                    'email' => $attendee->getEmail(),
                                    'response_status' => $attendee->getResponseStatus()
                                ];
                            }, $event->getAttendees()),
                            'organizer' => $event->getOrganizer() ? [
                                'email' => $event->getOrganizer()->getEmail(),
                                'display_name' => $event->getOrganizer()->getDisplayName()
                            ] : null
                        ]);
                    } else {
                        Log::error('Failed to create Google Calendar event', [
                            'student_email' => $student->email,
                            'mentor_email' => $mentor->email,
                            'error' => 'No event object returned'
                        ]);
                    }
                } catch (\Exception $e) {
                    Log::error('Error creating calendar event: ' . $e->getMessage());
                    Log::error('Stack trace: ' . $e->getTraceAsString());
                }
            } else {
                Log::error('Calendar service not initialized');
            }

            Log::info('Counselling record created successfully', [
                'ticket_id' => $ticketId,
                'student_id' => $validated['student_id']
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Counselling record created successfully',
                'data' => [
                    'ticket_id' => $ticketId,
                    'display_ticket_id' => $ticketId,
                    'learner_id' => $validated['student_id'],
                    'mentor_id' => $validated['mentor_id'],
                    'date' => $validated['date'],
                    'notes' => $validated['notes']
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Error creating counselling record: ' . $e->getMessage());
            Log::error('Stack trace: ' . $e->getTraceAsString());
            return response()->json([
                'success' => false,
                'message' => 'Error creating counselling record',
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
            'date' => 'date',
            'notes' => 'string'
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
            Log::info('Fetching counselling sessions for student', ['student_id' => $id]);
            
            // Use direct database query with exact column names
            $counsellings = DB::table('counselling')
                ->where('learner_id', $id)
                ->select([
                    'id',
                    'ticket_id',
                    'learner_id',
                    'mentor_id',
                    'date',
                    'notes',
                    'created_at',
                    'updated_at'
                ])
                ->orderBy('date', 'desc')
                ->get();

            if ($counsellings->isEmpty()) {
                Log::info('No counselling sessions found for student', ['student_id' => $id]);
                return response()->json([], 200);
            }

            // Transform the data to include mentor name
            $transformedCounsellings = $counsellings->map(function($counselling) {
                // Get mentor name
                $mentor = DB::table('users')
                    ->where('id', $counselling->mentor_id)
                    ->select('name')
                    ->first();

                // Format ticket ID consistently
                $ticketId = $counselling->ticket_id;
                if (strpos($ticketId, 'COUNSEL-') === 0 || strpos($ticketId, 'TICKET-') === 0) {
                    // Convert old format to new format
                    $timestamp = time() - rand(1000, 9999); // Use a random offset to create unique timestamps
                    $ticketId = 'CL-' . $timestamp;
                    
                    // Update the database with new format
                    DB::table('counselling')
                        ->where('id', $counselling->id)
                        ->update(['ticket_id' => $ticketId]);
                }

                return [
                    'id' => $counselling->id,
                    'ticket_id' => $ticketId,
                    'display_ticket_id' => $ticketId,
                    'learner_id' => $counselling->learner_id,
                    'mentor_id' => $counselling->mentor_id,
                    'mentor_name' => $mentor ? $mentor->name : 'Unknown Mentor',
                    'date' => $counselling->date,
                    'notes' => $counselling->notes,
                    'created_at' => $counselling->created_at,
                    'updated_at' => $counselling->updated_at
                ];
            });

            Log::info('Successfully fetched counselling sessions', [
                'student_id' => $id,
                'count' => $transformedCounsellings->count()
            ]);

            return response()->json($transformedCounsellings);
        } catch (\Exception $e) {
            Log::error('Error fetching counselling sessions', [
                'student_id' => $id,
                'error' => $e->getMessage(),
                'stack_trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'message' => 'Error fetching counselling sessions',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function overview(Request $request)
    {
        try {
            $ticketId = $request->query('ticket_id');
            
            $query = "
                SELECT 
                    c.id AS counselling_id,
                    c.ticket_id,
                    s.name AS learner_name,
                    m.name AS mentor_name,
                    c.date AS counselling_date,
                    c.notes,
                    c.created_at AS counselling_created_at,
                    c.updated_at AS counselling_updated_at,
                    sol.problem_description,
                    sol.solution_description,
                    sol.date_resolved,
                    IFNULL(sol.status, 'Not yet completed') AS solution_status
                FROM counselling c
                LEFT JOIN students s ON c.learner_id = s.id
                LEFT JOIN mentors m ON c.mentor_id = m.id
                LEFT JOIN solutions sol ON c.id = sol.counselling_id
            ";

            if ($ticketId) {
                $query .= " WHERE c.ticket_id LIKE ?";
                $counsellings = DB::select($query, ["%{$ticketId}%"]);
            } else {
                $query .= " ORDER BY c.date DESC";
                $counsellings = DB::select($query);
            }

            if (empty($counsellings)) {
                return response()->json([
                    'success' => true,
                    'data' => []
                ]);
            }

            return response()->json([
                'success' => true,
                'data' => $counsellings
            ]);

        } catch (\Exception $e) {
            Log::error('Error fetching counselling overview: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error fetching counselling overview: ' . $e->getMessage()
            ], 500);
        }
    }

    public function statistics()
    {
        try {
            $statistics = DB::select("
                SELECT 
                    COUNT(*) AS total_counselling,
                    SUM(CASE WHEN IFNULL(s.status, 'Not yet completed') = 'Not yet completed' THEN 1 ELSE 0 END) AS not_yet_completed,
                    SUM(CASE WHEN IFNULL(s.status, 'Not yet completed') = 'in progress' THEN 1 ELSE 0 END) AS in_progress,
                    SUM(CASE WHEN IFNULL(s.status, 'Not yet completed') = 'pending' THEN 1 ELSE 0 END) AS pending,
                    SUM(CASE WHEN IFNULL(s.status, 'Not yet completed') = 'resolved' THEN 1 ELSE 0 END) AS resolved
                FROM counselling c
                LEFT JOIN solutions s ON c.id = s.counselling_id
            ");

            if (empty($statistics)) {
                return response()->json([
                    'success' => true,
                    'data' => [
                        'total_counselling' => 0,
                        'not_yet_completed' => 0,
                        'in_progress' => 0,
                        'pending' => 0,
                        'resolved' => 0
                    ]
                ]);
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'total_counselling' => $statistics[0]->total_counselling,
                    'not_yet_completed' => $statistics[0]->not_yet_completed,
                    'in_progress' => $statistics[0]->in_progress,
                    'pending' => $statistics[0]->pending,
                    'resolved' => $statistics[0]->resolved
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Error fetching counselling statistics: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error fetching counselling statistics: ' . $e->getMessage()
            ], 500);
        }
    }
}
