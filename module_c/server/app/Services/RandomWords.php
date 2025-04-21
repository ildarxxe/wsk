<?php

namespace App\Services;

use Faker\Factory;

class RandomWords
{
    public static function generateRandomWords(int $count)
    {
        $faker = Factory::create();
        $words = [];
        for ($i = 0; $i < $count; $i++) {
            $words[] = $faker->word();
        }
        return implode(' ', $words);
    }
}
