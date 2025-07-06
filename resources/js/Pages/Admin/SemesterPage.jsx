import AdminLayout from "@/Layouts/AdminLayout";
import { Head } from "@inertiajs/react";
import { useMemo, useState } from "react";
import Modal from "@/Components/Modal"; // Import your Modal component

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
        setSelectedItem(null);
    };

    const sortedSlots = useMemo(() => {
        // ... (keep your existing sortedSlots implementation)
    }, [classroom.subject_class_teacher]);

    return (
        <>
            <Head title={"Jadwal"} />
            <div className="mx-auto max-w-screen-2xl">
                {/* ... (keep your existing layout code) */}

                <div className="bg-white p-7 rounded-md my-5">
                    <h2 className="text-xl font-semibold mb-3">
                        Jadwal Mingguan
                    </h2>
                    <div className="max-w-full overflow-x-auto">
                        <table className="w-full table-fixed border text-sm">
                            {/* ... (keep your table header) */}
                            <tbody>
                                {sortedSlots.map((slot, idx) => (
                                    <tr key={idx} className="border-t">
                                        {/* ... (keep your time cell) */}
                                        {[0, 1, 2, 3, 4, 5, 6].map((day) => (
                                            <td
                                                key={day}
                                                className="border px-2 py-2 align-top min-w-[80px] md:min-w-[100px]"
                                            >
                                                <div className="flex flex-col gap-1">
                                                    {slot.slots[day].map(
                                                        (item, i) => (
                                                            <div
                                                                key={i}
                                                                className={`cursor-pointer relative group rounded-md px-2 py-1 text-white text-xs shadow transition-all duration-300 ease-in-out ${
                                                                    i % 3 === 0
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
                                                        )
                                                    )}
                                                </div>
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal using your reusable component */}
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
