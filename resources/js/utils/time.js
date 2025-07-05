export function timeAgoIndoFromString(commentTime) {
    const end = new Date(); // waktu sekarang
    const start = new Date(commentTime.replace(" ", "T")); // waktu komentar
    const seconds = Math.floor((end - start) / 1000);

    if (isNaN(seconds)) return "Waktu tidak valid";
    if (seconds < 0) return "Beberapa saat lagi";

    const units = [
        { name: "tahun", value: 31536000 },
        { name: "bulan", value: 2592000 },
        { name: "hari", value: 86400 },
        { name: "jam", value: 3600 },
        { name: "menit", value: 60 },
        { name: "detik", value: 1 },
    ];

    for (const unit of units) {
        const count = Math.floor(seconds / unit.value);
        if (count >= 1) {
            return `${count} ${unit.name}${count > 1 ? "" : ""} yang lalu`;
        }
    }

    return "Baru saja";
}
