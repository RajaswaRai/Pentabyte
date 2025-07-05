import AdminLayout from "@/Layouts/AdminLayout";
import { Head, useForm, router } from "@inertiajs/react";
import { useMemo, useState } from "react";
import Modal from "@/Components/Modal";
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
} from "@tanstack/react-table";

export default function TeacherPage({ auth, teachers }) {
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingTeacher, setEditingTeacher] = useState(null);

    const { data, setData, post, processing, reset, errors } = useForm({
        full_name: "",
        nip: "",
        username: "",
        email: "",
        password: "",
    });

    const {
        data: editData,
        setData: setEditData,
        put,
        processing: editProcessing,
        reset: resetEdit,
        errors: editErrors,
    } = useForm({
        full_name: "",
        nip: "",
        username: "",
        email: "",
        password: "",
    });

    const { delete: destroy } = useForm();

    const dataTable = useMemo(
        () =>
            teachers.map((teacher, index) => ({
                id: teacher.teacher?.id,
                no: index + 1,
                nip: teacher.teacher?.nip ?? "",
                full_name: teacher.teacher?.full_name ?? "",
                username: teacher.username ?? "",
                email: teacher.email ?? "",
            })),
        [teachers]
    );

    const columns = useMemo(
        () => [
            { header: "No", accessorKey: "no" },
            { header: "Nama Guru", accessorKey: "full_name" },
            { header: "NIP", accessorKey: "nip" },
            { header: "Username", accessorKey: "username" },
            { header: "Email", accessorKey: "email" },
            {
                header: "Aksi",
                cell: ({ row }) => (
                    <div className="flex gap-2">
                        <button
                            onClick={() => {
                                setEditingTeacher(row.original);
                                setEditData({
                                    full_name: row.original.full_name,
                                    nip: row.original.nip,
                                    username: row.original.username,
                                    email: row.original.email,
                                    password: "",
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
                                    confirm("Yakin ingin menghapus guru ini?")
                                ) {
                                    destroy(
                                        route(
                                            "admin.teacher.destroy",
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
            <Head title="Guru" />

            {/* Modal Tambah */}
            <Modal show={showAddModal} onClose={() => setShowAddModal(false)}>
                <div className="p-6">
                    <h2 className="text-lg font-semibold mb-4">Tambah Guru</h2>
                    <div className="space-y-4">
                        <InputField
                            label="Nama Guru"
                            value={data.full_name}
                            onChange={(e) =>
                                setData("full_name", e.target.value)
                            }
                            error={errors.full_name}
                        />
                        <InputField
                            label="NIP"
                            value={data.nip}
                            onChange={(e) => setData("nip", e.target.value)}
                            error={errors.nip}
                        />
                        <InputField
                            label="Username"
                            value={data.username}
                            onChange={(e) =>
                                setData("username", e.target.value)
                            }
                            error={errors.username}
                        />
                        <InputField
                            label="Email"
                            value={data.email}
                            onChange={(e) => setData("email", e.target.value)}
                            error={errors.email}
                        />
                        <InputField
                            label="Password"
                            value={data.password}
                            onChange={(e) =>
                                setData("password", e.target.value)
                            }
                            type="password"
                            error={errors.password}
                        />
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
                                if (
                                    !data.password ||
                                    data.password.length < 8
                                ) {
                                    alert("Password minimal 8 karakter.");
                                    return;
                                }
                                post(route("admin.teacher.store"), {
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
                    <h2 className="text-lg font-semibold mb-4">Edit Guru</h2>
                    <div className="space-y-4">
                        <InputField
                            label="Nama Guru"
                            value={editData.full_name}
                            onChange={(e) =>
                                setEditData("full_name", e.target.value)
                            }
                            error={editErrors.full_name}
                        />
                        <InputField
                            label="NIP"
                            value={editData.nip}
                            onChange={(e) => setEditData("nip", e.target.value)}
                            error={editErrors.nip}
                        />
                        <InputField
                            label="Username"
                            value={editData.username}
                            onChange={(e) =>
                                setEditData("username", e.target.value)
                            }
                            error={editErrors.username}
                        />
                        <InputField
                            label="Email"
                            value={editData.email}
                            onChange={(e) =>
                                setEditData("email", e.target.value)
                            }
                            error={editErrors.email}
                        />
                        <InputField
                            label="Password (opsional)"
                            value={editData.password}
                            onChange={(e) =>
                                setEditData("password", e.target.value)
                            }
                            type="password"
                            error={editErrors.password}
                        />
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
                                if (!editingTeacher?.id) return;
                                put(
                                    route(
                                        "admin.teacher.update",
                                        editingTeacher.id
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
                        <p className="font-bold text-2xl">Daftar Guru</p>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
                        >
                            Tambah Guru
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
TeacherPage.layout = (page) => (
    <AdminLayout
        user={page.props.auth.user}
        header={
            <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                Manajemen Guru
            </h2>
        }
    >
        {page}
    </AdminLayout>
);

function InputField({ label, value, onChange, type = "text", error }) {
    return (
        <div>
            <label className="block font-medium">{label}</label>
            <input
                type={type}
                value={value ?? ""}
                onChange={onChange}
                className={`w-full mt-1 border rounded p-2 ${
                    error ? "border-red-500" : ""
                }`}
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
    );
}
