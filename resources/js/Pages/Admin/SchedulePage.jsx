import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link } from "@inertiajs/react";
import { useMemo, useState } from "react";
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
} from "@tanstack/react-table";

export default function SchedulePage({ auth, classrooms, semesters }) {
    const [search, setSearch] = useState("");
    const [selectedSemester, setSelectedSemester] = useState("");

    const filteredData = useMemo(() => {
        return classrooms.filter((c) => {
            const matchSemester =
                selectedSemester === "" ||
                c.semester?.id === parseInt(selectedSemester);
            const matchSearch =
                search === "" ||
                c.name.toLowerCase().includes(search.toLowerCase());
            return matchSemester && matchSearch;
        });
    }, [classrooms, search, selectedSemester]);

    const columns = useMemo(
        () => [
            {
                header: "No",
                accessorFn: (row, index) => index + 1,
                cell: (info) => info.getValue(),
            },
            {
                header: "Nama Kelas",
                accessorKey: "name",
                cell: (info) => info.getValue(),
            },
            {
                header: "Semester",
                accessorFn: (row) => row.semester?.name || "-",
                cell: (info) => info.getValue(),
            },
            {
                header: "Aksi",
                cell: ({ row }) => {
                    return (
                        <Link
                            href={route(
                                "admin.schedule.classroom.show",
                                row.original.id
                            )}
                            className="text-blue-500 underline"
                        >
                            Lihat Jadwal
                        </Link>
                    );
                },
            },
        ],
        []
    );

    const table = useReactTable({
        data: filteredData,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <>
            <Head title={"Jadwal"} />
            <div className="mx-auto max-w-screen-2xl">
                <div className="py-5 px-5">
                    <p className="font-bold text-2xl">Manajemen Jadwal</p>

                    <div className="bg-white p-7 rounded-md my-5">
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-5 mb-5">
                            <h2 className="text-2xl font-bold">Jadwal Kelas</h2>

                            <input
                                className="rounded-md border w-full md:w-80 px-3 py-2"
                                placeholder="Cari Kelas"
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />

                            <select
                                className="rounded-md border w-full md:w-64 px-3 py-2"
                                value={selectedSemester}
                                onChange={(e) =>
                                    setSelectedSemester(e.target.value)
                                }
                            >
                                <option value="">Semua Semester</option>
                                {semesters.map((s) => (
                                    <option key={s.id} value={s.id}>
                                        {s.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full border border-gray-200">
                                <thead className="bg-gray-100">
                                    {table
                                        .getHeaderGroups()
                                        .map((headerGroup) => (
                                            <tr key={headerGroup.id}>
                                                {headerGroup.headers.map(
                                                    (header) => (
                                                        <th
                                                            key={header.id}
                                                            className="text-left px-4 py-2 border-b"
                                                        >
                                                            {flexRender(
                                                                header.column
                                                                    .columnDef
                                                                    .header,
                                                                header.getContext()
                                                            )}
                                                        </th>
                                                    )
                                                )}
                                            </tr>
                                        ))}
                                </thead>
                                <tbody>
                                    {table.getRowModel().rows.map((row) => (
                                        <tr
                                            key={row.id}
                                            className="hover:bg-gray-50"
                                        >
                                            {row
                                                .getVisibleCells()
                                                .map((cell) => (
                                                    <td
                                                        key={cell.id}
                                                        className="px-4 py-2 border-b"
                                                    >
                                                        {flexRender(
                                                            cell.column
                                                                .columnDef.cell,
                                                            cell.getContext()
                                                        )}
                                                    </td>
                                                ))}
                                        </tr>
                                    ))}
                                    {filteredData.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan={columns.length}
                                                className="text-center text-gray-500 py-4"
                                            >
                                                Tidak ada data kelas
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

SchedulePage.layout = (page) => (
    <AdminLayout user={page.props.auth.user}>{page}</AdminLayout>
);
