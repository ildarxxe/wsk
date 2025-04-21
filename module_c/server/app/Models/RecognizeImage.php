<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RecognizeImage extends Model
{
    use HasFactory;
    protected $fillable = ['user_id', 'status'];

    public const STATUS_WAITING = 0;
    public const STATUS_SUCCESS = 1;

    protected static function booted(): void
    {
        static::creating(function ($model) {
            $model->status = RecognizeImage::STATUS_WAITING;
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
