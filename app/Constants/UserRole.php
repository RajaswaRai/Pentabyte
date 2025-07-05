<?php

namespace App\Constants;

class UserRole
{
    public const ADMIN = 0;
    public const TEACHER = 1;
    public const STUDENT = 2;
    public const GUARDIAN = 3;

    public static function labels(): array
    {
        return [
            self::ADMIN => 'Admin',
            self::TEACHER => 'Teacher',
            self::STUDENT => 'Student',
            self::GUARDIAN => 'Guardian',
        ];
    }

    public static function label(int $value): string
    {
        return self::labels()[$value] ?? 'Unknown';
    }
}
