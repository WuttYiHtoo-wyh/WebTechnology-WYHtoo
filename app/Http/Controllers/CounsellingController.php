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
        Log::info('[CounsellingController] Initialized with calendar service');
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        Log::info('[CounsellingController][index] Fetching all counselling sessions');
        try {
            $counsellings = Counselling::with(['student', 'mentor'])->get();
            Log::info('[CounsellingController][index] Successfully retrieved counselling sessions', [
                'count' => $counsellings->count(),
                'timestamp' => now()
            ]);
            return $counsellings;
        } catch (\Exception $e) {
            Log::error('[CounsellingController][index] Failed to fetch counselling sessions', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'timestamp' => now()
            ]);
            throw $e;
        }
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
        Log::info('[CounsellingController][store] Starting counselling session creation', [
            'request_data' => $request->except(['password', 'token'])
        ]);

        try {
            // Validate request
            $validated = $request->validate([
                'student_id' => 'required|exists:students,id',
                'mentor_id' => 'required|exists:users,id',
                'date' => 'required|date',
                'notes' => 'required|string'
            ]);

            DB::beginTransaction();
            try {
                // Generate ticket ID
                $ticketId = 'CL-' . time();

                // Insert counselling record
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
                    throw new \Exception('Failed to create counselling record');
                }

                DB::commit();

                // Try to create calendar event, but don't fail if it doesn't work
                try {
                    if ($this->calendarService && $this->calendarService->isServiceInitialized()) {
                        $startDateTime = Carbon::parse($validated['date'])->setTime(14, 0);
                        $endDateTime = $startDateTime->copy()->addHour();

                        $event = $this->calendarService->createEvent([
                            'summary' => 'StrategyFirst College Counselling Session',
                            'description' => "Counselling session.\nTicket ID: {$ticketId}\nNotes: {$validated['notes']}",
                            'start' => [
                                'dateTime' => $startDateTime->format('c'),
                                'timeZone' => 'Asia/Yangon',
                            ],
                            'end' => [
                                'dateTime' => $endDateTime->format('c'),
                                'timeZone' => 'Asia/Yangon',
                            ]
                        ]);

                        Log::info('[CounsellingController][store] Calendar event created', [
                            'event_id' => $event->getId()
                        ]);
                    }
                } catch (\Exception $calendarError) {
                    // Log calendar error but don't fail the request
                    Log::warning('[CounsellingController][store] Failed to create calendar event', [
                        'error' => $calendarError->getMessage(),
                        'ticket_id' => $ticketId
                    ]);
                }

                return response()->json([
                    'success' => true,
                    'message' => 'Counselling session scheduled successfully',
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
                DB::rollBack();
                throw $e;
            }

        } catch (\Exception $e) {
            Log::error('[CounsellingController][store] Error creating counselling record', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
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
        Log::info('[CounsellingController][statistics] Fetching counselling statistics');
        try {
            $startTime = microtime(true);
            
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

            $endTime = microtime(true);
            $executionTime = ($endTime - $startTime) * 1000; // Convert to milliseconds

            Log::info('[CounsellingController][statistics] Statistics retrieved successfully', [
                'execution_time_ms' => round($executionTime, 2),
                'total_counselling' => $statistics[0]->total_counselling ?? 0,
                'not_yet_completed' => $statistics[0]->not_yet_completed ?? 0,
                'in_progress' => $statistics[0]->in_progress ?? 0,
                'pending' => $statistics[0]->pending ?? 0,
                'resolved' => $statistics[0]->resolved ?? 0,
                'timestamp' => now()
            ]);

            return response()->json([
                'success' => true,
                'data' => [
                    'total_counselling' => $statistics[0]->total_counselling ?? 0,
                    'not_yet_completed' => $statistics[0]->not_yet_completed ?? 0,
                    'in_progress' => $statistics[0]->in_progress ?? 0,
                    'pending' => $statistics[0]->pending ?? 0,
                    'resolved' => $statistics[0]->resolved ?? 0
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('[CounsellingController][statistics] Error fetching statistics', [
                'error_message' => $e->getMessage(),
                'error_code' => $e->getCode(),
                'error_file' => $e->getFile(),
                'error_line' => $e->getLine(),
                'stack_trace' => $e->getTraceAsString(),
                'timestamp' => now()
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Error fetching counselling statistics: ' . $e->getMessage()
            ], 500);
        }
    }
}
