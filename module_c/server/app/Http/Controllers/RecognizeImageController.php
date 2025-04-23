<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\RecognizeImage;
use App\Services\RandomWords;
use Random\RandomException;

class RecognizeImageController extends Controller
{
    /**
     * @throws RandomException
     */
    public function recognize(Request $req)
    {
        $validate = $req->validate([
            'image' => 'image|min:1|required'
        ]);
        if (!$validate) {
            return response()->json(['status' => false, 'message' => 'invalid data'], 400);
        }

        $user_id = $req->user()->id;
        $process = RecognizeImage::where('user_id', $user_id)->where('status', RecognizeImage::STATUS_WAITING)->exists();
        if ($process) {
            return response()->json(['status' => false, 'message' => 'Дождитесь текущего распознавания'], 403);
        }
        try {
            $recognize = RecognizeImage::create([
                'user_id' => $user_id
            ]);
        } catch (\Throwable $th) {
            return response()->json(['status' => false, 'message' => $th]);
        }

        $objects = [];
        for ($i = 0; $i < random_int(2,6); $i++) {
            $objects[] = [
                'id' => $i + 1,
                'name' => RandomWords::generateRandomWords(1),
                'probability' => mt_rand(0, mt_getrandmax()) / mt_getrandmax(),
                'bounding_box' => [
                    'x' => random_int(0, 100),
                    'y' => random_int(0, 100),
                    'width' => random_int(0, 100),
                    'height' => random_int(0, 100)
                ]
            ];
        }
        $recognize->status = RecognizeImage::STATUS_SUCCESS;
        $recognize->save();

        return response()->json(['status' => true, 'objects' => $objects]);
    }
}
