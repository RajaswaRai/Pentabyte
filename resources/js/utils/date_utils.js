export function date_indo() {
    const date = new Date();

    const months = [
        "Januari", "Februari", "Maret", "April", "Mei", "Juni",
        "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];

    const day = new Intl.DateTimeFormat("id-ID", { day: "2-digit" }).format(date);
    const monthIndex = new Intl.DateTimeFormat("id-ID", { month: "numeric" }).format(date) - 1;
    const year = new Intl.DateTimeFormat("id-ID", { year: "numeric" }).format(date);

    return `${day} ${months[monthIndex]} ${year}`;
}
