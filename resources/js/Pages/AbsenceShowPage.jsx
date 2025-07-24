import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import { useEffect, useState } from "react";

export default function AbsenceShow({ auth, sct, date }) {
    // const [selectedDate, setSelectedDate] = useState(() => {
    //     const today = new Date();
    //     return today.toISOString().split("T")[0]; // Format: 'YYYY-MM-DD'
    // });
    const selectedDate = new Date(date).toISOString().split("T")[0]; // Format: 'YYYY-MM-DD'
    const [attendance, setAttendance] = useState({});

    // Inisialisasi data siswa dari props
    useEffect(() => {
        if (sct?.classroom?.students && sct?.absences) {
            const initialAttendance = {};

            sct.classroom.students.forEach((student) => {
                const existingAbsence = sct.absences.find(
                    (absence) => absence.student_id === student.id
                );

                // Pastikan status yang ada sesuai dengan opsi yang tersedia
                const validStatus = ["H", "I", "A", "S"].includes(
                    existingAbsence?.status
                )
                    ? existingAbsence?.status
                    : "";

                initialAttendance[student.id] = validStatus;
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

    // Simpan ke server
    const handleSubmit = () => {
        if (!selectedDate) {
            alert("Pilih tanggal terlebih dahulu!");
            return;
        }

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

    const statusButtons = ["H", "I", "A", "S"];

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Absensi
                </h2>
            }
        >
            <Head title="Absensi" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="mb-3">
                        <Link
                            className="mb-5 font-semibold text-[#133475]"
                            href={document.referrer || route("dashboard")}
                        >
                            <img
                                src="/assets/svg/Back.svg"
                                alt="back"
                                className="inline -mt-2"
                            />
                            <span className="ml-3">Kembali</span>
                        </Link>
                    </div>

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="mb-5">
                                <h1 className="text-xl font-bold">
                                    Presensi Siswa
                                </h1>
                                <h2 className="text-gray-700 mb-3">
                                    {sct.subject.name} | {sct.classroom.name}
                                </h2>
                                <div className="flex gap-3 justify-between items-center mb-4">
                                    <input
                                        className="rounded-md border px-2 py-1"
                                        type="date"
                                        readOnly
                                        value={selectedDate}
                                    />
                                    <div className="flex gap-2 items-center">
                                        <input
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
                            </div>

                            <div>
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b-2">
                                            <th className="text-left">Siswa</th>
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
                                                                <p className="text-sm">
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
                                                            ].map((status) => (
                                                                <div
                                                                    key={status}
                                                                    className="relative"
                                                                >
                                                                    <input
                                                                        type="radio"
                                                                        name={`attendance-${student.id}`}
                                                                        id={`attendance-${student.id}-${status}`}
                                                                        value={
                                                                            status
                                                                        }
                                                                        checked={
                                                                            attendance[
                                                                                student
                                                                                    .id
                                                                            ] ==
                                                                            status
                                                                        }
                                                                        onChange={() =>
                                                                            setStatus(
                                                                                student.id,
                                                                                status
                                                                            )
                                                                        }
                                                                        className="absolute opacity-0 w-0 h-0"
                                                                    />
                                                                    <label
                                                                        htmlFor={`attendance-${student.id}-${status}`}
                                                                        className={`p-2 w-10 h-10 flex items-center justify-center rounded-full border-[1px] cursor-pointer ${
                                                                            attendance[
                                                                                student
                                                                                    .id
                                                                            ] ===
                                                                            status
                                                                                ? "bg-blue-500 text-white border-blue-500"
                                                                                : "border-[#898989] text-[#898989]"
                                                                        }`}
                                                                    >
                                                                        {status}
                                                                    </label>
                                                                </div>
                                                            ))}
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
                                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                    >
                                        Simpan Absensi
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
