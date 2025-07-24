import { Head, useForm, router } from "@inertiajs/react";
import { useMemo, useState } from "react";
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
} from "@tanstack/react-table";
import Modal from "@/Components/Modal";
import AdminLayout from "@/Layouts/AdminLayout";

export default function ClassroomPage({
    auth,
    classrooms,
    majors,
    teachers,
    semesters,
    noclass_students,
}) {
    const { data, setData, post, reset, processing, errors } = useForm({
        name: "",
        semester_id: "",
        homeroom_teacher_id: "",
        major_id: "",
    });

    const {
        data: editData,
        setData: setEditData,
        put,
        reset: resetEditForm,
        processing: editProcessing,
        errors: editErrors,
    } = useForm({
        name: "",
        semester_id: "",
        homeroom_teacher_id: "",
        major_id: "",
    });

    const { delete: destroy } = useForm();

    const [showEditModal, setShowEditModal] = useState(false);
    const [editingClassroom, setEditingClassroom] = useState(null);
    const [showAddClassroomModal, setShowAddClassroomModal] = useState(false);
    const [showRandomizeModal, setShowRandomizeModal] = useState(false);
    const [selectedSemesterId, setSelectedSemesterId] = useState("");
    const [selectedMajorId, setSelectedMajorId] = useState("");
    const [randomizedStudentsByClass, setRandomizedStudentsByClass] = useState(
        new Map()
    );
    const [searchQuery, setSearchQuery] = useState("");
    const [filterSemester, setFilterSemester] = useState("");
    const [filterMajor, setFilterMajor] = useState("");

    const dataClassroom = useMemo(() => {
        return classrooms
            .filter((kelas) => {
                const matchSemester = filterSemester
                    ? kelas.semester_id == filterSemester
                    : true;
                const matchMajor = filterMajor
                    ? kelas.major_id == filterMajor
                    : true;
                const matchSearch = searchQuery
                    ? kelas.name
                          .toLowerCase()
                          .includes(searchQuery.toLowerCase())
                    : true;
                return matchSemester && matchMajor && matchSearch;
            })
            .map((s, idx) => ({
                id: s.id,
                no: idx + 1,
                name: s.name,
                semester_id: s.semester_id,
                semester: s.semester.name,
                major_id: s.major_id,
                major: s.major.name,
                homeroom_teacher_id: s.homeroom_teacher_id ?? "",
                homeroom: s.homeroom?.full_name,
            }));
    }, [classrooms, searchQuery, filterSemester, filterMajor]);

    function randomizeStudents() {
        if (!selectedSemesterId || !selectedMajorId) {
            alert("Silakan pilih semester dan jurusan terlebih dahulu.");
            return;
        }

        const filteredClassrooms = dataClassroom.filter(
            (kelas) =>
                kelas.semester_id == selectedSemesterId &&
                kelas.major_id == selectedMajorId
        );

        const totalClasses = filteredClassrooms.length;
        if (totalClasses === 0) {
            alert("Tidak ada kelas tersedia untuk semester dan jurusan ini.");
            return;
        }

        const filteredStudents = noclass_students.filter(
            (student) => student.major_id == selectedMajorId
        );

        if (filteredStudents.length === 0) {
            alert("Tidak ada siswa dari jurusan ini yang bisa diacak.");
            return;
        }

        const map = new Map();
        filteredClassrooms.forEach((kelas) => {
            map.set(kelas.id, []);
        });

        const shuffled = [...filteredStudents].sort(() => Math.random() - 0.5);

        shuffled.forEach((student, index) => {
            const classIndex = index % totalClasses;
            const classId = filteredClassrooms[classIndex].id;
            map.get(classId).push(student);
        });

        setRandomizedStudentsByClass(map);
    }

    function saveRandomizedStudents() {
        const payload = [];

        randomizedStudentsByClass.forEach((students, classroom_id) => {
            students.forEach((student) => {
                payload.push({
                    student_id: student.id,
                    classroom_id: classroom_id,
                });
            });
        });

        router.put(
            route("admin.classroom.student.bulk_move"),
            {
                students: payload,
            },
            {
                onSuccess: () => {
                    setShowRandomizeModal(false);
                    setRandomizedStudentsByClass(new Map());
                },
            }
        );
    }

    const columns = useMemo(
        () => [
            { header: "No", accessorKey: "no" },
            { header: "Nama Kelas", accessorKey: "name" },
            { header: "Wali Kelas", accessorKey: "homeroom" },
            { header: "Jurusan", accessorKey: "major" },
            { header: "Semester", accessorKey: "semester" },
            {
                header: "Aksi",
                cell: ({ row }) => {
                    const id = row.original.id;
                    return (
                        <div className="flex gap-2">
                            <button
                                onClick={() =>
                                    router.visit(
                                        route("admin.classroom.show", id)
                                    )
                                }
                                className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                            >
                                Detail
                            </button>
                            <button
                                onClick={() => {
                                    setEditingClassroom(row.original);
                                    setEditData({
                                        name: row.original.name,
                                        homeroom_teacher_id:
                                            row.original.homeroom_teacher_id ??
                                            "",
                                        major_id: row.original.major_id ?? "",
                                        semester_id:
                                            row.original.semester_id ?? "",
                                    });
                                    setShowEditModal(true);
                                }}
                                className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => {
                                    if (
                                        confirm(
                                            "Yakin ingin menghapus kelas ini?"
                                        )
                                    ) {
                                        destroy(
                                            route("admin.classroom.destroy", id)
                                        );
                                    }
                                }}
                                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                            >
                                Hapus
                            </button>
                        </div>
                    );
                },
            },
        ],
        []
    );

    const table = useReactTable({
        data: dataClassroom,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <>
            <Head title="Classroom" />

            {/* Modal Tambah, Edit, Randomize (sama seperti sebelumnya) */}

            {/* Modal Tambah Kelas */}
            <Modal
                show={showAddClassroomModal}
                onClose={() => setShowAddClassroomModal(false)}
            >
                <div className="p-6 space-y-4">
                    <h2 className="text-lg font-semibold">Tambah Kelas</h2>
                    <input
                        type="text"
                        value={data.name}
                        onChange={(e) => setData("name", e.target.value)}
                        className="w-full border rounded px-3 py-2"
                        placeholder="Nama Kelas"
                    />
                    {/* <label className="block text-sm font-medium">Jurusan</label> */}
                    <select
                        value={data.major_id}
                        onChange={(e) => setData("major_id", e.target.value)}
                        className="w-full border rounded px-3 py-2"
                    >
                        <option value="">-- Pilih Jurusan --</option>
                        {majors.map((m) => (
                            <option key={m.id} value={m.id}>
                                {m.name}
                            </option>
                        ))}
                    </select>

                    <select
                        value={data.semester_id}
                        onChange={(e) => setData("semester_id", e.target.value)}
                        className="w-full border rounded px-3 py-2"
                    >
                        <option value="">-- Pilih Semester --</option>
                        {semesters.map((s) => (
                            <option key={s.id} value={s.id}>
                                {s.name}
                            </option>
                        ))}
                    </select>
                    <select
                        value={data.homeroom_teacher_id}
                        onChange={(e) =>
                            setData("homeroom_teacher_id", e.target.value)
                        }
                        className="w-full border rounded px-3 py-2"
                    >
                        <option value="">-- Pilih Wali Kelas --</option>
                        {teachers.map((t) => (
                            <option key={t.id} value={t.id}>
                                {t.full_name}
                            </option>
                        ))}
                    </select>
                    <div className="flex justify-end gap-2">
                        <button
                            onClick={() => setShowAddClassroomModal(false)}
                            className="bg-gray-200 px-4 py-2 rounded"
                        >
                            Batal
                        </button>
                        <button
                            onClick={() =>
                                post(route("admin.classroom.store"), {
                                    onSuccess: () => {
                                        setShowAddClassroomModal(false);
                                        reset();
                                    },
                                })
                            }
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                        >
                            Simpan
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Modal Edit Kelas */}
            <Modal show={showEditModal} onClose={() => setShowEditModal(false)}>
                <div className="p-6 space-y-4">
                    <h2 className="text-lg font-semibold">Edit Kelas</h2>
                    <input
                        type="text"
                        value={editData.name}
                        onChange={(e) => setEditData("name", e.target.value)}
                        className="w-full border rounded px-3 py-2"
                    />
                    {/* <label className="block text-sm font-medium">Jurusan</label> */}
                    <select
                        value={editData.major_id}
                        onChange={(e) =>
                            setEditData("major_id", e.target.value)
                        }
                        className="w-full border rounded px-3 py-2"
                    >
                        <option value="">-- Pilih Jurusan --</option>
                        {majors.map((m) => (
                            <option key={m.id} value={m.id}>
                                {m.name}
                            </option>
                        ))}
                    </select>

                    <select
                        value={editData.semester_id}
                        onChange={(e) =>
                            setEditData("semester_id", e.target.value)
                        }
                        className="w-full border rounded px-3 py-2"
                    >
                        <option value="">-- Pilih Semester --</option>
                        {semesters.map((s) => (
                            <option key={s.id} value={s.id}>
                                {s.name}
                            </option>
                        ))}
                    </select>
                    <select
                        value={editData.homeroom_teacher_id}
                        onChange={(e) =>
                            setEditData("homeroom_teacher_id", e.target.value)
                        }
                        className="w-full border rounded px-3 py-2"
                    >
                        <option value="">-- Pilih Wali Kelas --</option>
                        {teachers.map((t) => (
                            <option key={t.id} value={t.id}>
                                {t.full_name}
                            </option>
                        ))}
                    </select>
                    <div className="flex justify-end gap-2">
                        <button
                            onClick={() => setShowEditModal(false)}
                            className="bg-gray-200 px-4 py-2 rounded"
                        >
                            Batal
                        </button>
                        <button
                            onClick={() => {
                                if (!editingClassroom?.id) return;
                                put(
                                    route(
                                        "admin.classroom.update",
                                        editingClassroom.id
                                    ),
                                    {
                                        onSuccess: () => {
                                            setShowEditModal(false);
                                            resetEditForm();
                                        },
                                    }
                                );
                            }}
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                        >
                            Simpan
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Modal Randomize */}
            <Modal
                show={showRandomizeModal}
                onClose={() => setShowRandomizeModal(false)}
                maxWidth="4xl"
            >
                <div className="p-6 space-y-4">
                    <h2 className="text-lg font-semibold">Randomize Siswa</h2>
                    <select
                        value={selectedSemesterId}
                        onChange={(e) => setSelectedSemesterId(e.target.value)}
                        className="w-full border px-3 py-2 rounded"
                    >
                        <option value="">-- Pilih Semester --</option>
                        {semesters.map((smt) => (
                            <option key={smt.id} value={smt.id}>
                                {smt.name}
                            </option>
                        ))}
                    </select>
                    <select
                        value={selectedMajorId}
                        onChange={(e) => setSelectedMajorId(e.target.value)}
                        className="w-full border px-3 py-2 rounded"
                    >
                        <option value="">-- Pilih Jurusan --</option>
                        {majors.map((major) => (
                            <option key={major.id} value={major.id}>
                                {major.name}
                            </option>
                        ))}
                    </select>

                    {selectedSemesterId && (
                        <>
                            <button
                                onClick={randomizeStudents}
                                className="bg-green-600 text-white px-4 py-2 rounded mt-2"
                            >
                                Acak
                            </button>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                {[...randomizedStudentsByClass.entries()].map(
                                    ([classroom_id, students]) => {
                                        const classroom = dataClassroom.find(
                                            (k) => k.id == classroom_id
                                        );
                                        return (
                                            <div key={classroom_id}>
                                                <h3 className="font-semibold mb-2">
                                                    {classroom?.name}
                                                </h3>
                                                <table className="w-full border">
                                                    <thead>
                                                        <tr className="bg-gray-100">
                                                            <th className="border p-2">
                                                                No
                                                            </th>
                                                            <th className="border p-2">
                                                                Nama
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {students.map(
                                                            (siswa, idx) => (
                                                                <tr
                                                                    key={
                                                                        siswa.id
                                                                    }
                                                                >
                                                                    <td className="border p-2">
                                                                        {idx +
                                                                            1}
                                                                    </td>
                                                                    <td className="border p-2">
                                                                        {
                                                                            siswa.full_name
                                                                        }
                                                                    </td>
                                                                </tr>
                                                            )
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        );
                                    }
                                )}
                            </div>
                            <div className="mt-4 text-right">
                                <button
                                    onClick={saveRandomizedStudents}
                                    className="bg-blue-600 text-white px-4 py-2 rounded"
                                >
                                    Simpan Hasil
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </Modal>

            {/* Halaman utama */}
            <div className="mx-auto max-w-screen-2xl py-5 px-5">
                <div className="flex flex-wrap justify-between items-center gap-3 mb-5">
                    <p className="font-bold text-2xl">Manajemen Kelas</p>

                    <div className="flex-1 flex gap-2">
                        <input
                            type="text"
                            placeholder="Cari kelas..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full border px-3 py-2 rounded"
                        />
                        <select
                            value={filterMajor}
                            onChange={(e) => setFilterMajor(e.target.value)}
                            className="w-full border px-3 py-2 rounded"
                        >
                            <option value="">Semua Jurusan</option>
                            {majors.map((mjr) => (
                                <option key={mjr.id} value={mjr.id}>
                                    {mjr.name}
                                </option>
                            ))}
                        </select>
                        <select
                            value={filterSemester}
                            onChange={(e) => setFilterSemester(e.target.value)}
                            className="w-full border px-3 py-2 rounded"
                        >
                            <option value="">Semua Semester</option>
                            {semesters.map((smt) => (
                                <option key={smt.id} value={smt.id}>
                                    {smt.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={() => {
                                setSelectedSemesterId("");
                                setSelectedMajorId("");
                                setRandomizedStudentsByClass(new Map());
                                setShowRandomizeModal(true);
                            }}
                            className="rounded-md p-2 bg-green-600 text-white"
                        >
                            Randomize Siswa
                        </button>

                        <button
                            onClick={() => setShowAddClassroomModal(true)}
                            className="rounded-md p-2 bg-blue-500 text-white"
                        >
                            Tambah Kelas
                        </button>
                    </div>
                </div>

                <div className="bg-white p-7 rounded-md my-5">
                    <table className="min-w-full border border-gray-300">
                        <thead className="bg-gray-100 text-left">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <th
                                            key={header.id}
                                            className="p-2 border"
                                        >
                                            {flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody>
                            {table.getRowModel().rows.map((row) => (
                                <tr key={row.id} className="hover:bg-gray-50">
                                    {row.getVisibleCells().map((cell) => (
                                        <td
                                            key={cell.id}
                                            className="p-2 border"
                                        >
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

ClassroomPage.layout = (page) => (
    <AdminLayout user={page.props.auth.user}>{page}</AdminLayout>
);
