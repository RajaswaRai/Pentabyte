import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";
export default function AbsencePage({ auth, sct, class_students_count }) {
    const [selectedDate, setSelectedDate] = useState(() => {
        const today = new Date();
        return today.toISOString().split("T")[0]; // Format: 'YYYY-MM-DD'
    });
    const [attendance, setAttendance] = useState({});

    // Inisialisasi data siswa dari props
    useEffect(() => {
        if (sct?.classroom?.students) {
            const initialAttendance = {};
            sct.classroom.students.forEach((student) => {
                initialAttendance[student.id] = ""; // Kosong artinya belum dipilih
            });
            setAttendance(initialAttendance);
        }
    }, [sct]);

    // Fungsi untuk update absensi satu siswa
    const setStatus = (studentId, status) => {
        setAttendance((prev) => ({
            ...prev,
            [studentId]: status,
        }));
    };

    // Tandai semua hadir
    const markAllPresent = () => {
        const updated = {};
        Object.keys(attendance).forEach((id) => {
            updated[id] = "H";
        });
        setAttendance(updated);
    };

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = () => {
        if (!selectedDate) {
            alert("Pilih tanggal terlebih dahulu!");
            return;
        }

        setIsSubmitting(true);

        // Ubah attendance object menjadi array of { student_id, status }
        const formattedAttendance = Object.entries(attendance).map(
            ([student_id, status]) => ({
                student_id: parseInt(student_id), // pastikan ID berbentuk number jika perlu
                status,
            })
        );

        // Kirim ke server
        router.post(route("absence.save", { sct_id: sct.id }), {
            date: selectedDate,
            students: formattedAttendance,
        });
    };

    // Ambil errors dan flash message dari props Inertia
    const { errors, flash } = usePage().props;

    const statusButtons = ["H", "I", "A", "S"];

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800">Absence</h2>
            }
        >
            <Head title="Absence" />

            {/* Header */}
            <div className="rounded-b-[1.5rem] bg-gradient-to-r from-[#153580] to-[#0C3159] text-white">
                <div className="py-8 px-20 max-w-screen-2xl mx-auto">
                    <div className="mb-8">
                        <h1 className="font-semibold text-2xl">
                            {sct.subject.name}
                        </h1>
                        <h2 className="text-lg">Kelas: {sct.classroom.name}</h2>
                    </div>
                    <div className="flex items-center gap-5">
                        <div className="flex-1">
                            <h3 className="text-[#D0D0D0]">Guru Pengajar</h3>
                            <p className="text-xl font-medium">
                                {sct.teacher.full_name}
                            </p>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-[#D0D0D0]">Jumlah Murid</h3>
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

            {/* Content */}
            <div className="py-12">
                <div className="px-20 max-w-screen-2xl mx-auto">
                    <div className="flex gap-5">
                        <div>
                            <div>
                                <Link
                                    className="mb-5 font-semibold text-[#133475]"
                                    href={
                                        document.referrer || route("dashboard")
                                    }
                                >
                                    <img
                                        src="/assets/svg/Back.svg"
                                        alt="back"
                                        className="inline -mt-2"
                                    />
                                    <span className="ml-3">Kembali</span>
                                </Link>
                            </div>
                        </div>

                        {/* Absensi */}
                        <div className="flex-[2] space-y-5">
                            {/* Tampilkan flash message jika ada */}
                            {flash.success && (
                                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
                                    {flash.success}
                                </div>
                            )}

                            {/* Tampilkan error message jika ada */}
                            {Object.keys(errors).length > 0 && (
                                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                                    <ul>
                                        {Object.entries(errors).map(
                                            ([key, value]) => (
                                                <li key={key}>{value}</li>
                                            )
                                        )}
                                    </ul>
                                </div>
                            )}

                            <div className="bg-white p-3 rounded-md">
                                <h1 className="font-bold">Presensi Siswa</h1>
                                <span className="text-xs">
                                    Presensi Mata Pelajaran {sct.subject.name} |{" "}
                                    {sct.classroom.name}
                                </span>

                                <div className="flex gap-3 justify-between items-center mb-4">
                                    <input
                                        className="rounded-md border px-2 py-1"
                                        type="date"
                                        value={selectedDate}
                                        onChange={(e) =>
                                            setSelectedDate(e.target.value)
                                        }
                                    />
                                    <div className="flex gap-2 items-center">
                                        <input
                                            className="rounded-md"
                                            id="check-all"
                                            type="checkbox"
                                            onChange={(e) => {
                                                if (e.target.checked)
                                                    markAllPresent();
                                            }}
                                        />
                                        <label
                                            htmlFor="check-all"
                                            className="text-nowrap"
                                        >
                                            Tandai hadir semua
                                        </label>
                                    </div>
                                </div>
                                <div>
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b-2">
                                                <th className="text-left">
                                                    Siswa
                                                </th>
                                                <th>Kehadiran</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {sct.classroom.students.map(
                                                (student, index) => (
                                                    <tr
                                                        key={student.id}
                                                        className="border-b hover:bg-gray-50"
                                                    >
                                                        <td>
                                                            <div className="flex gap-3 p-3">
                                                                <span>
                                                                    {index + 1}.
                                                                </span>
                                                                <div>
                                                                    <p className="font-semibold">
                                                                        {
                                                                            student.full_name
                                                                        }
                                                                    </p>
                                                                    <p>
                                                                        {
                                                                            student.nisn
                                                                        }
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className="flex items-center justify-center gap-3">
                                                                {[
                                                                    "H",
                                                                    "I",
                                                                    "A",
                                                                    "S",
                                                                ].map(
                                                                    (
                                                                        status
                                                                    ) => (
                                                                        <button
                                                                            key={
                                                                                status
                                                                            }
                                                                            onClick={() =>
                                                                                setStatus(
                                                                                    student.id,
                                                                                    status
                                                                                )
                                                                            }
                                                                            className={`p-2 w-10 h-10 flex items-center justify-center rounded-full border-[1px] ${
                                                                                attendance[
                                                                                    student
                                                                                        .id
                                                                                ] ===
                                                                                status
                                                                                    ? "bg-blue-500 text-white border-blue-500"
                                                                                    : "border-[#898989] text-[#898989]"
                                                                            }`}
                                                                        >
                                                                            {
                                                                                status
                                                                            }
                                                                        </button>
                                                                    )
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )
                                            )}
                                        </tbody>
                                    </table>

                                    <div className="mt-6 flex justify-end">
                                        <button
                                            onClick={handleSubmit}
                                            disabled={isSubmitting}
                                            className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 ${
                                                isSubmitting
                                                    ? "opacity-50 cursor-not-allowed"
                                                    : ""
                                            }`}
                                        >
                                            {isSubmitting
                                                ? "Menyimpan..."
                                                : "Simpan Absensi"}
                                        </button>
                                        ;
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
