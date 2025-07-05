import Assignment from "@/Components/pentabyte/Assignment";
import AdminLayout from "@/Layouts/AdminLayout";
import { date_indo } from "@/utils/date_utils";
import { daysName } from "@/settings";
import { Head, Link } from "@inertiajs/react";

export default function SchedulePage({ auth, sct, assignments }) {
    return (
        <AdminLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Schedule
                </h2>
            }
        >
            <Head title="Schedule" />

            <div className="mx-auto max-w-screen-2xl">
                <div className="py-5 px-5">
                    {/* contents */}
                    <p className="font-bold text-2xl">Schedule</p>
                </div>
            </div>
        </AdminLayout>
    );
}
