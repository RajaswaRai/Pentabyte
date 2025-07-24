import Assignment from "@/Components/pentabyte/Assignment";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import moment from "moment";
import { useState } from "react";

export default function ClassroomPage({
    auth,
    sct,
    lessons,
    assignments,
    class_students_count,
    academic_periode,
}) {
    const [activeTab, setActiveTab] = useState("timeline");

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
                            <h3 className="text-[#D0D0D0]">Jumlah Murid</h3>
                            <p className="text-xl font-medium">
                                {class_students_count}
                            </p>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-[#D0D0D0]">Periode Akademik</h3>
                            <p className="text-xl font-medium">
                                {academic_periode}
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
                                <Link
                                    className="mb-5 font-semibold text-[#133475]"
                                    href={route("dashboard")}
                                >
                                    <img
                                        src="/assets/svg/Back.svg"
                                        alt="back"
                                        className="inline -mt-2"
                                    />
                                    <span className="ml-3">Kembali</span>
                                </Link>
                            </div>
                            <div className="bg-white p-3 pr-0 rounded-lg">
                                <button
                                    onClick={() => setActiveTab("timeline")}
                                    className={`rounded-md rounded-r-none block p-2 w-full ${
                                        activeTab === "timeline"
                                            ? "bg-[#E2E7FF]"
                                            : ""
                                    }`}
                                >
                                    Timeline
                                </button>
                                <button
                                    onClick={() => setActiveTab("assignment")}
                                    className={`rounded-md rounded-r-none block p-2 w-full ${
                                        activeTab === "assignment"
                                            ? "bg-[#E2E7FF]"
                                            : ""
                                    }`}
                                >
                                    Assignment only
                                </button>
                                <button
                                    onClick={() => setActiveTab("files")}
                                    className={`rounded-md rounded-r-none block p-2 w-full ${
                                        activeTab === "files"
                                            ? "bg-[#E2E7FF]"
                                            : ""
                                    }`}
                                >
                                    Files only
                                </button>
                            </div>
                        </div>
                        <div className="flex-[2]">
                            <div>
                                {/* Tab Content */}
                                {activeTab === "timeline" && (
                                    <div>
                                        {lessons.map((x, i) => (
                                            <Timeline
                                                sct={sct}
                                                key={`lesson_${i}`}
                                                lesson={x}
                                            />
                                        ))}
                                    </div>
                                )}

                                {activeTab === "assignment" && (
                                    <div>
                                        {lessons
                                            .filter(
                                                (x) =>
                                                    !!x.assignment &&
                                                    (Array.isArray(x.assignment)
                                                        ? x.assignment.length >
                                                          0
                                                        : true)
                                            )
                                            .map((x, i) => (
                                                <Timeline
                                                    sct={sct}
                                                    key={`lesson_${i}`}
                                                    lesson={x}
                                                />
                                            ))}
                                    </div>
                                )}

                                {activeTab === "files" && (
                                    <div className="bg-white py-6 px-6 rounded-md">
                                        {lessons.length > 0 ? (
                                            <div className="space-y-4">
                                                {lessons
                                                    .filter((lesson) => {
                                                        try {
                                                            if (
                                                                !lesson.attachments
                                                            )
                                                                return false;
                                                            const parsed =
                                                                JSON.parse(
                                                                    lesson.attachments
                                                                );
                                                            return (
                                                                Array.isArray(
                                                                    parsed
                                                                ) &&
                                                                parsed.length >
                                                                    0
                                                            );
                                                        } catch (e) {
                                                            return false;
                                                        }
                                                    })
                                                    .map(
                                                        (
                                                            lesson,
                                                            lessonIndex
                                                        ) => {
                                                            const attachments =
                                                                JSON.parse(
                                                                    lesson.attachments
                                                                );
                                                            return (
                                                                <div
                                                                    key={
                                                                        "lesson_" +
                                                                        lessonIndex
                                                                    }
                                                                    className="grid grid-cols-1 gap-3"
                                                                >
                                                                    {attachments.map(
                                                                        (
                                                                            filePath,
                                                                            fileIndex
                                                                        ) => {
                                                                            const fileName =
                                                                                filePath
                                                                                    .split(
                                                                                        "/"
                                                                                    )
                                                                                    .pop();
                                                                            const fileExtension =
                                                                                fileName
                                                                                    .split(
                                                                                        "."
                                                                                    )
                                                                                    .pop()
                                                                                    .toLowerCase();
                                                                            const fileIcon =
                                                                                getFileIcon(
                                                                                    fileExtension
                                                                                );

                                                                            return (
                                                                                <div
                                                                                    key={`file-${lessonIndex}-${fileIndex}`}
                                                                                    className="border rounded-md p-3 hover:bg-gray-50 transition"
                                                                                >
                                                                                    <div className="flex items-center">
                                                                                        <div className="mr-3 text-gray-500">
                                                                                            {
                                                                                                fileIcon
                                                                                            }
                                                                                        </div>
                                                                                        <div className="flex-1 min-w-0">
                                                                                            <a
                                                                                                href={`/${filePath}`}
                                                                                                download={
                                                                                                    fileName
                                                                                                }
                                                                                                className="text-blue-600 hover:text-blue-800 text-sm font-medium truncate block"
                                                                                                target="_blank"
                                                                                                rel="noopener noreferrer"
                                                                                                title={
                                                                                                    fileName
                                                                                                }
                                                                                            >
                                                                                                {
                                                                                                    fileName
                                                                                                }
                                                                                            </a>
                                                                                            <div className="text-xs text-gray-500">
                                                                                                {formatFileSize(
                                                                                                    filePath
                                                                                                )}{" "}
                                                                                                •{" "}
                                                                                                {fileExtension.toUpperCase()}
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            );
                                                                        }
                                                                    )}
                                                                </div>
                                                            );
                                                        }
                                                    )}
                                            </div>
                                        ) : (
                                            <p className="text-center text-gray-500">
                                                Belum ada file yang tersedia.
                                            </p>
                                        )}
                                    </div>
                                )}

                                {activeTab === "absensi" && (
                                    <div>
                                        <Link
                                            href={route("classroom.absence", {
                                                sct_id: sct.id,
                                            })}
                                            className="bg-white mb-5 border-2 text-center block w-full rounded-md p-3"
                                        >
                                            + Absensi
                                        </Link>

                                        {/* Kelompokkan absensi berdasarkan tanggal */}
                                        {(() => {
                                            // Kelompokkan data absensi berdasarkan tanggal
                                            const groupedByDate =
                                                sct.absences.reduce(
                                                    (acc, absence) => {
                                                        const dateStr =
                                                            absence.date;
                                                        if (!acc[dateStr]) {
                                                            acc[dateStr] = {
                                                                date: absence.date,
                                                                absences: [],
                                                                counts: {
                                                                    present: 0,
                                                                    sick: 0,
                                                                    permission: 0,
                                                                    alpha: 0,
                                                                },
                                                            };
                                                        }
                                                        acc[
                                                            dateStr
                                                        ].absences.push(
                                                            absence
                                                        );

                                                        // Hitung status
                                                        if (absence.status == 0)
                                                            acc[dateStr].counts
                                                                .present++;
                                                        else if (
                                                            absence.status == 1
                                                        )
                                                            acc[dateStr].counts
                                                                .permission++;
                                                        else if (
                                                            absence.status == 2
                                                        )
                                                            acc[dateStr].counts
                                                                .alpha++;
                                                        else if (
                                                            absence.status == 3
                                                        )
                                                            acc[dateStr].counts
                                                                .sick++;

                                                        return acc;
                                                    },
                                                    {}
                                                );

                                            const sortedDates = Object.keys(
                                                groupedByDate
                                            ).sort(
                                                (a, b) =>
                                                    new Date(b) - new Date(a)
                                            );

                                            return sortedDates.length > 0 ? (
                                                sortedDates.map((dateStr) => {
                                                    const group =
                                                        groupedByDate[dateStr];
                                                    const totalStudents =
                                                        class_students_count;
                                                    const presentCount =
                                                        group.counts.present;

                                                    return (
                                                        <div
                                                            key={dateStr}
                                                            className="bg-white py-6 px-6 rounded-md text-sm mb-4"
                                                        >
                                                            <div className="flex items-center justify-between">
                                                                <div>
                                                                    <h2 className="font-medium">
                                                                        {moment(
                                                                            dateStr
                                                                        ).format(
                                                                            "dddd, DD MMMM YYYY"
                                                                        )}
                                                                    </h2>
                                                                </div>
                                                                <div className="text-right">
                                                                    <Link
                                                                        href={route(
                                                                            "classroom.absence.show",
                                                                            {
                                                                                sct_id: sct.id,
                                                                                date: dateStr,
                                                                            }
                                                                        )}
                                                                        className="p-1 bg-[#ADEAAF] rounded-full text-xs px-4 block mt-2 text-center"
                                                                    >
                                                                        Detail
                                                                    </Link>
                                                                </div>
                                                            </div>

                                                            {/* Statistik kehadiran */}
                                                            <div className="flex items-center justify-between mt-4 mx-5">
                                                                <div className="text-center">
                                                                    <h5 className="text-xs text-black/50">
                                                                        Hadir
                                                                    </h5>
                                                                    <p className="text-sm font-semibold">
                                                                        {
                                                                            group
                                                                                .counts
                                                                                .present
                                                                        }
                                                                    </p>
                                                                </div>
                                                                <div className="text-center">
                                                                    <h5 className="text-xs text-black/50">
                                                                        Sakit
                                                                    </h5>
                                                                    <p className="text-sm font-semibold">
                                                                        {
                                                                            group
                                                                                .counts
                                                                                .sick
                                                                        }
                                                                    </p>
                                                                </div>
                                                                <div className="text-center">
                                                                    <h5 className="text-xs text-black/50">
                                                                        Izin
                                                                    </h5>
                                                                    <p className="text-sm font-semibold">
                                                                        {
                                                                            group
                                                                                .counts
                                                                                .permission
                                                                        }
                                                                    </p>
                                                                </div>
                                                                <div className="text-center">
                                                                    <h5 className="text-xs text-black/50">
                                                                        Alpha
                                                                    </h5>
                                                                    <p className="text-sm font-semibold">
                                                                        {
                                                                            group
                                                                                .counts
                                                                                .alpha
                                                                        }
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })
                                            ) : (
                                                <div className="bg-white py-6 px-6 rounded-md text-center text-gray-500">
                                                    Belum ada data absensi
                                                </div>
                                            );
                                        })()}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex-1 mt-10">
                            <div className="mb-5">
                                <h3 className="mb-2 font-semibold">
                                    Tugas yang sedang berjalan
                                </h3>
                                <div className="bg-white p-4 rounded-md">
                                    {assignments.length > 0 ? (
                                        assignments
                                            .filter((x) => {
                                                // Cek apakah deadline sudah lewat
                                                const dueDate = new Date(
                                                    `${x.due_date} ${x.due_time}`
                                                );
                                                const now = new Date();
                                                return dueDate > now;
                                            })
                                            .map((x, i) => (
                                                <div
                                                    className="mb-3"
                                                    key={`assignment_${i}`}
                                                >
                                                    <Assignment
                                                        href={route(
                                                            "classroom.lesson",
                                                            {
                                                                lesson_id:
                                                                    x.lesson.id,
                                                                id: x.id,
                                                            }
                                                        )}
                                                        date={x.due_date}
                                                        time={x.due_time}
                                                        title={x.name}
                                                    />
                                                </div>
                                            ))
                                    ) : (
                                        <p className="text-sm text-black/50 font-medium">
                                            Tidak ada tugas...
                                        </p>
                                    )}
                                </div>
                            </div>
                            {/* <div>
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
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

// Helper function to get file icon based on extension
const getFileIcon = (extension) => {
    const iconClass = "w-6 h-6";
    switch (extension) {
        case "pdf":
            return (
                <svg
                    className={iconClass}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 9V7a2 2 0 012-2h2a2 2 0 012 2v2"
                    />
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 13h6"
                    />
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 17h6"
                    />
                </svg>
            );
        case "doc":
        case "docx":
            return (
                <svg
                    className={iconClass}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 9V7a2 2 0 012-2h2a2 2 0 012 2v2"
                    />
                </svg>
            );
        case "xls":
        case "xlsx":
            return (
                <svg
                    className={iconClass}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 9V7a2 2 0 012-2h2a2 2 0 012 2v2"
                    />
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 13h6"
                    />
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 17h6"
                    />
                </svg>
            );
        case "ppt":
        case "pptx":
            return (
                <svg
                    className={iconClass}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 9V7a2 2 0 012-2h2a2 2 0 012 2v2"
                    />
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 13h6"
                    />
                </svg>
            );
        case "jpg":
        case "jpeg":
        case "png":
        case "gif":
            return (
                <svg
                    className={iconClass}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                </svg>
            );
        case "zip":
        case "rar":
            return (
                <svg
                    className={iconClass}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 9V7a2 2 0 012-2h2a2 2 0 012 2v2"
                    />
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 13h6"
                    />
                </svg>
            );
        default:
            return (
                <svg
                    className={iconClass}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                </svg>
            );
    }
};

// Helper function to format file size (mock - in a real app you'd need actual file size)
const formatFileSize = (filePath) => {
    // This is a mock implementation
    // In a real app, you'd need to get the actual file size from your backend
    const sizes = ["KB", "MB"];
    const randomSize = Math.floor(Math.random() * 900) + 100;
    const randomUnit = sizes[Math.floor(Math.random() * sizes.length)];
    return `${randomSize} ${randomUnit}`;
};

const Timeline = ({ sct, lesson }) => {
    const [showLessonModal, setShowLessonModal] = useState(false);
    const [modalLessonData, setModalLessonData] = useState({
        topic: lesson.topic || "",
        description: lesson.description || "",
    });

    // Parse attachments dari string JSON ke array
    const getAttachments = () => {
        try {
            if (!lesson.attachments) return [];
            const parsed = JSON.parse(lesson.attachments);
            return Array.isArray(parsed) ? parsed : [];
        } catch (e) {
            return [];
        }
    };

    const attachments = getAttachments();

    const openLessonModal = () => {
        setShowLessonModal(true);
    };

    const closeLessonModal = () => {
        setShowLessonModal(false);
    };

    return (
        <div className="bg-white py-8 mb-5 px-12 rounded-lg relative group hover:shadow-lg transition">
            {!lesson.assignment && (
                <Link
                    href={route("classroom.lesson", {
                        id: sct.id,
                        lesson_id: lesson.id,
                    })}
                    className="block" // Add block class to make it fill the container
                >
                    <div className="flex gap-3 mb-5">
                        <img
                            className="rounded-full w-16 h-16 bg-slate-300 overflow-hidden"
                            src="/assets/img/Avatar(1).png"
                            alt="user_profile"
                        />
                        <div>
                            <p className="text-xl font-semibold">
                                {
                                    lesson.subject_classroom_teacher.teacher
                                        .full_name
                                }
                            </p>
                            <p className="text-black/50 font-medium">
                                {moment(lesson.created_at).fromNow()}
                            </p>
                        </div>
                    </div>

                    <div>
                        <h1 className="font-bold text-2xl mb-2">
                            {lesson.topic}
                        </h1>
                        <p className="text-black/50 font-medium mb-2">
                            {lesson.description}
                        </p>
                    </div>
                </Link>
            )}

            {lesson.assignment && (
                <div>
                    <Link
                        href={route("classroom.lesson", {
                            id: sct.id,
                            lesson_id: lesson.id,
                        })}
                        className="block" // Add block class to make it fill the container
                    >
                        <div className="flex gap-3 mb-5">
                            <img
                                className="rounded-full w-16 h-16 bg-slate-300 overflow-hidden"
                                src="/assets/img/Avatar(1).png"
                                alt="user_profile"
                            />
                            <div>
                                <p className="text-xl font-semibold">
                                    {
                                        lesson.subject_classroom_teacher.teacher
                                            .full_name
                                    }
                                </p>
                                <p className="text-black/50 font-medium">
                                    {moment(lesson.created_at).fromNow()}
                                </p>
                            </div>
                        </div>

                        <div className="border-2 rounded-md p-4 flex gap-5 justify-left items-center">
                            <img
                                className="p-3 rounded-full bg-[#C5DCFA]"
                                src="/assets/svg/Book_duotone.svg"
                                alt="Tugas"
                            />
                            <div>
                                <h1 className="font-bold text-2xl mb-2">
                                    {lesson.topic}
                                </h1>
                                <p className="text-sm text-black/70">
                                    Tenggat:{" "}
                                    <span className="font-medium text-black">
                                        {moment(
                                            lesson.assignment.due_date
                                        ).format("D MMMM YYYY")}{" "}
                                        pukul {lesson.assignment.due_time}
                                    </span>
                                </p>
                            </div>
                        </div>
                    </Link>
                </div>
            )}

            {/* Tampilkan file attachments jika ada */}
            {attachments.length > 0 && (
                <div className="mt-4">
                    <h4 className="text-sm font-semibold text-black mb-2">
                        File Lampiran
                    </h4>
                    <div className="space-y-2">
                        {attachments.map((filePath, index) => {
                            const fileName = filePath.split("/").pop();
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
                                            strokeWidth={2}
                                            d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                                        />
                                    </svg>
                                    <a
                                        href={`/${filePath}`}
                                        download={fileName}
                                        className="text-gray-500 hover:text-blue-800 text-sm font-medium"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {fileName}
                                    </a>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};
