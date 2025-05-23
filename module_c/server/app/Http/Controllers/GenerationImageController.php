<?php

namespace App\Http\Controllers;

use App\Models\GenerationImage;
use App\Services\RandomWords;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Random\RandomException;

class GenerationImageController extends Controller
{
    public function create(Request $req): JsonResponse
    {
        $validate = $req->validate([
            'message' => 'required|min:1|string'
        ]);

        if (!$validate) {
            return response()->json(['status' => false, 'message' => 'invalid data'], 400);
        }

        $user_id = $req->user()->id;
        $processes = GenerationImage::query()->where('user_id', $user_id)->where('status', GenerationImage::STATUS_WAITING)->first();
        if ($processes) {
            return response()->json(['status' => false, 'message' => 'Дождитесь текущей генерации изображения', 'current_job_id' => $processes->id], 403);
        }

        try {
            $generation = GenerationImage::query()->create([
                'user_id' => $user_id,
                'image' => ''
            ]);
        } catch (\Throwable $th) {
            return response()->json(['status' => false, 'message' => 'БД легла'], 503);
        }

        return response()->json(['status' => true, 'current_job_id' => $generation->id, 'generate_status' => $generation->getStatusName()], 201);
    }

    /**
     * @throws RandomException
     */
    public function getStatus(Request $req, $id): JsonResponse
    {
        $user_id = $req->user()->id;
        $process = GenerationImage::query()->find($id);
        if (!$process) {
            return response()->json(['status' => false, 'message' => 'process not found'], 404);
        }
        if ($process->user_id !== $user_id) {
            return response()->json(['status' => false, 'message' => 'Нет доступа'], 403);
        }

        if ($process->progress < GenerationImage::PROGRESS_COMPLETED) {
            $process->progress = $process->progress + 10;
            $process->save();
            return response()->json(['status' => true, 'generate_status' => $process->getStatusName(), 'progress' => $process->progress, 'image_url' => $process->image], 200);
        } else {
            $process->status = GenerationImage::STATUS_SUCCESS;
            $process->progress = GenerationImage::PROGRESS_COMPLETED;
            $process->save();
            return response()->json(['status' => true, 'generate_status' => $process->getStatusName(), 'progress' => $process->progress, 'image_url' => $process->image], 200);
        }
    }

    public function getResult(Request $req, $id): JsonResponse
    {
        $user_id = $req->user()->id;
        $process = GenerationImage::query()->find($id);

        if (!$process) {
            return response()->json(['status' => false, 'message' => 'process not found'], 404);
        }
        if ($process->user_id !== $user_id) {
            return response()->json(['status' => false, 'message' => 'Нет доступа'], 403);
        }
        if ($process->status === GenerationImage::STATUS_WAITING) {
            return response()->json(['status' => false, 'message' => 'Дождитесь завершения генерации'], 403);
        }

        return response()->json(['status' => true, 'resource_id' => $process->id, 'image_url' => $process->image]);
    }
}
