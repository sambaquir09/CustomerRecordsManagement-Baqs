<?php

namespace App\Models;

use App\Traits\Searchable;
use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    use Searchable;

    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'contact_number',
    ];
}
