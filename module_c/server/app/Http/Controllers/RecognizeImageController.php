<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Models\RecognizeImage;
use App\Services\RandomWords;
use Illuminate\Support\Facades\Storage;
use Random\RandomException;

class RecognizeImageController extends Controller
{
    /**
     * @throws RandomException
     */
    public function recognize(Request $req): JsonResponse
    {
        $validate = $req->validate([
            'image' => 'image|min:1|required'
        ]);
        if (!$validate) {
            return response()->json(['status' => false, 'message' => 'invalid data'], 400);
        }

        $user_id = $req->user()->id;
        $process = RecognizeImage::query()->where('user_id', $user_id)->where('status', RecognizeImage::STATUS_WAITING)->first();
        if ($process) {
            return response()->json(['status' => false, 'message' => 'Дождитесь текущего распознавания', 'job_id' => $process->id], 403);
        }
        try {
            $recognize = RecognizeImage::query()->create([
                'user_id' => $user_id
            ]);
        } catch (\Throwable $th) {
            return response()->json(['status' => false, 'message' => $th]);
        }

        $image = $req->file('image');
        $image_from_storage = $image->store('public/rec_images');
        $image_path = Storage::url($image_from_storage);

        $image_size = getimagesize($image);
        $IMAGE_WIDTH = $image_size[0];
        $IMAGE_HEIGHT = $image_size[1];

        $objects = [];
        for ($i = 0; $i < random_int(2,6); $i++) {
            $prob = mt_rand(0, mt_getrandmax()) / mt_getrandmax();
            $objects[] = [
                'id' => $i + 1,
                'name' => RandomWords::generateRandomWords(random_int(1,2)),
                'probability' => str_split($prob, 4)[0],
                'bounding_box' => [
                    'x' => random_int(0, $IMAGE_WIDTH),
                    'y' => random_int(0, $IMAGE_HEIGHT),
                    'width' => random_int(1, $IMAGE_WIDTH),
                    'height' => random_int(1, $IMAGE_HEIGHT)
                ]
            ];
        }

        $recognize->status = RecognizeImage::STATUS_SUCCESS;
        $recognize->save();

        return response()->json(['status' => true, 'img_path' => 'http://127.0.0.1:8000' . $image_path, 'objects' => $objects, 'size' => [
            'width' => $IMAGE_WIDTH,
            'height' => $IMAGE_HEIGHT
        ]]);
    }
}
