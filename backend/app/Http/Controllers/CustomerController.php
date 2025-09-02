<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Services\ElasticsearchService;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Validation\Rule;

class CustomerController extends Controller
{
    protected $elasticsearch;

    public function __construct(ElasticsearchService $elasticsearch)
    {
        $this->elasticsearch = $elasticsearch;
    }

    public function index(Request $request)
    {
        try {
            // If search query is provided, use Elasticsearch
            if ($request->has('search')) {
                $searchResults = $this->elasticsearch->searchCustomers($request->search);
                
                // Extract IDs from Elasticsearch results
                $ids = collect($searchResults['hits']['hits'])->pluck('_source.id')->toArray();
                
                if (empty($ids)) {
                    return response()->json([
                        'data' => [],
                        'total' => 0,
                        'message' => 'No customers found matching your search.'
                    ]);
                }
                
                // Get full customer records from database in the same order
                $customers = Customer::whereIn('id', $ids)
                    ->orderByRaw("FIELD(id, " . implode(',', $ids) . ")")
                    ->get();
                    
                return response()->json([
                    'data' => $customers,
                    'total' => $searchResults['hits']['total']['value']
                ]);
            }

            // If no search query, return paginated customers
            $perPage = $request->input('per_page', 10);
            $customers = Customer::paginate($perPage);
            
            return response()->json([
                'data' => $customers->items(),
                'total' => $customers->total(),
                'current_page' => $customers->currentPage(),
                'per_page' => $customers->perPage(),
                'last_page' => $customers->lastPage()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error fetching customers',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $customer = Customer::findOrFail($id);
            return response()->json([
                'data' => $customer,
                'message' => 'Customer retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Customer not found',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'first_name' => 'required|string|max:255',
                'last_name' => 'required|string|max:255',
                'email' => 'required|email|unique:customers,email',
                'contact_number' => 'nullable|string|max:20',
            ]);
            
            $customer = Customer::create($validated);
            
            return response()->json([
                'data' => $customer,
                'message' => 'Customer created successfully'
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error creating customer',
                'error' => $e->getMessage()
            ], 422);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $customer = Customer::findOrFail($id);
            
            $validated = $request->validate([
                'first_name' => 'required|string|max:255',
                'last_name' => 'required|string|max:255',
                'email' => [
                    'required',
                    'email',
                    Rule::unique('customers')->ignore($id)
                ],
                'contact_number' => 'nullable|string|max:20',
            ]);
            
            $customer->update($validated);
            
            return response()->json([
                'data' => $customer,
                'message' => 'Customer updated successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error updating customer',
                'error' => $e->getMessage()
            ], $e instanceof \Illuminate\Database\Eloquent\ModelNotFoundException ? 404 : 422);
        }
    }

    public function destroy($id)
    {
        try {
            $customer = Customer::findOrFail($id);
            $customer->delete();
            
            return response()->json([
                'message' => 'Customer deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error deleting customer',
                'error' => $e->getMessage()
            ], $e instanceof \Illuminate\Database\Eloquent\ModelNotFoundException ? 404 : 500);
        }
    }
}
