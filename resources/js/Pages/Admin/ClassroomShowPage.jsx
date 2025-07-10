import AdminLayout from "@/Layouts/AdminLayout";
import { Head, useForm, router } from "@inertiajs/react";
import Modal from "@/Components/Modal";
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";

export default function ClassroomShowPage({
    auth,
    classroom,
    classrooms,
    student_select,
}) {
    const [showAddModal, setShowAddModal] = useState(false);

    const { data, setData, put, processing, reset, errors } = useForm({
        classroom: classroom.id,
        student: "",
    });

    const handleAddStudent = (e) => {
        e.preventDefault();

        if (!data.student) return;

        put(
            route("admin.classroom.student.move", {
                classroom: data.classroom,
                student: data.student,
            }),
            {
                onSuccess: () => {
                    setShowAddModal(false);
                    reset("student"); // reset hanya student, classroom tetap
                },
            }
        );
    };

    const students = classroom.students || [];

    const dataTable = useMemo(() => students, [students]);

    const columns = useMemo(
        () => [
            {
                header: "No",
                accessorFn: (row, index) => index + 1,
                id: "rowNumber",
            },
            {
                header: "Nama",
                accessorKey: "full_name",
            },
            {
                header: "NISN",
                accessorKey: "nisn",
            },
            {
                header: "Aksi",
                cell: ({ row }) => (
                    <div className="flex gap-2">
                        <button
                            className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                            onClick={() => {
                                setMovingStudent(row.original);
                                setMoveData("classroom_id", classroom.id); // default classroom sekarang
                                setShowMoveModal(true);
                            }}
                        >
                            Pindah
                        </button>
                        <button
                            className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                            onClick={() => {
                                if (
                                    confirm("Yakin ingin menghapus siswa ini?")
                                ) {
                                    router.delete(
                                        route(
                                            "admin.classroom.student.remove",
                                            [classroom.id, row.original.id]
                                        )
                                    );
                                }
                            }}
                        >
                            Hapus
                        </button>
                    </div>
                ),
            },
        ],
        [classroom.id]
    );

    const table = useReactTable({
        data: dataTable,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    const [showMoveModal, setShowMoveModal] = useState(false);
    const [movingStudent, setMovingStudent] = useState(null);

    const {
        data: moveData,
        setData: setMoveData,
        put: movePut,
        processing: moveProcessing,
        reset: resetMoveForm,
        errors: moveErrors,
    } = useForm({
        classroom_id: "",
    });

    return (
        <AdminLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Classroom Detail
                </h2>
            }
        >
            <Head title={`Classroom - ${classroom.name}`} />

            <div className="mx-auto max-w-screen-2xl">
                <div className="py-5 px-5">
                    <p className="font-bold text-2xl">Manajemen Kelas</p>

                    {/* Info kelas */}
                    <div className="bg-white p-7 rounded-md my-5">
                        <div className="flex gap-5">
                            <div className="flex-1">
                                <label className="font-semibold">
                                    Nama Kelas
                                </label>
                                <input
                                    className="w-full rounded-md border px-2 py-1"
                                    type="text"
                                    value={classroom.name}
                                    readOnly
                                />
                            </div>
                            <div className="flex-1">
                                <label className="font-semibold">
                                    Wali Kelas
                                </label>
                                <input
                                    className="w-full rounded-md border px-2 py-1"
                                    type="text"
                                    value={classroom.homeroom?.full_name ?? "-"}
                                    readOnly
                                />
                            </div>
                        </div>
                    </div>

                    {/* Tabel siswa */}
                    <div className="bg-white p-7 rounded-md my-5">
                        <div className="flex items-center justify-between gap-3 mb-3">
                            <p className="font-semibold">Kelas Siswa List</p>
                            <button
                                className="rounded-md bg-blue-500 p-2 text-white"
                                onClick={() => setShowAddModal(true)}
                            >
                                Tambah Siswa
                            </button>
                        </div>
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
                                                    header.column.columnDef
                                                        .header,
                                                    header.getContext()
                                                )}
                                            </th>
                                        ))}
                                    </tr>
                                ))}
                            </thead>
                            <tbody>
                                {table.getRowModel().rows.map((row) => (
                                    <tr key={row.id} className="border-t">
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
            </div>

            {/* Modal pindah siswa */}
            <Modal show={showMoveModal} onClose={() => setShowMoveModal(false)}>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        if (!movingStudent) return;

                        movePut(
                            route("admin.classroom.student.move", {
                                classroom: moveData.classroom_id,
                                student: movingStudent.id,
                            }),
                            {
                                onSuccess: () => {
                                    setShowMoveModal(false);
                                    resetMoveForm();
                                },
                            }
                        );
                    }}
                    className="p-6"
                >
                    <h2 className="text-lg font-bold mb-4">Pindah Kelas</h2>

                    <div className="mb-4">
                        <label className="block font-semibold mb-1">
                            Pilih Kelas
                        </label>
                        <select
                            value={moveData.classroom_id}
                            onChange={(e) =>
                                setMoveData("classroom_id", e.target.value)
                            }
                            className="w-full border rounded px-3 py-2"
                        >
                            <option value="">-- Pilih --</option>
                            {classrooms
                                .filter((c) => c.id !== classroom.id) // opsional, supaya tidak bisa pindah ke kelas yg sama
                                .map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.name}
                                    </option>
                                ))}
                        </select>
                        {moveErrors.classroom_id && (
                            <p className="text-red-500 text-sm mt-1">
                                {moveErrors.classroom_id}
                            </p>
                        )}
                    </div>

                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={() => setShowMoveModal(false)}
                            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={moveProcessing}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Simpan
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Modal tambah siswa */}
            <Modal show={showAddModal} onClose={() => setShowAddModal(false)}>
                <form onSubmit={handleAddStudent} className="p-6">
                    <h2 className="text-lg font-bold mb-4">Tambah Siswa</h2>

                    <div className="mb-4">
                        <label className="block font-semibold mb-1">
                            Siswa
                        </label>
                        <select
                            value={data.student}
                            onChange={(e) => setData("student", e.target.value)}
                            className="w-full border rounded px-3 py-2"
                        >
                            <option value="">-- Pilih --</option>
                            {student_select.map((student) => (
                                <option key={student.id} value={student.id}>
                                    {student.full_name} - {student.nisn}
                                </option>
                            ))}
                        </select>
                        {errors.student && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.student}
                            </p>
                        )}
                    </div>

                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={() => setShowAddModal(false)}
                            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Simpan
                        </button>
                    </div>
                </form>
            </Modal>
        </AdminLayout>
    );
}
