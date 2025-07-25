import AdminLayout from "@/Layouts/AdminLayout";
import { Head, useForm, router } from "@inertiajs/react";
import { useMemo, useState } from "react";
import Modal from "@/Components/Modal";
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
} from "@tanstack/react-table";

export default function StudentShowPage({ auth, student }) {
    const { data, setData, post, processing, reset, errors } = useForm({
        full_name: "",
        nisn: "",
        date_of_birth: "",
        gender: "",
        phone: "",
        username: "",
        email: "",
        password: "",
        major_id: "",
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
        nisn: "",
        date_of_birth: "",
        gender: "",
        phone: "",
        username: "",
        email: "",
        password: "",
        major_id: "",
    });

    const { delete: destroy } = useForm();

    const [search, setSearch] = useState("");

    const dataTable = useMemo(() => {
        const keyword = search.toLowerCase();
        return student
            .map((s, index) => ({
                id: s.id,
                no: index + 1,
                full_name: s.full_name ?? "",
                nisn: s.nisn ?? "",
                major: s.major?.name ?? "",
                major_id: s.major_id ?? null,
                username: s.username ?? "",
                email: s.email ?? "",
                date_of_birth: s.date_of_birth ?? "",
                gender: s.gender ?? "",
                phone: s.phone ?? "",
            }))
            .filter(
                (s) =>
                    s.full_name.toLowerCase().includes(keyword) ||
                    s.nisn.toLowerCase().includes(keyword) ||
                    s.username.toLowerCase().includes(keyword) ||
                    s.email.toLowerCase().includes(keyword)
            );
    }, [student, search]);

    const columns = useMemo(
        () => [
            { header: "No", accessorKey: "no" },
            { header: "Nama Murid", accessorKey: "full_name" },
            { header: "NISN", accessorKey: "nisn" },
            { header: "Jurusan", accessorKey: "major" },
            {
                header: "Aksi",
                cell: ({ row }) => (
                    <div className="flex gap-2">
                        <button
                            className="p-1 rounded-md bg-blue-500 text-white"
                            onClick={() =>
                                router.get(
                                    route("admin.student.show", row.original.id)
                                )
                            }
                        >
                            View
                        </button>
                        <button
                            onClick={() => {
                                setEditingStudent(row.original);
                                setEditData({
                                    full_name: row.original.full_name,
                                    nisn: row.original.nisn,
                                    date_of_birth: row.original.date_of_birth,
                                    gender: row.original.gender,
                                    phone: row.original.phone,
                                    username: row.original.username,
                                    email: row.original.email,
                                    password: "",
                                    major_id: row.original.major_id ?? "",
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
                                    confirm("Yakin ingin menghapus murid ini?")
                                ) {
                                    destroy(
                                        route(
                                            "admin.student.destroy",
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

            {/* Modal Import XLS/XLSX */}
            <Modal
                show={showImportModal}
                onClose={() => {
                    setShowImportModal(false);
                    setImportedData([]);
                    setColumnMapping({});
                }}
            >
                <div className="p-6">
                    <h2 className="text-lg font-semibold mb-4">
                        Import Data Murid dari XLS/XLSX
                    </h2>
                    <input
                        type="file"
                        accept=".xls,.xlsx"
                        onChange={handleFileUpload}
                        className="mb-4"
                    />

                    {/* Mapping kolom */}
                    {Object.keys(columnMapping).length > 0 && (
                        <div className="mb-4">
                            <h3 className="font-semibold mb-2">
                                Mapping Kolom:
                            </h3>
                            <div className="grid grid-cols-2 gap-3">
                                {Object.keys(columnMapping).map((csvHeader) => (
                                    <div key={csvHeader}>
                                        <label className="block text-sm font-medium mb-1">
                                            {csvHeader}
                                        </label>
                                        <select
                                            value={columnMapping[csvHeader]}
                                            onChange={(e) =>
                                                setColumnMapping((prev) => ({
                                                    ...prev,
                                                    [csvHeader]: e.target.value,
                                                }))
                                            }
                                            className="w-full border rounded px-3 py-2"
                                        >
                                            <option value="">
                                                -- Pilih Kolom DB --
                                            </option>
                                            {dbFields.map((field) => (
                                                <option
                                                    key={field.value}
                                                    value={field.value}
                                                >
                                                    {field.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Preview tabel */}
                    {importedData.length > 0 && (
                        <div className="overflow-auto max-h-64 border border-gray-300 rounded">
                            <table className="min-w-full border-collapse border border-gray-300">
                                <thead className="bg-gray-100">
                                    <tr>
                                        {Object.keys(importedData[0]).map(
                                            (header) => (
                                                <th
                                                    key={header}
                                                    className="border p-2 text-left"
                                                >
                                                    {header}
                                                </th>
                                            )
                                        )}
                                    </tr>
                                </thead>
                                <tbody>
                                    {importedData.map((row, i) => (
                                        <tr
                                            key={i}
                                            className={
                                                i % 2 === 0
                                                    ? "bg-white"
                                                    : "bg-gray-50"
                                            }
                                        >
                                            {Object.values(row).map(
                                                (cell, idx) => (
                                                    <td
                                                        key={idx}
                                                        className="border p-2"
                                                    >
                                                        {cell}
                                                    </td>
                                                )
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    <div className="mt-4 flex justify-end gap-2">
                        <button
                            onClick={() => {
                                setShowImportModal(false);
                                setImportedData([]);
                                setColumnMapping({});
                            }}
                            className="bg-gray-200 px-4 py-2 rounded"
                        >
                            Tutup
                        </button>
                        <button
                            onClick={() => {
                                const mappedData = importedData.map((row) => {
                                    const result = {};
                                    for (const [
                                        csvKey,
                                        dbKey,
                                    ] of Object.entries(columnMapping)) {
                                        if (dbKey) {
                                            result[dbKey] = row[csvKey];
                                        }
                                    }
                                    return result;
                                });

                                router.post(
                                    route("admin.student.import"),
                                    { student: mappedData },
                                    {
                                        onSuccess: () => {
                                            setShowImportModal(false);
                                            setImportedData([]);
                                            setColumnMapping({});
                                        },
                                    }
                                );
                            }}
                            className="bg-blue-500 px-4 py-2 rounded text-white hover:bg-blue-600"
                            disabled={Object.values(columnMapping).every(
                                (v) => v === ""
                            )}
                        >
                            Import
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Modal Tambah */}
            <Modal show={showAddModal} onClose={() => setShowAddModal(false)}>
                <div className="p-6">
                    <h2 className="text-lg font-semibold mb-4">Tambah Guru</h2>
                    <div className="space-y-4">
                        <InputField
                            label="Nama Murid"
                            value={data.full_name}
                            onChange={(e) =>
                                setData("full_name", e.target.value)
                            }
                            error={errors.full_name}
                        />
                        <InputField
                            label="NISN"
                            value={data.nisn}
                            onChange={(e) => setData("nisn", e.target.value)}
                            error={errors.nisn}
                        />
                        <div>
                            <label className="block font-medium">Jurusan</label>
                            <select
                                value={data.major_id}
                                onChange={(e) =>
                                    setData("major_id", e.target.value)
                                }
                                className={`w-full border rounded p-2 ${
                                    errors.major_id ? "border-red-500" : ""
                                }`}
                            >
                                <option value="">-- Pilih Jurusan --</option>
                                {majors.map((major) => (
                                    <option key={major.id} value={major.id}>
                                        {major.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {errors.major_id && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.major_id}
                            </p>
                        )}
                        <InputField
                            type="date"
                            label="Tanggal lahir"
                            value={data.date_of_birth}
                            onChange={(e) =>
                                setData("date_of_birth", e.target.value)
                            }
                            error={errors.date_of_birth}
                        />
                        <div className="flex gap-3 items-center justify-between">
                            <div className="flex-1">
                                <InputField
                                    label="Jenis kelamin"
                                    value={data.gender}
                                    onChange={(e) =>
                                        setData("gender", e.target.value)
                                    }
                                    error={editErrors.gender}
                                />
                            </div>
                            <div className="flex-1">
                                <InputField
                                    label="No. Telepon"
                                    value={data.phone}
                                    onChange={(e) =>
                                        setData("phone", e.target.value)
                                    }
                                    error={editErrors.phone}
                                />
                            </div>
                        </div>
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
                                post(route("admin.student.store"), {
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
                            label="Nama Murid"
                            value={editData.full_name}
                            onChange={(e) =>
                                setEditData("full_name", e.target.value)
                            }
                            error={editErrors.full_name}
                        />
                        <InputField
                            label="NISN"
                            value={editData.nisn}
                            onChange={(e) =>
                                setEditData("nisn", e.target.value)
                            }
                            error={editErrors.nisn}
                        />
                        <div>
                            <label className="block font-medium">Jurusan</label>

                            <select
                                value={editData.major_id}
                                onChange={(e) =>
                                    setEditData("major_id", e.target.value)
                                }
                                className={`w-full border rounded p-2 ${
                                    editErrors.major_id ? "border-red-500" : ""
                                }`}
                            >
                                <option value="">-- Pilih Jurusan --</option>
                                {majors.map((major) => (
                                    <option key={major.id} value={major.id}>
                                        {major.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {editErrors.major_id && (
                            <p className="text-red-500 text-sm mt-1">
                                {editErrors.major_id}
                            </p>
                        )}

                        <InputField
                            label="Tanggal lahir"
                            value={editData.date_of_birth}
                            onChange={(e) =>
                                setEditData("date_of_birth", e.target.value)
                            }
                            error={editErrors.date_of_birth}
                        />
                        <div className="flex gap-3 items-center justify-between">
                            <div className="flex-1">
                                <InputField
                                    label="Jenis kelamin"
                                    value={editData.gender}
                                    onChange={(e) =>
                                        setEditData("gender", e.target.value)
                                    }
                                    error={editErrors.gender}
                                />
                            </div>
                            <div className="flex-1">
                                <InputField
                                    label="No. Telepon"
                                    value={editData.phone}
                                    onChange={(e) =>
                                        setEditData("phone", e.target.value)
                                    }
                                    error={editErrors.phone}
                                />
                            </div>
                        </div>
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
                                if (!editingStudent?.id) return;
                                put(
                                    route(
                                        "admin.student.update",
                                        editingStudent.id
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
                    <div className="flex justify-between items-center gap-3">
                        <p className="font-bold text-2xl">Manajemen Murid</p>
                        <input
                            placeholder="Cari murid"
                            className="rounded-md flex-1"
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />

                        <button
                            onClick={() => setShowImportModal(true)}
                            className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
                        >
                            Masukkan Xls/Xlsx
                        </button>

                        <button
                            onClick={() => setShowAddModal(true)}
                            className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
                        >
                            Tambah Murid
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
StudentShowPage.layout = (page) => (
    <AdminLayout user={page.props.auth.user}>{page}</AdminLayout>
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
