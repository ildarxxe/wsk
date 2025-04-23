<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class GenerationImage extends Model
{
    use HasFactory;
    protected $fillable = ['user_id', 'status', 'image'];
    public const STATUS_WAITING = 0;
    public const STATUS_SUCCESS = 1;
    public const PROGRESS_COMPLETED = 100;

    protected static function booted(): void
    {
        static::creating(function ($model) {
            $model->status = GenerationImage::STATUS_WAITING;
            $model->progress = 0;
            $model->image = Storage::url('uploads/MainBefore.jpg');
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
