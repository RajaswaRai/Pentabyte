import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import moment from "moment";
import { useEffect, useState } from "react";

export default function AssignmentDetailPage({
    auth,
    sct,
    class_students_count,
    assignment,
}) {
    const [countdown, setCountdown] = useState("");

    useEffect(() => {
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

            const totalSeconds = Math.floor(moment.duration(diff).asSeconds());

            const days = Math.floor(totalSeconds / (60 * 60 * 24));
            const hours = Math.floor(
                (totalSeconds % (60 * 60 * 24)) / (60 * 60)
            );
            const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
            const seconds = totalSeconds % 60;

            setCountdown(`${days}d ${hours}h ${minutes}m ${seconds}s`);
        };

        updateCountdown();
        const timer = setInterval(updateCountdown, 1000);
        return () => clearInterval(timer);
    }, [assignment.due_date, assignment.due_time]);

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
                        <div className="min-w-80">
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
                            <div className="bg-white p-5 rounded-lg"></div>
                        </div>
                        <div className="flex-1">
                            <h1 className="font-semibold text-xl text-black/70 mb-3">
                                {assignment.name} {">"} {sct.subject.name}
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
                                        {assignment.name}
                                    </p>
                                    <p>{assignment.description}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
