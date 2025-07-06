import AdminLayout from "@/Layouts/AdminLayout";
import { Head } from "@inertiajs/react";

export default function SchedulePage({ auth }) {
    return (
        <>
            <Head title={"Jadwal"} />

            <div className="mx-auto max-w-screen-2xl">
                <div className="py-5 px-5">
                    <p className="font-bold text-2xl">Manajemen Kelas</p>

                    <div className="bg-white p-7 rounded-md my-5">
                        <div className="flex gap-5">
                            <div className="flex-1">
                                <label className="font-semibold">
                                    Nama Kelas
                                </label>
                                <input
                                    className="w-full rounded-md border px-2 py-1"
                                    type="text"
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
                                    readOnly
                                />
                            </div>
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
