import { Head, Link, useForm } from "@inertiajs/react";
import { useMemo, useState } from "react";
import { router } from "@inertiajs/react";
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
} from "@tanstack/react-table";
import Modal from "@/Components/Modal";
import AdminLayout from "@/Layouts/AdminLayout";

export default function ClassroomPage({ auth, classrooms, teachers }) {
    const { data, setData, post, reset, processing, errors } = useForm({
        name: "",
        homeroom_teacher_id: "",
    });

    const { delete: destroy } = useForm();
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingClassroom, setEditingClassroom] = useState(null);

    const {
        data: editData,
        setData: setEditData,
        put,
        processing: editProcessing,
        reset: resetEditForm,
        errors: editErrors,
    } = useForm({
        name: "",
        homeroom_teacher_id: "",
    });

    const dataClassroom = useMemo(() => {
        return classrooms.map((s, idx) => ({
            id: s.id,
            no: idx + 1,
            name: s.name,
            homeroom_teacher_id: s.homeroom_teacher_id ?? "",
            homeroom: s.homeroom?.full_name,
        }));
    }, [classrooms]);

    const columns = useMemo(
        () => [
            {
                header: "No",
                accessorKey: "no",
            },
            {
                header: "Nama Kelas",
                accessorKey: "name",
            },
            {
                header: "Wali Kelas",
                accessorKey: "homeroom",
            },
            {
                header: "Aksi",
                cell: ({ row }) => {
                    const id = row.original.id;

                    return (
                        <div className="flex gap-2">
                            <button
                                onClick={() =>
                                    router.visit(
                                        route(
                                            "admin.classroom.show",
                                            row.original.id
                                        )
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
                                            row.original.homeroom_teacher_id ||
                                            "",
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

    const [showAddClassroomModal, setAddClassroomShowModal] = useState(false);

    return (
        <>
            <Head title="Classroom" />

            {/* Modal Edit */}
            <Modal
                show={showEditModal}
                onClose={() => setShowEditModal(false)}
                maxWidth="lg"
            >
                <div className="p-6">
                    <h2 className="text-lg font-semibold mb-4">Edit Kelas</h2>
                    <hr />
                    <div className="space-y-4 mt-4">
                        <div>
                            <label className="block font-medium">
                                Nama Kelas
                            </label>
                            <input
                                value={editData.name}
                                onChange={(e) =>
                                    setEditData("name", e.target.value)
                                }
                                type="text"
                                className="w-full mt-1 rounded-md border-gray-300"
                            />
                            {editErrors.name && (
                                <p className="text-red-500 text-sm">
                                    {editErrors.name}
                                </p>
                            )}
                        </div>
                        <div>
                            <label className="block font-medium">
                                Wali Kelas
                            </label>
                            <select
                                value={editData.homeroom_teacher_id}
                                onChange={(e) =>
                                    setEditData(
                                        "homeroom_teacher_id",
                                        e.target.value
                                    )
                                }
                                className="w-full mt-1 rounded-md border-gray-300"
                            >
                                <option value="">-- Pilih --</option>
                                {teachers.map((teacher) => (
                                    <option
                                        key={teacher.id}
                                        value={String(teacher.id)}
                                    >
                                        {teacher.full_name}
                                    </option>
                                ))}
                            </select>
                            {editErrors.homeroom_teacher_id && (
                                <p className="text-red-500 text-sm">
                                    {editErrors.homeroom_teacher_id}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end gap-2">
                        <button
                            onClick={() => setShowEditModal(false)}
                            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
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
                            className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
                            disabled={editProcessing}
                        >
                            {editProcessing
                                ? "Menyimpan..."
                                : "Simpan Perubahan"}
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Modal Tambah */}
            <Modal
                show={showAddClassroomModal}
                onClose={() => setAddClassroomShowModal(false)}
                maxWidth="lg"
            >
                <div className="p-6">
                    <h2 className="text-lg font-semibold mb-4">Tambah Kelas</h2>
                    <hr />

                    <div className="space-y-4">
                        <div>
                            <label className="block font-medium">
                                Nama Kelas
                            </label>
                            <input
                                onChange={(e) =>
                                    setData("name", e.target.value)
                                }
                                type="text"
                                className="w-full mt-1 rounded-md border-gray-300"
                            />
                        </div>
                        <div>
                            <label className="block font-medium">
                                Wali Kelas
                            </label>
                            <select
                                onChange={(e) =>
                                    setData(
                                        "homeroom_teacher_id",
                                        e.target.value
                                    )
                                }
                                className="w-full mt-1 rounded-md border-gray-300"
                            >
                                <option value="">-- Pilih --</option>
                                {teachers.map((teacher) => (
                                    <option key={teacher.id} value={teacher.id}>
                                        {teacher.full_name ?? "-"}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end gap-2">
                        <button
                            onClick={() => setAddClassroomShowModal(false)}
                            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                        >
                            Batal
                        </button>
                        <button
                            onClick={() => {
                                post(route("admin.classroom.store"), {
                                    onSuccess: () => {
                                        setAddClassroomShowModal(false);
                                        reset();
                                    },
                                });
                            }}
                            className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
                            disabled={processing}
                        >
                            {processing ? "Menyimpan..." : "Simpan"}
                        </button>
                    </div>
                </div>
            </Modal>

            <div className="mx-auto max-w-screen-2xl py-5 px-5">
                <div className="flex justify-between items-center gap-5">
                    <p className="font-bold text-2xl">Manajemen Kelas</p>
                    <div className="flex-1">
                        <input
                            className="rounded-md w-full"
                            type="text"
                            id="search_classroom"
                        />
                    </div>
                    <div className="flex-1 flex items-center gap-2">
                        <button className="flex-1 w-full rounded-md p-2 bg-blue-500 text-white">
                            Masukkan Siswa
                        </button>
                        <button
                            onClick={() => setAddClassroomShowModal(true)}
                            className="flex-1 w-full rounded-md p-2 bg-blue-500 text-white"
                        >
                            Tambah Kelas
                        </button>
                    </div>
                </div>

                <div className="bg-white p-7 rounded-md my-5">
                    <p className="font-semibold">Kelas Siswa List</p>
                    <table className="min-w-full border border-gray-300 mt-3">
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
    <AdminLayout
        user={page.props.auth.user}
        header={
            <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                Classroom
            </h2>
        }
    >
        {page}
    </AdminLayout>
);
