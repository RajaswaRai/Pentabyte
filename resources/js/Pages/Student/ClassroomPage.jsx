import Modal from "@/Components/Modal";
import Assignment from "@/Components/pentabyte/Assignment";
import Message from "@/Components/pentabyte/Message";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Inertia } from "@inertiajs/inertia";
import { Head, router } from "@inertiajs/react";
import moment from "moment";
import { useState } from "react";
import Comments from "../Features/Comments";

export default function ClassroomPage({
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
                                    href=""
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
                        <div className="flex-[2]">
                            {/* Lessons */}
                            {lessons.map((x, i) => (
                                <Timeline key={`lesson_${i}`} lesson={x} />
                            ))}
                        </div>
                        <div className="flex-1 mt-10">
                            <div className="mb-5">
                                <h3 className="mb-2 font-semibold">
                                    Tugas belum dikumpulkan
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
                                            Tidak ada tugas{" "}
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
        </AuthenticatedLayout>
    );
}

const Timeline = ({ lesson }) => {
    console.log(lesson);

    return (
        <div className="bg-white py-8 px-12 rounded-lg">
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
                        {/* {"Menambahkan tugas > "}
                        <span className="text-[#6DD672]">sesi ke 1</span> */}
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

                {/* <div>
                    <Attachment className="mb-5" />
                </div> */}
            </div>

            {/* <div className="border-[1px] border-[#D4D4D4] p-5 rounded-xl mb-5">
                <div className="flex gap-3 items-center mb-4">
                    <div className="flex-1">
                        <Assignment title={""} date={""} time={""} />
                    </div>
                    <a className="text-white px-5 py-2 rounded-lg bg-[#27B1E0] text-sm font-semibold">
                        Lihat Detail
                    </a>
                </div>
                <p className="text-black/50 text-xs font-medium">
                    Lorem ipsum dolor
                </p>
            </div> */}

            <hr className="border-t-[1px] border-[#D4D4D4] mb-5" />

            <div className="flex justify-between gap-3">
                <CommentModalButton lesson_id={lesson.id} />
                <div>
                    <div>
                        <img
                            src="/assets/svg/Back.svg"
                            alt="share"
                            className="inline -mt-1"
                        />
                        <span className="ml-2 text-sm font-medium text-black/50">
                            Share
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

function CommentModalButton({ lesson_id }) {
    const [showModal, setShowModal] = useState(false);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [commentText, setCommentText] = useState("");

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
        } catch (error) {
            setComments([]);
        }
        setLoading(false);
    };

    const openModal = () => {
        setShowModal(true);
        loadComments();
    };

    return (
        <>
            <button onClick={openModal} className="flex items-center">
                <img
                    src="/assets/svg/comment.svg"
                    alt="comment"
                    className="-mt-1"
                />
                <span className="ml-2 text-sm font-medium text-black/50">
                    Komentar
                </span>
            </button>

            <Modal
                show={showModal}
                onClose={() => setShowModal(false)}
                maxWidth="2xl"
            >
                <div className="p-6">
                    <div className="min-h-[50vh] overflow-hidden scroll-auto flex flex-col space-y-4 max-h-64 overflow-y-auto">
                        <Comments comments={comments} loading={loading} />
                    </div>
                    <div className="mt-4">
                        <textarea
                            placeholder="Tulis komentar..."
                            rows={3}
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring focus:border-blue-300"
                        />
                        <button
                            onClick={() => {
                                if (!commentText.trim()) return;

                                router.post(route('lesson.comments.store', lesson_id),
                                    { content: commentText }, // <-- langsung objek data di argumen kedua
                                    {
                                        preserveScroll: true,
                                        onSuccess: () => {
                                            setCommentText("");
                                            loadComments();
                                        },
                                        onError: (errors) => {
                                            console.error("Validasi gagal:", errors);
                                        },
                                    }
                                );
                            }} 
                            className="mt-3 px-4 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600">
                            Kirim
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    );
}

const Attachment = (props) => {
    return (
        <div {...props}>
            <div className="bg-[#E2E7FF] px-4 py-2 rounded-md flex justify-between gap-5 items-center">
                <div className="flex gap-5 items-center">
                    <img
                        className="h-5"
                        src="/assets/svg/docs.svg"
                        alt="docs.svg"
                    />
                    <p className="text-black/50 font-medium">
                        Lorem ipsum dolor sit amet.doc
                    </p>
                </div>
                <button className="text-[#6DD672] text-sm font-semibold">
                    Download
                </button>
            </div>
        </div>
    );
};
