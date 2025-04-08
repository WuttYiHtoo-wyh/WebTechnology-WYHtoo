<?php

namespace App\Http\Controllers;

use App\Models\Solution;
use App\Models\Counselling;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class SolutionController extends Controller
{
    public function store(Request $request)
    {
        try {
            // Log the raw request data
            Log::info('Raw request data:', $request->all());

            // Validate the request
            $validated = $request->validate([
                'counselling_id' => 'required|exists:counselling,id',
                'mentor_id' => 'required|exists:users,id',
                'problem_description' => 'required|string',
                'solution_description' => 'required|string',
                'date_resolved' => 'required|date',
                'status' => 'required|in:Resolved,Pending,In Progress'
            ]);

            // Log the validated data
            Log::info('Validated data:', $validated);

            // Check if counselling exists
            $counselling = Counselling::find($validated['counselling_id']);
            if (!$counselling) {
                Log::error('Counselling not found:', ['counselling_id' => $validated['counselling_id']]);
                return response()->json([
                    'message' => 'Counselling session not found',
                    'counselling_id' => $validated['counselling_id']
                ], 404);
            }

            // Create the solution record
            $solution = Solution::create([
                'counselling_id' => $validated['counselling_id'],
                'mentor_id' => $validated['mentor_id'],
                'problem_description' => $validated['problem_description'],
                'solution_description' => $validated['solution_description'],
                'date_resolved' => $validated['date_resolved'],
                'status' => $validated['status']
            ]);

            // Log the created solution
            Log::info('Solution created:', $solution->toArray());

            // Update the counselling status
            $counselling->update(['status' => $validated['status']]);
            Log::info('Updated counselling status:', [
                'counselling_id' => $counselling->id,
                'new_status' => $validated['status']
            ]);

            return response()->json([
                'message' => 'Solution created successfully',
                'solution' => $solution
            ], 201);

        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('Validation error creating solution:', $e->errors());
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Error creating solution: ' . $e->getMessage());
            Log::error('Stack trace: ' . $e->getTraceAsString());
            return response()->json([
                'message' => 'Failed to create solution',
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ], 500);
        }
    }

    public function getByCounsellingId($counsellingId)
    {
        try {
            $solution = Solution::with(['mentor', 'counselling'])
                ->where('counselling_id', $counsellingId)
                ->first();

            if (!$solution) {
                return response()->json([
                    'message' => 'No solution found for this counselling session'
                ], 404);
            }

            return response()->json($solution);

        } catch (\Exception $e) {
            Log::error('Error fetching solution: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to fetch solution',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $solution = Solution::findOrFail($id);

            $validated = $request->validate([
                'problem_description' => 'string',
                'solution_description' => 'string',
                'date_resolved' => 'date',
                'status' => 'in:Resolved,Pending,In Progress'
            ]);

            $solution->update($validated);

            // Update the counselling status if status is changed
            if (isset($validated['status'])) {
                $solution->counselling->update(['status' => $validated['status']]);
            }

            return response()->json([
                'message' => 'Solution updated successfully',
                'solution' => $solution
            ]);

        } catch (\Exception $e) {
            Log::error('Error updating solution: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to update solution',
                'error' => $e->getMessage()
            ], 500);
        }
    }
} 