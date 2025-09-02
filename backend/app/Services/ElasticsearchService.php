<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class ElasticsearchService
{
    protected $baseUrl;
    protected $index;

    public function __construct()
    {
        $this->baseUrl = env('ELASTICSEARCH_HOST', 'http://searcher:9200');
        $this->index = 'customers';
        $this->createIndexIfNotExists();
    }

    protected function createIndexIfNotExists()
    {
        $response = Http::get("{$this->baseUrl}/_cat/indices/{$this->index}");
        
        if ($response->status() === 404) {
            // Create index with mapping
            Http::put("{$this->baseUrl}/{$this->index}", [
                'mappings' => [
                    'properties' => [
                        'id' => ['type' => 'integer'],
                        'first_name' => ['type' => 'text'],
                        'last_name' => ['type' => 'text'],
                        'email' => ['type' => 'keyword'],
                        'contact_number' => ['type' => 'keyword'],
                        'created_at' => ['type' => 'date'],
                        'updated_at' => ['type' => 'date']
                    ]
                ]
            ]);
        }
    }

    public function indexCustomer($customer)
    {
        return Http::put(
            "{$this->baseUrl}/{$this->index}/_doc/{$customer->id}",
            $customer->toArray()
        );
    }

    public function deleteCustomer($customerId)
    {
        return Http::delete("{$this->baseUrl}/{$this->index}/_doc/{$customerId}");
    }

    public function searchCustomers($query)
    {
        $response = Http::post("{$this->baseUrl}/{$this->index}/_search", [
            'query' => [
                'bool' => [
                    'should' => [
                        [
                            'multi_match' => [
                                'query' => $query,
                                'fields' => ['first_name', 'last_name']
                            ]
                        ],
                        [
                            'term' => [
                                'email.keyword' => [
                                    'value' => $query,
                                    'boost' => 2.0
                                ]
                            ]
                        ]
                    ]
                ]
            ]
        ]);

        return $response->json();
    }
}
