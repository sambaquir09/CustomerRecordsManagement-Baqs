<?php

namespace App\Traits;

use App\Services\ElasticsearchService;

trait Searchable
{
    protected static function bootSearchable()
    {
        // Sync with Elasticsearch after create/update
        static::saved(function ($model) {
            $elasticsearch = new ElasticsearchService();
            $elasticsearch->indexCustomer($model);
        });

        // Delete from Elasticsearch after model deletion
        static::deleted(function ($model) {
            $elasticsearch = new ElasticsearchService();
            $elasticsearch->deleteCustomer($model->id);
        });
    }

    public function searchInElasticsearch($query)
    {
        $elasticsearch = new ElasticsearchService();
        return $elasticsearch->searchCustomers($query);
    }
}
