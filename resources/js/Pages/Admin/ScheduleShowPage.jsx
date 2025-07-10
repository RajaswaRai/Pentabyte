import AdminLayout from "@/Layouts/AdminLayout";
import { Head, router, useForm } from "@inertiajs/react";
import { useMemo, useState } from "react";
import Modal from "@/Components/Modal";

const dayMap = {
    0: "Minggu",
    1: "Senin",
    2: "Selasa",
    3: "Rabu",
    4: "Kamis",
    5: "Jumat",
    6: "Sabtu",
};

export default function ScheduleShowPage({
    auth,
    classroom,
    subjects,
    teachers,
}) {
    const [selectedItem, setSelectedItem] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);

    const { data, setData, reset, post, put, processing, errors } = useForm({
        subject_id: "",
        teacher_id: "",
        day: "",
        start_time: "",
        end_time: "",
        classroom_id: classroom.id,
    });

    const formatTime = (timeStr) => {
        if (!timeStr) return "";
        if (typeof timeStr === "string" && timeStr.includes(":")) {
            return timeStr.slice(0, 5);
        }
        const date = new Date(`1970-01-01T${timeStr}Z`);
        return date.toISOString().slice(11, 16);
    };

    const openEditModal = (item) => {
        setSelectedItem(item);
        setData({
            subject_id: item.subject_id,
            teacher_id: item.teacher_id,
            day: item.day,
            start_time: formatTime(item.start_time),
            end_time: formatTime(item.end_time),
            classroom_id: item.classroom_id,
        });
        setShowModal(true);
    };

    const openCreateModal = () => {
        reset();
        setSelectedItem(null);
        setShowCreateModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setTimeout(() => {
            setSelectedItem(null);
            reset();
        }, 200);
    };

    const closeCreateModal = () => {
        setShowCreateModal(false);
        reset();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (selectedItem) {
            put(route("admin.schedule.update", selectedItem.id), {
                preserveScroll: true,
                onSuccess: closeModal,
            });
        } else {
            post(route("admin.schedule.store"), {
                preserveScroll: true,
                onSuccess: closeCreateModal,
            });
        }
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

    const renderForm = () => (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium mb-1">
                    Mata Pelajaran
                </label>
                <select
                    value={data.subject_id}
                    onChange={(e) => setData("subject_id", e.target.value)}
                    className="w-full border rounded-md px-3 py-2"
                >
                    <option value="">-- Pilih --</option>
                    {subjects.map((subject) => (
                        <option key={subject.id} value={subject.id}>
                            {subject.name}
                        </option>
                    ))}
                </select>
                {errors.subject_id && (
                    <p className="text-red-500 text-xs mt-1">
                        {errors.subject_id}
                    </p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Guru</label>
                <select
                    value={data.teacher_id}
                    onChange={(e) => setData("teacher_id", e.target.value)}
                    className="w-full border rounded-md px-3 py-2"
                >
                    <option value="">-- Pilih --</option>
                    {teachers.map((teacher) => (
                        <option key={teacher.id} value={teacher.id}>
                            {teacher.name || teacher.full_name}
                        </option>
                    ))}
                </select>
                {errors.teacher_id && (
                    <p className="text-red-500 text-xs mt-1">
                        {errors.teacher_id}
                    </p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Hari</label>
                <select
                    value={data.day}
                    onChange={(e) => setData("day", e.target.value)}
                    className="w-full border rounded-md px-3 py-2"
                >
                    {Object.entries(dayMap)
                        .filter(([k]) => k !== "0")
                        .map(([key, value]) => (
                            <option key={key} value={key}>
                                {value}
                            </option>
                        ))}
                </select>
                {errors.day && (
                    <p className="text-red-500 text-xs mt-1">{errors.day}</p>
                )}
            </div>

            <div className="flex justify-between items-center gap-3">
                <div className="flex-1">
                    <label className="block text-sm font-medium mb-1">
                        Jam Mulai
                    </label>
                    <input
                        type="time"
                        value={data.start_time}
                        onChange={(e) => setData("start_time", e.target.value)}
                        className="w-full border rounded-md px-3 py-2"
                    />
                    {errors.start_time && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.start_time}
                        </p>
                    )}
                </div>
                <div className="flex-1">
                    <label className="block text-sm font-medium mb-1">
                        Jam Selesai
                    </label>
                    <input
                        type="time"
                        value={data.end_time}
                        onChange={(e) => setData("end_time", e.target.value)}
                        className="w-full border rounded-md px-3 py-2"
                    />
                    {errors.end_time && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.end_time}
                        </p>
                    )}
                </div>
            </div>

            <div className="text-right">
                <button
                    type="submit"
                    disabled={processing}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md"
                >
                    Simpan
                </button>
            </div>
        </form>
    );

    return (
        <>
            <Head title="Jadwal" />
            <div className="mx-auto max-w-screen-2xl py-5 px-5">
                <div className="bg-white p-7 rounded-md my-5">
                    <div className="flex items-center justify-between gap-3 mb-3">
                        <h2 className="text-xl font-semibold">
                            Jadwal Mingguan
                        </h2>
                        <button
                            className="p-3 rounded-md text-white bg-blue-500"
                            onClick={openCreateModal}
                        >
                            Tambah Jadwal
                        </button>
                    </div>
                    <div className="overflow-x-auto">
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
                                                                className={`cursor-pointer rounded-md px-2 py-1 text-white text-xs shadow transition-all duration-300 ease-in-out ${
                                                                    i % 3 === 0
                                                                        ? "bg-blue-500"
                                                                        : i %
                                                                              3 ===
                                                                          1
                                                                        ? "bg-green-500"
                                                                        : "bg-orange-400"
                                                                }`}
                                                                onClick={() =>
                                                                    openEditModal(
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

            {/* Modal Tambah Jadwal */}
            <Modal
                show={showCreateModal}
                onClose={closeCreateModal}
                maxWidth="xl"
            >
                <div className="p-6 space-y-4">
                    <h2 className="text-lg font-bold mb-3">Tambah Jadwal</h2>
                    {renderForm()}
                </div>
            </Modal>

            {/* Modal Edit Jadwal */}
            <Modal show={showModal} onClose={closeModal} maxWidth="xl">
                <div className="p-6 space-y-4">
                    <h2 className="text-lg font-bold mb-3">Edit Jadwal</h2>
                    {renderForm()}
                </div>
            </Modal>
        </>
    );
}

ScheduleShowPage.layout = (page) => (
    <AdminLayout user={page.props.auth.user}>{page}</AdminLayout>
);
