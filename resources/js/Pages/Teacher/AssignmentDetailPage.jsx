import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import moment from "moment";
import { useEffect, useState } from "react";

export default function AssignmentDetailPage({
    auth,
    sct,
    class_students_count,
    lesson,
    assignment,
    academic_period,
}) {
    const [countdown, setCountdown] = useState("");

    let parsedAttachments = [];

    try {
        parsedAttachments = JSON.parse(lesson.attachments || "[]");
        if (!Array.isArray(parsedAttachments)) {
            parsedAttachments = [];
        }
    } catch (error) {
        console.error("Gagal parsing attachments:", error);
        parsedAttachments = [];
    }

    const [hasAssignment, setHasAssignment] = useState(false);
    useEffect(() => {
        setHasAssignment(!!assignment);
    }, [assignment]);
    useEffect(() => {
        if (!hasAssignment || !assignment) return; // Pastikan assignment ada

        const updateCountdown = () => {
            const deadline = moment(
                `${assignment.due_date} ${assignment.due_time}`,
                "YYYY-MM-DD HH:mm"
            );
            const now = moment();
            const diff = deadline.diff(now);

            if (diff <= 0) {
                setCountdown("Waktu telah habis");
                return;
            }

            const duration = moment.duration(diff);
            setCountdown(
                `${duration.days()}d ${duration.hours()}h ${duration.minutes()}m ${duration.seconds()}s`
            );
        };

        updateCountdown();
        const timer = setInterval(updateCountdown, 1000);
        return () => clearInterval(timer);
    }, [hasAssignment, assignment?.due_date, assignment?.due_time]); // Gunakan optional chaining

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Assignment
                </h2>
            }
        >
            <Head title="Assignmet Detail" />

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
                            <h3 className="text-[#D0D0D0]">Jumlah Murid</h3>
                            <p className="text-xl font-medium">
                                {class_students_count}
                            </p>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-[#D0D0D0]">Periode Akademik</h3>
                            <p className="text-xl font-medium">
                                {academic_period}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="py-12">
                <div className="px-20 max-w-screen-2xl mx-auto">
                    <div className="flex gap-5">
                        <div className="min-w-80">
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
                        <div className="flex-1">
                            <h1 className="font-semibold text-xl text-black/70 mb-3">
                                {hasAssignment ? assignment.name : lesson.topic}{" "}
                                {">"} {sct.subject.name}
                            </h1>
                            {/* <div className="bg-white rounded-md mb-3">
                                <div className="p-3">
                                    <p className="font-medium">Sisa Waktu:</p>
                                </div>
                                <hr className="border-t-2" />
                                <div className="p-3">
                                    <p>
                                        <span className="font-semibold text-lg text-[#6F9CEE]">
                                            {countdown}
                                        </span>
                                    </p>
                                </div>
                            </div>
                            <div className="bg-white">
                                <div className="p-3">
                                    <div className="flex gap-5 items-center justify-between">
                                        <span className="font-medium text-lg">
                                            Jawaban:
                                        </span>
                                        <button>Riwayat Pengumpulan</button>
                                        <button>Kirim Jawaban</button>
                                    </div>
                                </div>
                                <hr className="border-t-2" />
                                <div className="p-3">
                                    <textarea name="" id=""></textarea>
                                </div>
                            </div> */}
                            <div className="bg-white rounded-md mb-3">
                                <div className="p-3">
                                    <p className="font-bold mb-5 text-xl">
                                        {hasAssignment
                                            ? assignment.name
                                            : lesson.topic}
                                    </p>
                                    <p>
                                        {hasAssignment
                                            ? assignment.description
                                            : lesson.description}
                                    </p>

                                    <div>
                                        {parsedAttachments.length > 0 && (
                                            <div className="mt-4">
                                                <h4 className="text-sm font-semibold text-black mb-2">
                                                    File Lampiran
                                                </h4>
                                                <div className="space-y-2">
                                                    {parsedAttachments.map(
                                                        (filePath, index) => {
                                                            const fileName =
                                                                filePath
                                                                    .split("/")
                                                                    .pop();
                                                            return (
                                                                <div
                                                                    key={index}
                                                                    className="flex items-center bg-[#E2E7FF] p-3 rounded-md"
                                                                >
                                                                    <svg
                                                                        className="w-5 h-5 mr-2 text-gray-500"
                                                                        fill="none"
                                                                        stroke="currentColor"
                                                                        viewBox="0 0 24 24"
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                    >
                                                                        <path
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                            strokeWidth={
                                                                                2
                                                                            }
                                                                            d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                                                                        />
                                                                    </svg>
                                                                    <a
                                                                        href={`/${filePath}`}
                                                                        download={
                                                                            fileName
                                                                        }
                                                                        className="text-gray-500 hover:text-blue-800 text-sm font-medium"
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                    >
                                                                        {
                                                                            fileName
                                                                        }
                                                                    </a>
                                                                </div>
                                                            );
                                                        }
                                                    )}
                                                </div>
                                            </div>
                                        )}
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
