import AdminLayout from "@/Layouts/AdminLayout";
import { Head, router, useForm } from "@inertiajs/react";
import { useMemo, useState } from "react";
import Modal from "@/Components/Modal";

export default function SemesterPage({ auth, semesters }) {
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [expandedYears, setExpandedYears] = useState({});
    const [editingId, setEditingId] = useState(null);

    const { data, setData, processing, reset, errors } = useForm({
        academic_year: "",
        odd_start_date: "",
        odd_end_date: "",
        even_start_date: "",
        even_end_date: "",
    });

    const {
        data: editData,
        setData: setEditData,
        processing: editProcessing,
        reset: resetEdit,
        errors: editErrors,
    } = useForm({
        academic_year: "",
        odd_start_date: "",
        odd_end_date: "",
        even_start_date: "",
        even_end_date: "",
    });

    const groupedSemesters = useMemo(() => {
        const grouped = {};
        semesters.forEach((semester) => {
            if (!grouped[semester.academic_year]) {
                grouped[semester.academic_year] = {
                    odd: null,
                    even: null,
                };
            }
            if (parseInt(semester.semester_type) === 1) {
                grouped[semester.academic_year].odd = semester;
            } else if (parseInt(semester.semester_type) === 2) {
                grouped[semester.academic_year].even = semester;
            }
        });
        return grouped;
    }, [semesters]);

    const handleEdit = (academicYear) => {
        const sem = groupedSemesters[academicYear];
        const anySemester = sem.odd || sem.even;
        if (!anySemester) return;

        setEditingId(anySemester.academic_year);
        setEditData({
            academic_year: academicYear,
            odd_start_date: sem.odd?.start_date || "",
            odd_end_date: sem.odd?.end_date || "",
            even_start_date: sem.even?.start_date || "",
            even_end_date: sem.even?.end_date || "",
        });
        setShowEditModal(true);
    };

    const toggleYearExpansion = (year) => {
        setExpandedYears((prev) => ({
            ...prev,
            [year]: !prev[year],
        }));
    };

    const formatDate = (dateString) => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        return date.toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    return (
        <>
            <Head title="Semester" />
            <Modal show={showAddModal} onClose={() => setShowAddModal(false)}>
                <SemesterForm
                    mode="add"
                    data={data}
                    setData={setData}
                    processing={processing}
                    errors={errors}
                    onCancel={() => {
                        reset();
                        setShowAddModal(false);
                    }}
                    onSubmit={() => {
                        router.post(route("admin.semester.store"), data, {
                            onSuccess: () => {
                                reset();
                                setShowAddModal(false);
                            },
                        });
                    }}
                />
            </Modal>
            <Modal show={showEditModal} onClose={() => setShowEditModal(false)}>
                <SemesterForm
                    mode="edit"
                    data={editData}
                    setData={setEditData}
                    processing={editProcessing}
                    errors={editErrors}
                    onCancel={() => {
                        resetEdit();
                        setShowEditModal(false);
                        setEditingId(null);
                    }}
                    onSubmit={() => {
                        router.put(
                            route("admin.semester.update", editingId),
                            editData,
                            {
                                onSuccess: () => {
                                    resetEdit();
                                    setShowEditModal(false);
                                    setEditingId(null);
                                },
                            }
                        );
                    }}
                />
            </Modal>
            <div className="mx-auto max-w-screen-2xl py-5 px-5">
                <div className="flex justify-between items-center">
                    <h1 className="font-bold text-2xl">Daftar Semester</h1>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                    >
                        Tambah Semester
                    </button>
                </div>
                <div className="bg-white p-5 mt-5 rounded shadow">
                    {Object.keys(groupedSemesters).length > 0 ? (
                        Object.entries(groupedSemesters).map(
                            ([year, semesters]) => (
                                <div
                                    key={year}
                                    className="border rounded mb-4 overflow-hidden"
                                >
                                    <div
                                        className="flex justify-between items-center p-4 bg-gray-100 cursor-pointer hover:bg-gray-50 transition-colors"
                                        onClick={() =>
                                            toggleYearExpansion(year)
                                        }
                                    >
                                        <div className="font-bold text-lg">
                                            {year} / {parseInt(year) + 1}
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleEdit(year);
                                                }}
                                                className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition-colors"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (
                                                        confirm(
                                                            `Yakin ingin menghapus semua semester tahun ${year}/${
                                                                parseInt(year) +
                                                                1
                                                            }?`
                                                        )
                                                    ) {
                                                        router.delete(
                                                            route(
                                                                "admin.semester.destroy",
                                                                year
                                                            )
                                                        );
                                                    }
                                                }}
                                                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors"
                                            >
                                                Hapus
                                            </button>
                                        </div>
                                    </div>
                                    {expandedYears[year] && (
                                        <div className="p-4 space-y-4 bg-white">
                                            <div className="border p-4 rounded-lg">
                                                <h3 className="font-semibold text-lg text-blue-600 mb-2">
                                                    Semester Ganjil
                                                </h3>
                                                {semesters.odd ? (
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div>
                                                            <p className="text-gray-600">
                                                                Tanggal Mulai:
                                                            </p>
                                                            <p className="font-medium">
                                                                {formatDate(
                                                                    semesters
                                                                        .odd
                                                                        .start_date
                                                                )}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className="text-gray-600">
                                                                Tanggal Selesai:
                                                            </p>
                                                            <p className="font-medium">
                                                                {formatDate(
                                                                    semesters
                                                                        .odd
                                                                        .end_date
                                                                )}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <p className="text-gray-500">
                                                        Data semester ganjil
                                                        belum tersedia
                                                    </p>
                                                )}
                                            </div>
                                            <div className="border p-4 rounded-lg">
                                                <h3 className="font-semibold text-lg text-green-600 mb-2">
                                                    Semester Genap
                                                </h3>
                                                {semesters.even ? (
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div>
                                                            <p className="text-gray-600">
                                                                Tanggal Mulai:
                                                            </p>
                                                            <p className="font-medium">
                                                                {formatDate(
                                                                    semesters
                                                                        .even
                                                                        .start_date
                                                                )}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className="text-gray-600">
                                                                Tanggal Selesai:
                                                            </p>
                                                            <p className="font-medium">
                                                                {formatDate(
                                                                    semesters
                                                                        .even
                                                                        .end_date
                                                                )}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <p className="text-gray-500">
                                                        Data semester genap
                                                        belum tersedia
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )
                        )
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            Tidak ada data semester yang tersedia
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

SemesterPage.layout = (page) => (
    <AdminLayout user={page.props.auth.user}>{page}</AdminLayout>
);

function SemesterForm({
    mode,
    data,
    setData,
    processing,
    errors,
    onCancel,
    onSubmit,
}) {
    return (
        <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">
                {mode == "add" ? "Tambah Semester Baru" : "Edit Semester"}
            </h2>
            <div className="space-y-6">
                <div className="flex items-end justify-between gap-3">
                    <InputField
                        label="Tahun Akademik"
                        value={data.academic_year}
                        onChange={(e) =>
                            setData("academic_year", e.target.value)
                        }
                        disabled={mode == "edit"}
                        error={errors.academic_year}
                        placeholder="Contoh: 2023"
                    />
                    <div className="py-1 font-bold text-2xl text-gray-400">
                        /
                    </div>
                    <InputField
                        disabled
                        label="Tahun Berikutnya"
                        value={
                            parseInt(data.academic_year)
                                ? parseInt(data.academic_year) + 1
                                : ""
                        }
                    />
                </div>

                <div className="space-y-6">
                    <div>
                        <div className="flex items-center mb-4">
                            <hr className="border-t-2 border-blue-500 flex-grow" />
                            <span className="px-3 font-semibold text-blue-500 text-lg">
                                Semester Ganjil
                            </span>
                            <hr className="border-t-2 border-blue-500 flex-grow" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputField
                                type="date"
                                label="Tanggal Mulai"
                                value={data.odd_start_date}
                                onChange={(e) =>
                                    setData("odd_start_date", e.target.value)
                                }
                                error={errors.odd_start_date}
                            />
                            <InputField
                                type="date"
                                label="Tanggal Selesai"
                                value={data.odd_end_date}
                                onChange={(e) =>
                                    setData("odd_end_date", e.target.value)
                                }
                                error={errors.odd_end_date}
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center mb-4">
                            <hr className="border-t-2 border-green-500 flex-grow" />
                            <span className="px-3 font-semibold text-green-500 text-lg">
                                Semester Genap
                            </span>
                            <hr className="border-t-2 border-green-500 flex-grow" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputField
                                type="date"
                                label="Tanggal Mulai"
                                value={data.even_start_date}
                                onChange={(e) =>
                                    setData("even_start_date", e.target.value)
                                }
                                error={errors.even_start_date}
                            />
                            <InputField
                                type="date"
                                label="Tanggal Selesai"
                                value={data.even_end_date}
                                onChange={(e) =>
                                    setData("even_end_date", e.target.value)
                                }
                                error={errors.even_end_date}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-8 flex justify-end gap-3">
                <button
                    onClick={onCancel}
                    className="px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                    disabled={processing}
                >
                    Batal
                </button>
                <button
                    onClick={onSubmit}
                    className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                    disabled={processing}
                >
                    {processing ? (
                        <span className="flex items-center justify-center">
                            <svg
                                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                            </svg>
                            Menyimpan...
                        </span>
                    ) : (
                        "Simpan"
                    )}
                </button>
            </div>
        </div>
    );
}

function InputField({
    label,
    value,
    onChange,
    type = "text",
    error,
    disabled = false,
    placeholder = "",
}) {
    return (
        <div className="w-full">
            <label className="block font-medium text-gray-700 mb-1">
                {label}
            </label>
            <input
                type={type}
                disabled={disabled}
                value={value ?? ""}
                onChange={onChange}
                placeholder={placeholder}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                    disabled
                        ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                        : "focus:ring-blue-500"
                } ${error ? "border-red-500" : "border-gray-300"}`}
            />
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
}
