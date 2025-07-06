import AdminLayout from "@/Layouts/AdminLayout";
import { Head } from "@inertiajs/react";
import { useMemo, useState } from "react";
import Modal from "@/Components/Modal"; // Import the Modal component

const dayMap = {
    0: "Minggu",
    1: "Senin",
    2: "Selasa",
    3: "Rabu",
    4: "Kamis",
    5: "Jumat",
    6: "Sabtu",
};

export default function ScheduleShowPage({ auth, classroom }) {
    const [selectedItem, setSelectedItem] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const openModal = (item) => {
        setSelectedItem(item);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        // Tunggu 200ms (sesuai durasi animasi) sebelum reset selectedItem
        setTimeout(() => {
            setSelectedItem(null);
        }, 200);
    };

    const sortedSlots = useMemo(() => {
        const toSeconds = (timeStr) => {
            const [h, m, s] = timeStr.split(":").map(Number);
            return h * 3600 + m * 60 + (s || 0);
        };

        const secondsToTime = (sec) => {
            const h = String(Math.floor(sec / 3600)).padStart(2, "0");
            const m = String(Math.floor((sec % 3600) / 60)).padStart(2, "0");
            return `${h}:${m}:00`;
        };

        const entries = (classroom.subject_class_teacher || []).map((item) => ({
            ...item,
            startSeconds: toSeconds(item.start_time),
            endSeconds: toSeconds(item.end_time),
        }));

        entries.sort((a, b) => a.startSeconds - b.startSeconds);

        const merged = [];
        for (const entry of entries) {
            const last = merged[merged.length - 1];
            if (last && entry.startSeconds <= last.endSeconds) {
                last.endSeconds = Math.max(last.endSeconds, entry.endSeconds);
                last.raw.push(entry);
            } else {
                merged.push({
                    startSeconds: entry.startSeconds,
                    endSeconds: entry.endSeconds,
                    raw: [entry],
                });
            }
        }

        return merged.map((group) => {
            const time = `${secondsToTime(
                group.startSeconds
            )} - ${secondsToTime(group.endSeconds)}`;
            const slots = { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] };

            group.raw.forEach((item) => {
                slots[item.day].push(item);
            });

            return { time, slots };
        });
    }, [classroom.subject_class_teacher]);

    return (
        <>
            <Head title={"Jadwal"} />
            <div className="mx-auto max-w-screen-2xl">
                <div className="py-5 px-5">
                    {/* ... (keep your existing header and form code) */}

                    <div className="bg-white p-7 rounded-md my-5">
                        <h2 className="text-xl font-semibold mb-3">
                            Jadwal Mingguan
                        </h2>
                        <div className="max-w-full">
                            <table className="w-full table-fixed border text-sm">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="border px-2 py-2 text-center">
                                            Waktu
                                        </th>
                                        {Object.values(dayMap).map((day) => (
                                            <th
                                                key={day}
                                                className="border px-2 py-2 text-center"
                                            >
                                                {day}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {sortedSlots.map((slot, idx) => (
                                        <tr key={idx} className="border-t">
                                            <td className="border px-2 py-4 font-medium text-center bg-gray-50 text-nowrap">
                                                {slot.time}
                                            </td>
                                            {[0, 1, 2, 3, 4, 5, 6].map(
                                                (day) => (
                                                    <td
                                                        key={day}
                                                        className="border px-2 py-2 align-top min-w-[80px] md:min-w-[100px]"
                                                    >
                                                        <div className="flex flex-col gap-1">
                                                            {slot.slots[
                                                                day
                                                            ].map((item, i) => (
                                                                <div
                                                                    key={i}
                                                                    className={`cursor-pointer relative group rounded-md px-2 py-1 text-white text-xs shadow transition-all duration-300 ease-in-out ${
                                                                        i %
                                                                            3 ===
                                                                        0
                                                                            ? "bg-blue-500"
                                                                            : i %
                                                                                  3 ===
                                                                              1
                                                                            ? "bg-green-500"
                                                                            : "bg-orange-400"
                                                                    }`}
                                                                    onClick={() =>
                                                                        openModal(
                                                                            item
                                                                        )
                                                                    }
                                                                >
                                                                    <div className="font-semibold">
                                                                        {
                                                                            item
                                                                                .subject
                                                                                ?.name
                                                                        }
                                                                    </div>
                                                                    <div className="text-[10px]">
                                                                        {item
                                                                            .teacher
                                                                            ?.name ||
                                                                            item
                                                                                .teacher
                                                                                ?.full_name}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </td>
                                                )
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal for showing schedule details */}
            <Modal show={showModal} onClose={closeModal} maxWidth="xl">
                <div className="p-6">
                    <h2 className="text-lg font-bold mb-3">Detail Jadwal</h2>
                    {selectedItem && (
                        <div className="space-y-2 text-sm">
                            <div>
                                <span className="font-semibold">
                                    Mata Pelajaran:
                                </span>{" "}
                                {selectedItem.subject?.name}
                            </div>
                            <div>
                                <span className="font-semibold">Guru:</span>{" "}
                                {selectedItem.teacher?.name ||
                                    selectedItem.teacher?.full_name}
                            </div>
                            <div>
                                <span className="font-semibold">Hari:</span>{" "}
                                {dayMap[selectedItem.day]}
                            </div>
                            <div>
                                <span className="font-semibold">Jam:</span>{" "}
                                {selectedItem.start_time} -{" "}
                                {selectedItem.end_time}
                            </div>
                            <div>
                                <span className="font-semibold">Kelas:</span>{" "}
                                {classroom.name}
                            </div>
                        </div>
                    )}
                    <div className="mt-6 text-right">
                        <button
                            className="px-4 py-2 bg-blue-500 text-white rounded-md"
                            onClick={closeModal}
                        >
                            Tutup
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    );
}

ScheduleShowPage.layout = (page) => (
    <AdminLayout user={page.props.auth.user}>{page}</AdminLayout>
);
