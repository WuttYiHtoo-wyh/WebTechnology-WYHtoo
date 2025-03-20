<?php

namespace App\Http\Controllers;

use App\Models\Module;
use Illuminate\Http\Request;

class ModuleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Module::with('progress')->get();
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
            'code' => 'required|string|unique:modules',
            'name' => 'required|string',
            'description' => 'required|string',
            'credits' => 'required|integer',
            'semester' => 'required|string',
            'program' => 'required|string',
        ]);

        $module = Module::create($request->all());

        return response()->json($module, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Module $module)
    {
        return $module->load('progress');
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
    public function update(Request $request, Module $module)
    {
        $request->validate([
            'code' => 'string|unique:modules,code,' . $module->id,
            'name' => 'string',
            'description' => 'string',
            'credits' => 'integer',
            'semester' => 'string',
            'program' => 'string',
        ]);

        $module->update($request->all());

        return $module;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Module $module)
    {
        $module->delete();

        return response()->json([
            'message' => 'Module deleted successfully',
        ]);
    }
}
