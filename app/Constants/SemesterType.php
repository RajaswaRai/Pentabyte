<?php

namespace App\Constants;

class SemesterType
{
    public const ODD = 1;
    public const EVEN = 2;

    public static function labels(): array
    {
        return [
            self::ODD => 'Ganjil',
            self::EVEN => 'Genap',
        ];
    }

    public static function label(int $value): string
    {
        return self::labels()[$value] ?? 'Unknown';
    }
    
    public static function name(int $type, int $academic_year): string
    {
        return  self::label($type) . " " . $academic_year . "/" . $academic_year+1;
    }
}
