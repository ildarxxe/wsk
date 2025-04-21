<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GenerationImage extends Model
{
    use HasFactory;
    protected $fillable = ['user_id', 'status', 'image'];
    public const STATUS_WAITING = 0;
    public const STATUS_SUCCESS = 1;
    public const ANSWER_MAX_LENGTH = 256;

    protected static function booted(): void
    {
        static::creating(function ($model) {
            $model->status = GenerationImage::STATUS_WAITING;
        });
    }

    public function getStatusName(): string
    {
        return match ($this->status) {
            self::STATUS_WAITING => 'Ожидание',
            self::STATUS_SUCCESS => 'Успешно'
        };
    }
}
