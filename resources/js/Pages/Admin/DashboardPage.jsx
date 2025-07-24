import Assignment from "@/Components/pentabyte/Assignment";
import AdminLayout from "@/Layouts/AdminLayout";
import { date_indo } from "@/utils/date_utils";
import { daysName } from "@/settings";
import { Head, Link } from "@inertiajs/react";

export default function DashboardPage() {
    return (
        <>
            <Head title="Dashboard" />

            <div className="mx-auto max-w-screen-2xl">
                <div className="py-5 px-5">
                    {/* contents */}
                    <p className="font-bold text-2xl">Dashboard</p>
                </div>
            </div>
        </>
    );
}

DashboardPage.layout = (page) => (
    <AdminLayout
        user={page.props.auth.user}
        header={
            <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                Dashboard
            </h2>
        }
    >
        {page}
    </AdminLayout>
);
