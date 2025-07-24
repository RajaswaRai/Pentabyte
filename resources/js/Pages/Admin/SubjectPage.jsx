import AdminLayout from "@/Layouts/AdminLayout";
import { Head, useForm, router } from "@inertiajs/react";
import { useMemo, useState } from "react";
import Modal from "@/Components/Modal";
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
} from "@tanstack/react-table";

export default function SubjectPage({ auth, subjects }) {
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingSubject, setEditingSubject] = useState(null);

    const { data, setData, post, processing, reset, errors } = useForm({
        name: "",
    });
    const {
        data: editData,
        setData: setEditData,
        put,
        processing: editProcessing,
        reset: resetEdit,
        errors: editErrors,
    } = useForm({
        name: "",
    });

    const { delete: destroy } = useForm();

    const dataTable = useMemo(
        () =>
            subjects.map((subject, index) => ({
                id: subject.id,
                no: index + 1,
                name: subject.name,
            })),
        [subjects]
    );

    const columns = useMemo(
        () => [
            { header: "No", accessorKey: "no" },
            { header: "Nama Mata Pelajaran", accessorKey: "name" },
            {
                header: "Aksi",
                cell: ({ row }) => (
                    <div className="flex gap-2">
                        <button
                            onClick={() => {
                                setEditingSubject(row.original);
                                setEditData({
                                    name: row.original.name,
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
                                    confirm("Yakin ingin menghapus mapel ini?")
                                ) {
                                    destroy(
                                        route(
                                            "admin.subject.destroy",
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
            <Head title="Mata Pelajaran" />

            {/* Modal Tambah Mapel */}
            <Modal show={showAddModal} onClose={() => setShowAddModal(false)}>
                <div className="p-6">
                    <h2 className="text-lg font-semibold mb-4">
                        Tambah Mata Pelajaran
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block font-medium">
                                Nama Mapel
                            </label>
                            <input
                                value={data.name}
                                onChange={(e) =>
                                    setData("name", e.target.value)
                                }
                                className="w-full mt-1 border rounded"
                            />
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
                                post(route("admin.subject.store"), {
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

            {/* Modal Edit Mapel */}
            <Modal show={showEditModal} onClose={() => setShowEditModal(false)}>
                <div className="p-6">
                    <h2 className="text-lg font-semibold mb-4">
                        Edit Mata Pelajaran
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block font-medium">
                                Nama Mapel
                            </label>
                            <input
                                value={editData.name}
                                onChange={(e) =>
                                    setEditData("name", e.target.value)
                                }
                                className="w-full mt-1 border rounded"
                            />
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
                                        "admin.subject.update",
                                        editingSubject.id
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
                        <p className="font-bold text-2xl">
                            Daftar Mata Pelajaran
                        </p>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
                        >
                            Tambah Mapel
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

SubjectPage.layout = (page) => (
    <AdminLayout
        user={page.props.auth.user}
        header={
            <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                Manajemen Mata Pelajaran
            </h2>
        }
    >
        {page}
    </AdminLayout>
);
