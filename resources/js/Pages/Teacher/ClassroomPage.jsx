import Modal from "@/Components/Modal";
import Assignment from "@/Components/pentabyte/Assignment";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router, useForm } from "@inertiajs/react";
import moment from "moment";
import { useState } from "react";

export default function ClassroomPage({
    auth,
    sct,
    lessons,
    assignments,
    class_students_count,
}) {
    const [showLessonModal, setShowLessonModal] = useState(false);
    const [modalLessonData, setModalLessonData] = useState({
        topic: "",
        description: "",
    });

    const form = useForm({
        subject_classroom_teacher_id: sct.id,
        topic: "",
        description: "",
    });

    const openLessonModal = () => {
        setModalLessonData({ topic: "", description: "" });
        setShowLessonModal(true);
    };

    const closeLessonModal = () => {
        setShowLessonModal(false);
    };

    const [showAssignmentModal, setShowAssignmentModal] = useState(false);

    const assignmentForm = useForm({
        subject_classroom_teacher_id: sct.id,
        topic: "",
        description: "",
        due_date: "",
        due_time: "",
    });

    const openAssignmentModal = () => {
        assignmentForm.reset();
        setShowAssignmentModal(true);
    };

    const closeAssignmentModal = () => {
        setShowAssignmentModal(false);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Classroom
                </h2>
            }
        >
            <Head title="Classroom" />

            <div className="rounded-b-[1.5rem] bg-gradient-to-r from-[#153580] to-[#0C3159] text-white">
                <div className="py-8 px-20 max-w-screen-2xl mx-auto">
                    <div className="mb-8">
                        <h1 className="font-semibold text-2xl">
                            {sct.subject.name}
                        </h1>
                        <h2>Kelas: {sct.classroom.name}</h2>
                    </div>
                    <div className="flex items-center gap-5">
                        <div className="flex-1">
                            <h3 className="text-[#D0D0D0]">Guru Pengajar</h3>
                            <p className="text-xl font-medium">
                                {sct.teacher.full_name}
                            </p>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-[#D0D0D0]">Jumlah Peserta</h3>
                            <p className="text-xl font-medium">
                                {class_students_count}
                            </p>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-[#D0D0D0]">Periode Akademik</h3>
                            <p className="text-xl font-medium">
                                2024/2025 Genap
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="py-12">
                <div className="px-20 max-w-screen-2xl mx-auto">
                    <div className="flex gap-5">
                        <div className="flex-1">
                            <div>
                                <a
                                    className="mb-5 font-semibold text-[#133475]"
                                    href={window.history.back()}
                                >
                                    <img
                                        src="/assets/svg/Back.svg"
                                        alt="back"
                                        className="inline -mt-2"
                                    />
                                    <span className="ml-3">Kembali</span>
                                </a>
                            </div>
                            {/* <div className="bg-white p-5 rounded-lg">
                                <Link
                                    href={route("classroom.absence", {
                                        sct_id: sct.id,
                                    })}
                                    className="rounded-md bg-gray-200 w-full"
                                >
                                    Absensi
                                </Link>
                            </div> */}
                        </div>
                        <div className="flex-[2]">
                            <div className="bg-white py-3 px-5 lg:px-20 rounded-md mb-3">
                                <div className="grid grid-cols-2 lg:grid-cols-4 justify-between gap-5">
                                    <div>
                                        <div
                                            className="cursor-pointer"
                                            onClick={openLessonModal}
                                        >
                                            <div className="bg-[#ECFFE7] rounded-md p-2 mb-1">
                                                <img
                                                    className="mx-auto block w-7 h-7"
                                                    src="/assets/svg/Bookmark.svg"
                                                    alt="Materi"
                                                />
                                            </div>
                                            <p className="font-medium text-sm text-center">
                                                Materi
                                            </p>
                                        </div>
                                    </div>
                                    <div>
                                        <div>
                                            <div
                                                className="cursor-pointer"
                                                onClick={openAssignmentModal}
                                            >
                                                <div className="bg-[#DFF7FF] rounded-md p-2 mb-1">
                                                    <img
                                                        className="mx-auto block w-7 h-7"
                                                        src="/assets/svg/Book_duotone.svg"
                                                        alt="Tugas"
                                                    />
                                                </div>
                                                <p className="font-medium text-sm text-center">
                                                    Tugas
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="bg-[#EFEFFF] rounded-md p-2 mb-1">
                                            <img
                                                className="mx-auto block w-7 h-7 "
                                                src="/assets/svg/Announced.svg"
                                                alt=""
                                            />
                                        </div>
                                        <p className="font-medium text-sm text-center">
                                            Info
                                        </p>
                                    </div>
                                    <div>
                                        <div className="bg-[#FFF1DB] rounded-md p-2 mb-1">
                                            <img
                                                className="mx-auto block w-7 h-7 "
                                                src="/assets/svg/poll.svg"
                                                alt=""
                                            />
                                        </div>
                                        <p className="font-medium text-sm text-center">
                                            Poll
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div>
                                {lessons.map((x, i) => (
                                    <Timeline key={`lesson_${i}`} lesson={x} />
                                ))}
                            </div>
                        </div>
                        <div className="flex-1 mt-10">
                            <div className="mb-5">
                                <h3 className="mb-2 font-semibold">
                                    Tugas yang sedang berjalan
                                </h3>
                                <div className="bg-white p-4 rounded-md">
                                    {assignments.length > 0 ? (
                                        assignments.map((x, i) => (
                                            <Assignment
                                                href={`/lesson/${x.lesson.id}/assignment/${x.id}`}
                                                key={`assignment_${i}`}
                                                date={x.due_date}
                                                time={x.due_time}
                                                title={x.name}
                                            />
                                        ))
                                    ) : (
                                        <p className="text-sm text-black/50 font-medium">
                                            Tidak ada tugas...
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div>
                                <h3 className="font-semibold">
                                    <span className="mr-2">Presensi</span>
                                    <img
                                        src="/assets/svg/circle_right_alt.svg"
                                        alt="presence"
                                        className="inline -mt-1"
                                    />
                                </h3>
                                <p className="text-xs text-black/50 font-medium mb-3">
                                    Terakhir diperbarui:{" "}
                                    {"Selasa 18 Maret 2025, 09:40"}
                                </p>
                                <div className="bg-white p-4 rounded-md">
                                    <div className="mb-3">
                                        <h4 className="text-sm font-semibold mb-1">
                                            Kehadiran
                                        </h4>
                                        <p className="text-xs text-[#4C7AD1]">
                                            3 dari total 16 sesi
                                        </p>
                                    </div>
                                    <div className="flex items-center justify-between mx-5 mb-5">
                                        <div>
                                            <h5 className="text-xs text-black/50">
                                                Hadir
                                            </h5>
                                            <p className="text-sm font-semibold text-center">
                                                3
                                            </p>
                                        </div>
                                        <div>
                                            <h5 className="text-xs text-black/50">
                                                Sakit
                                            </h5>
                                            <p className="text-sm font-semibold text-center">
                                                0
                                            </p>
                                        </div>
                                        <div>
                                            <h5 className="text-xs text-black/50">
                                                Izin
                                            </h5>
                                            <p className="text-sm font-semibold text-center">
                                                0
                                            </p>
                                        </div>
                                        <div>
                                            <h5 className="text-xs text-black/50">
                                                Alpha
                                            </h5>
                                            <p className="text-sm font-semibold text-center">
                                                1
                                            </p>
                                        </div>
                                    </div>
                                    <div>
                                        <button className="text-[#FDA262] font-semibold text-sm">
                                            Lihat Detail presensi
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Tambah Materi */}
            <Modal
                show={showLessonModal}
                onClose={closeLessonModal}
                maxWidth="2xl"
            >
                <div className="p-6">
                    <h2 className="text-lg font-bold mb-4">Tambah Materi</h2>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            router.post(
                                route("classroom.lesson.store"),
                                {
                                    subject_classroom_teacher_id:
                                        form.data.subject_classroom_teacher_id,
                                    topic: form.data.topic,
                                    description: form.data.description,
                                },
                                {
                                    onSuccess: () => {
                                        form.reset();
                                        closeLessonModal();
                                    },
                                }
                            );
                        }}
                        className="space-y-4"
                    >
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Topik
                            </label>
                            <input
                                type="text"
                                className="w-full border border-gray-300 rounded-md p-2 text-sm"
                                value={form.data.topic}
                                onChange={(e) =>
                                    form.setData("topic", e.target.value)
                                }
                            />
                            {form.errors.topic && (
                                <p className="text-red-500 text-sm mt-1">
                                    {form.errors.topic}
                                </p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Deskripsi
                            </label>
                            <textarea
                                rows={4}
                                className="w-full border border-gray-300 rounded-md p-2 text-sm"
                                value={form.data.description}
                                onChange={(e) =>
                                    form.setData("description", e.target.value)
                                }
                            />
                            {form.errors.description && (
                                <p className="text-red-500 text-sm mt-1">
                                    {form.errors.description}
                                </p>
                            )}
                        </div>
                        <div className="flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={closeLessonModal}
                                className="px-4 py-2 bg-gray-300 text-black text-sm rounded hover:bg-gray-400"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                                disabled={form.processing}
                            >
                                Tambah
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>

            <Modal
                show={showAssignmentModal}
                onClose={closeAssignmentModal}
                maxWidth="2xl"
            >
                <div className="p-6">
                    <h2 className="text-lg font-bold mb-4">Tambah Tugas</h2>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            router.post(
                                route("classroom.assignment.store"),
                                assignmentForm.data,
                                {
                                    onSuccess: () => {
                                        assignmentForm.reset();
                                        closeAssignmentModal();
                                    },
                                }
                            );
                        }}
                        className="space-y-4"
                    >
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Topik
                            </label>
                            <input
                                type="text"
                                className="w-full border border-gray-300 rounded-md p-2 text-sm"
                                value={assignmentForm.data.topic}
                                onChange={(e) =>
                                    assignmentForm.setData(
                                        "topic",
                                        e.target.value
                                    )
                                }
                            />
                            {assignmentForm.errors.topic && (
                                <p className="text-red-500 text-sm mt-1">
                                    {assignmentForm.errors.topic}
                                </p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Deskripsi
                            </label>
                            <textarea
                                rows={4}
                                className="w-full border border-gray-300 rounded-md p-2 text-sm"
                                value={assignmentForm.data.description}
                                onChange={(e) =>
                                    assignmentForm.setData(
                                        "description",
                                        e.target.value
                                    )
                                }
                            />
                            {assignmentForm.errors.description && (
                                <p className="text-red-500 text-sm mt-1">
                                    {assignmentForm.errors.description}
                                </p>
                            )}
                        </div>
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Tanggal Tenggat
                                </label>
                                <input
                                    type="date"
                                    className="w-full border border-gray-300 rounded-md p-2 text-sm"
                                    value={assignmentForm.data.due_date}
                                    onChange={(e) =>
                                        assignmentForm.setData(
                                            "due_date",
                                            e.target.value
                                        )
                                    }
                                />
                                {assignmentForm.errors.due_date && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {assignmentForm.errors.due_date}
                                    </p>
                                )}
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Waktu Tenggat
                                </label>
                                <input
                                    type="time"
                                    className="w-full border border-gray-300 rounded-md p-2 text-sm"
                                    value={assignmentForm.data.due_time}
                                    onChange={(e) =>
                                        assignmentForm.setData(
                                            "due_time",
                                            e.target.value
                                        )
                                    }
                                />
                                {assignmentForm.errors.due_time && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {assignmentForm.errors.due_time}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={closeAssignmentModal}
                                className="px-4 py-2 bg-gray-300 text-black text-sm rounded hover:bg-gray-400"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                                disabled={assignmentForm.processing}
                            >
                                Tambah
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}

const Timeline = ({ lesson }) => {
    const [showLessonModal, setShowLessonModal] = useState(false);
    const [modalLessonData, setModalLessonData] = useState({
        topic: lesson.topic || "",
        description: lesson.description || "",
    });

    const openLessonModal = () => {
        setShowLessonModal(true);
    };

    const closeLessonModal = () => {
        setShowLessonModal(false);
    };

    return (
        <>
            <div className="bg-white py-8 mb-5 px-12 rounded-lg relative group hover:shadow-lg transition">
                {/* Tombol Hapus */}
                <div className="absolute top-5 right-5 hidden group-hover:block">
                    <button
                        onClick={() => {
                            if (
                                confirm(
                                    `Yakin ingin menghapus materi "${lesson.topic}"?`
                                )
                            ) {
                                router.delete(
                                    route("classroom.lesson.destroy", {
                                        id: lesson.id,
                                    }),
                                    { preserveScroll: true }
                                );
                            }
                        }}
                        className="text-red-500 text-sm font-medium hover:underline"
                    >
                        Hapus
                    </button>
                </div>

                <div className="flex gap-3 mb-5">
                    <img
                        className="rounded-full w-16 h-16 bg-slate-300 overflow-hidden"
                        src="/assets/img/Avatar(1).png"
                        alt="user_profile"
                    />
                    <div>
                        <p className="text-xl font-semibold">
                            {lesson.subject_classroom_teacher.teacher.full_name}
                        </p>
                        <p className="text-black/50 font-medium">
                            {moment(lesson.created_at).fromNow()}
                        </p>
                    </div>
                </div>

                <div>
                    <h1 className="font-bold text-2xl mb-2">{lesson.topic}</h1>
                    <p className="text-black/50 font-medium mb-2">
                        {lesson.description}
                    </p>
                </div>

                {lesson.assignment && (
                    <div className="mt-4">
                        <h4 className="text-sm font-semibold text-black">
                            Tugas
                        </h4>
                        <p className="text-sm text-black/70">
                            Tenggat:{" "}
                            <span className="font-medium text-black">
                                {moment(lesson.assignment.due_date).format(
                                    "D MMMM YYYY"
                                )}{" "}
                                pukul {lesson.assignment.due_time}
                            </span>
                        </p>
                    </div>
                )}
            </div>

            {/* Modal Detail Materi */}
            <Modal
                show={showLessonModal}
                onClose={closeLessonModal}
                maxWidth="2xl"
            >
                <div className="p-6">
                    <h2 className="text-lg font-bold mb-4">Detail Materi</h2>
                    <form className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Topik
                            </label>
                            <input
                                type="text"
                                className="w-full border border-gray-300 rounded-md p-2 text-sm"
                                value={modalLessonData.topic}
                                readOnly
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Deskripsi
                            </label>
                            <textarea
                                rows={4}
                                className="w-full border border-gray-300 rounded-md p-2 text-sm"
                                value={modalLessonData.description}
                                readOnly
                            />
                        </div>
                        <div className="text-right">
                            <button
                                type="button"
                                onClick={closeLessonModal}
                                className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                            >
                                Tutup
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </>
    );
};
