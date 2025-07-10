import Modal from "@/Components/Modal";
import Assignment from "@/Components/pentabyte/Assignment";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import moment from "moment";
import { useState } from "react";
import Comments from "../Features/Comments";

export default function AbsencePage({
    auth,
    sct,
    lessons,
    assignments,
    class_students_count,
}) {
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
                        <InfoBlock
                            label="Guru Pengajar"
                            value={sct.teacher.full_name}
                        />
                        <InfoBlock
                            label="Jumlah Peserta"
                            value={class_students_count}
                        />
                        <InfoBlock
                            label="Periode Akademik"
                            value={`${sct.academic_year}/${
                                parseInt(sct.academic_year) + 1
                            }`}
                        />
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="py-12">
                <div className="px-20 max-w-screen-2xl mx-auto">
                    <div className="flex gap-5">
                        <div className="flex-1">
                            <BackLink />
                            <div className="bg-white p-5 rounded-lg">
                                {/* Additional sidebar or info can go here */}
                            </div>
                        </div>

                        {/* Lessons */}
                        <div className="flex-[2] space-y-5">
                            {lessons.map((lesson) => (
                                <Timeline key={lesson.id} lesson={lesson} />
                            ))}
                        </div>

                        {/* Sidebar: Assignments & Attendance Summary */}
                        <div className="flex-1 mt-10 space-y-8">
                            <AssignmentsSection assignments={assignments} />
                            <AttendanceSummary />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function InfoBlock({ label, value }) {
    return (
        <div className="flex-1">
            <h3 className="text-[#D0D0D0] text-sm">{label}</h3>
            <p className="text-xl font-medium">{value}</p>
        </div>
    );
}

function BackLink() {
    return (
        <div className="mb-5">
            <a
                href="#"
                className="inline-flex items-center text-[#133475] font-semibold mb-5"
            >
                <img
                    src="/assets/svg/Back.svg"
                    alt="back"
                    className="inline -mt-2"
                />
                <span className="ml-3">Kembali</span>
            </a>
        </div>
    );
}

function AssignmentsSection({ assignments }) {
    return (
        <div>
            <h3 className="mb-2 font-semibold text-[#133475]">
                Tugas belum dikumpulkan
            </h3>
            <div className="bg-white p-4 rounded-md space-y-3">
                {assignments.length > 0 ? (
                    assignments.map((x) => (
                        <Assignment
                            href={`/lesson/${x.lesson.id}/assignment/${x.id}`}
                            key={x.id}
                            date={x.due_date}
                            time={x.due_time}
                            title={x.name}
                        />
                    ))
                ) : (
                    <p className="text-sm text-black/50 font-medium">
                        Tidak ada tugas
                    </p>
                )}
            </div>
        </div>
    );
}

function AttendanceSummary() {
    return (
        <div>
            <h3 className="font-semibold mb-2">
                Presensi{" "}
                <img
                    src="/assets/svg/circle_right_alt.svg"
                    alt="presence"
                    className="inline -mt-1"
                />
            </h3>
            <p className="text-xs text-black/50 font-medium mb-3">
                Terakhir diperbarui: Selasa, 18 Maret 2025, 09:40
            </p>
            <div className="bg-white p-4 rounded-md space-y-4">
                <PresenceStats
                    present={3}
                    total={16}
                    sick={0}
                    leave={0}
                    absent={1}
                />
                <button className="text-[#FDA262] font-semibold text-sm">
                    Lihat Detail presensi
                </button>
            </div>
        </div>
    );
}

function PresenceStats({ present, total, sick, leave, absent }) {
    return (
        <>
            <div className="mb-3">
                <h4 className="text-sm font-semibold mb-1">Kehadiran</h4>
                <p className="text-xs text-[#4C7AD1]">
                    {present} dari total {total} sesi
                </p>
            </div>
            <div className="flex items-center justify-between mx-5">
                {[
                    { label: "Hadir", value: present },
                    { label: "Sakit", value: sick },
                    { label: "Izin", value: leave },
                    { label: "Alpha", value: absent },
                ].map((stat) => (
                    <div key={stat.label}>
                        <h5 className="text-xs text-black/50">{stat.label}</h5>
                        <p className="text-sm font-semibold text-center">
                            {stat.value}
                        </p>
                    </div>
                ))}
            </div>
        </>
    );
}

function Timeline({ lesson }) {
    return (
        <div className="bg-white py-8 px-12 rounded-lg space-y-5">
            <div className="flex gap-3 mb-5">
                <img
                    className="rounded-full w-16 h-16 bg-slate-300 object-cover"
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
                <p className="text-black/50 font-medium">
                    {lesson.description}
                </p>
            </div>

            <hr className="border-t-[1px] border-[#D4D4D4]" />

            <div className="flex justify-between items-center">
                <CommentModalButton lesson_id={lesson.id} />
                <ShareButton />
            </div>
        </div>
    );
}

function ShareButton() {
    return (
        <button className="flex items-center text-black/50 text-sm font-medium">
            <img
                src="/assets/svg/Back.svg"
                alt="share"
                className="inline -mt-1"
            />
            <span className="ml-2">Share</span>
        </button>
    );
}

function CommentModalButton({ lesson_id }) {
    const [showModal, setShowModal] = useState(false);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(false);

    const loadComments = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/lesson/${lesson_id}/comments`, {
                headers: {
                    "X-Requested-With": "XMLHttpRequest",
                    Accept: "application/json",
                },
            });
            const data = await response.json();
            setComments(data.comments);
        } catch {
            setComments([]);
        }
        setLoading(false);
    };

    const openModal = () => {
        loadComments();
        setShowModal(true);
    };

    return (
        <>
            <button onClick={openModal} className="flex items-center text-sm">
                <img
                    src="/assets/svg/comment.svg"
                    alt="comment"
                    className="-mt-1"
                />
                <span className="ml-2 text-black/50">Komentar</span>
            </button>

            <Modal
                show={showModal}
                onClose={() => setShowModal(false)}
                maxWidth="2xl"
            >
                <div className="p-6 space-y-4">
                    <div className="max-h-64 overflow-y-auto">
                        <Comments comments={comments} loading={loading} />
                    </div>
                    <CommentInput />
                </div>
            </Modal>
        </>
    );
}

function CommentInput() {
    return (
        <>
            <textarea
                placeholder="Tulis komentar..."
                rows={3}
                className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring focus:border-blue-300"
            />
            <button className="mt-3 px-4 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600">
                Kirim
            </button>
        </>
    );
}
