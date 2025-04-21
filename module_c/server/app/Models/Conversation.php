<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Conversation extends Model
{
    use HasFactory;
    public const STATUS_AWAITING = 0;
    public const STATUS_SUCCESS = 1;
    protected $fillable = ['user_id', 'status', 'answer'];
}
