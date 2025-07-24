<?php

namespace App\Constants;

class AbsensiConst
{
    public const HADIR = 0; // Nilai integer untuk Hadir
    public const IZIN = 1;  // Nilai integer untuk Izin
    public const ALPHA = 2; // Nilai integer untuk Alpha
    public const SAKIT = 3; // Nilai integer untuk Sakit

    // Mapping dari string ke integer
    public static function fromString(string $status): int
    {
        $map = [
            'H' => self::HADIR,
            'I' => self::IZIN,
            'A' => self::ALPHA,
            'S' => self::SAKIT,
        ];

        return $map[$status] ?? self::ALPHA; // Default ke Alpha jika tidak valid
    }

    // Mapping dari integer ke string (jika diperlukan)
    public static function toString(int $status): string
    {
        $map = [
            self::HADIR => 'H',
            self::IZIN => 'I',
            self::ALPHA => 'A',
            self::SAKIT => 'S',
        ];

        return $map[$status] ?? 'A'; // Default ke Alpha jika tidak valid
    }

    // Untuk validasi
    public static function isValidStatus(string $status): bool
    {
        return in_array($status, ['H', 'I', 'A', 'S']);
    }
}