<?php

namespace App\Http\Controllers;

use App\Models\Conversation;
use App\Services\RandomWords;
use Illuminate\Http\Request;

class ConversationController extends Controller
{
    public function create(Request $request)
    {
        $user_id = $request->user()->id;
        $request->validate([
            'message' => 'required'
        ]);

        $isCurrentChat = Conversation::where('user_id', $user_id)->where('status', Conversation::STATUS_AWAITING)->first();
        if ($isCurrentChat) {
            return response()->json(['status' => false, 'message' => 'У вас уже есть текущий разговор', 'current_job_id' => $isCurrentChat->id]);
        }

        $conversation = Conversation::create([
            'user_id' => $user_id,
            'status' => Conversation::STATUS_AWAITING,
            'answer' => ''
        ]);

        return response()->json(['status' => true,'current_job_id' => $conversation->id, 'conversation_status' => $conversation->status, 'message' => 'разговор успешно создан']);
    }

    public function get(Request $request, $id)
    {
        $user_id = $request->user()->id;
        $conversation = Conversation::find($id);
        if ($conversation->user_id !== $user_id) {
            return response()->json(['status' => false, 'message' => 'Нет доступа к чату'], 403);
        }
        if ($conversation->status === Conversation::STATUS_SUCCESS) {
            return response()->json(['status' => false, 'message' => 'Чат уже завершен', 'answer' => $conversation->answer]);
        }

        if (strlen($conversation->answer) < 512) {
            $conversation->answer = $conversation->answer . '' . RandomWords::generateRandomWords(random_int(1, 8));
            $conversation->save();
        } else {
            $conversation->status = Conversation::STATUS_SUCCESS;
            $conversation->save();
            return response()->json(['status' => false, 'message' => 'Чат уже завершен', 'answer' => $conversation->answer]);
        }

        return response()->json(['status' => true, 'conversation_status' => $conversation->status, 'job_id' => $conversation->id, 'answer' => $conversation->answer]);
    }

    public function update(Request $request, $id)
    {
        $user_id = $request->user()->id;
        $request->validate([
            'message' => 'required'
        ]);

        $conversation = Conversation::find($id);
        if ($user_id !== $conversation->user_id) {
            return response()->json(['status' => false, 'message' => 'Нет доступа к чату'], 403);
        }
        if ($conversation->status === Conversation::STATUS_AWAITING) {
            return response()->json(['status' => false, 'message' => 'Подождите, пока бот ответит на прошлый вопрос'], 403);
        }

        $conversation->status = Conversation::STATUS_AWAITING;
        $conversation->answer = '';
        $conversation->save();
        return response()->json(['status' => true, 'conversation_status' => $conversation->status, 'message' => 'разговор успешно продолжен']);
    }
}
