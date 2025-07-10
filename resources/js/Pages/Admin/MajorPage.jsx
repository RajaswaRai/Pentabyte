import AdminLayout from "@/Layouts/AdminLayout";
import { Head, useForm, router } from "@inertiajs/react";
import { useMemo, useState } from "react";
import Modal from "@/Components/Modal";
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
} from "@tanstack/react-table";

export default function MajorPage({ auth, majors }) {
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingMajor, setEditingMajor] = useState(null);

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

    const dataTable = useMemo(
        () =>
            majors.map((major, index) => ({
                id: major.id,
                no: index + 1,
                name: major.name,
                code: major.code,
            })),
        [majors]
    );

    const columns = useMemo(
        () => [
            { header: "No", accessorKey: "no" },
            { header: "Kode", accessorKey: "code" },
            { header: "Nama Jurusan", accessorKey: "name" },
            {
                header: "Aksi",
                cell: ({ row }) => (
                    <div className="flex gap-2">
                        <button
                            onClick={() => {
                                setEditingMajor(row.original);
                                setEditData({
                                    name: row.original.name,
                                    code: row.original.code,
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
                                        "Yakin ingin menghapus jurusan ini?"
                                    )
                                ) {
                                    destroy(
                                        route(
                                            "admin.major.destroy",
                                            row.original.id
                                        )
                                    );
                                }
                            }}
                            className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                        >
                            Hapus
                        </button>
                    </div>
                ),
            },
        ],
        []
    );

    const table = useReactTable({
        data: dataTable,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <>
            <Head title="Jurusan" />

            {/* Modal Tambah */}
            <Modal show={showAddModal} onClose={() => setShowAddModal(false)}>
                <div className="p-6">
                    <h2 className="text-lg font-semibold mb-4">
                        Tambah Jurusan
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block font-medium">
                                Kode Jurusan
                            </label>
                            <input
                                value={data.code}
                                onChange={(e) =>
                                    setData("code", e.target.value)
                                }
                                className="w-full mt-1 border rounded"
                            />
                            {errors.code && (
                                <div className="text-red-500 text-sm">
                                    {errors.code}
                                </div>
                            )}
                        </div>
                        <div>
                            <label className="block font-medium">
                                Nama Jurusan
                            </label>
                            <input
                                value={data.name}
                                onChange={(e) =>
                                    setData("name", e.target.value)
                                }
                                className="w-full mt-1 border rounded"
                            />
                            {errors.name && (
                                <div className="text-red-500 text-sm">
                                    {errors.name}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="mt-4 flex justify-end gap-2">
                        <button
                            onClick={() => setShowAddModal(false)}
                            className="bg-gray-200 px-4 py-2 rounded"
                        >
                            Batal
                        </button>
                        <button
                            onClick={() => {
                                post(route("admin.major.store"), {
                                    onSuccess: () => {
                                        reset();
                                        setShowAddModal(false);
                                    },
                                });
                            }}
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                            disabled={processing}
                        >
                            {processing ? "Menyimpan..." : "Simpan"}
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Modal Edit */}
            <Modal show={showEditModal} onClose={() => setShowEditModal(false)}>
                <div className="p-6">
                    <h2 className="text-lg font-semibold mb-4">Edit Jurusan</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block font-medium">
                                Kode Jurusan
                            </label>
                            <input
                                value={editData.code}
                                onChange={(e) =>
                                    setEditData("code", e.target.value)
                                }
                                className="w-full mt-1 border rounded"
                            />
                            {editErrors.code && (
                                <div className="text-red-500 text-sm">
                                    {editErrors.code}
                                </div>
                            )}
                        </div>
                        <div>
                            <label className="block font-medium">
                                Nama Jurusan
                            </label>
                            <input
                                value={editData.name}
                                onChange={(e) =>
                                    setEditData("name", e.target.value)
                                }
                                className="w-full mt-1 border rounded"
                            />
                            {editErrors.name && (
                                <div className="text-red-500 text-sm">
                                    {editErrors.name}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="mt-4 flex justify-end gap-2">
                        <button
                            onClick={() => setShowEditModal(false)}
                            className="bg-gray-200 px-4 py-2 rounded"
                        >
                            Batal
                        </button>
                        <button
                            onClick={() => {
                                put(
                                    route(
                                        "admin.major.update",
                                        editingMajor.id
                                    ),
                                    {
                                        onSuccess: () => {
                                            resetEdit();
                                            setShowEditModal(false);
                                        },
                                    }
                                );
                            }}
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                            disabled={editProcessing}
                        >
                            {editProcessing ? "Menyimpan..." : "Simpan"}
                        </button>
                    </div>
                </div>
            </Modal>

            <div className="mx-auto max-w-screen-2xl">
                <div className="py-5 px-5">
                    <div className="flex justify-between items-center">
                        <p className="font-bold text-2xl">Daftar Jurusan</p>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
                        >
                            Tambah Jurusan
                        </button>
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
                                    <tr
                                        key={row.id}
                                        className="hover:bg-gray-50"
                                    >
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
        </>
    );
}

MajorPage.layout = (page) => (
    <AdminLayout
        user={page.props.auth.user}
        header={
            <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                Manajemen Jurusan
            </h2>
        }
    >
        {page}
    </AdminLayout>
);
