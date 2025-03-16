import Assignment from "@/Components/pentabyte/Assignment";
import Subject from "@/Components/pentabyte/Subject";
import WeeklyCalendar from "@/Components/pentabyte/WeeklyCalendar";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { date_indo } from "@/utils/date_utils";
import { Head } from "@inertiajs/react";

export default function Dashboard({ auth }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="mx-auto max-w-screen-2xl">
                <div className="py-12 px-5">
                    <div className="flex justify-between gap-3">
                        <div className="max-w-md grow">
                            <div className="bg-white p-5 mb-4 rounded-md shadow-md">
                                <div className="flex gap-5 items-center justify-between mb-5">
                                    <h1 className="font-bold text-lg">
                                        Jadwal Minggu ini
                                    </h1>
                                    <p className="text-xs text-black/50">
                                        Hari ini: {date_indo()}
                                    </p>
                                </div>
                                <div className="mb-5">
                                    <WeeklyCalendar />
                                </div>
                                <div className="flex flex-col gap-3">
                                    <Subject
                                        status={1}
                                        name={"English"}
                                        major={"Software Engineer"}
                                        from={"08.00"}
                                        to={"12.00"}
                                        location={"D2"}
                                    />
                                    <Subject
                                        status={0}
                                        name={"Mathematic"}
                                        major={"Software Engineer"}
                                        from={"15.00"}
                                        to={"17.00"}
                                        location={"E5"}
                                    />
                                </div>
                            </div>
                            <div className="bg-white rounded-md shadow-md p-5 mb-4">
                                <h1 className="font-bold text-xl">
                                    Tugas Belum Dikumpulkan
                                </h1>
                                <hr />
                                <div className="pt-5">
                                    <Assignment
                                        title={"Calculus"}
                                        datetime={"2024-03-15"}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="bg-white flex-1 py-5 px-10 rounded-md min-w-[28rem]">
                            <div className="mb-5">
                                <div className="mb-5">
                                    <h1 className="text-lg font-bold">
                                        Kelas Akademik
                                    </h1>
                                    <p className="text-black/50 text-xs">
                                        Anda memiliki 7 kelas sesuai jadwal
                                        perkuliahan di SiAkad pada periode ini
                                    </p>
                                </div>
                                <div className="flex justify-between items-center gap-5">
                                    <div className="relative w-full">
                                        <img
                                            src="/assets/svg/search.svg"
                                            alt="Search"
                                            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Search..."
                                            className="pl-10 pr-4 py-2 bg-[#F4F7FC] text-sm border rounded-md w-full border-none"
                                        />
                                    </div>
                                    <select className="bg-[#F4F7FC] p-2 pr-10 text-sm text-black/50 rounded-md border-none">
                                        <option value="2024/2025 Genap">
                                            2024/2025 Genap
                                        </option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 grid-flow-row gap-4">
                                {[...Array(3)].map((x, i) => (
                                    <Classroom
                                        color={"blue"}
                                        title={"English"}
                                        teacher={"Big Bear"}
                                        major={"Computer Science"}
                                        key={i}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

const Classroom = ({ title, major, day, from, to, color }) => {
    const colors = {
        sky: "1",
        blue: "bg-gradient-to-r from-[#357AD4] to-[#27B1E0]",
        cyan: "3",
        purple: "4",
        red: "5",
        orange: "6",
        yellow: "7",
        green: "8",
    };

    console.log(colors.blue);

    return (
        <div
            className={`${colors[color]} shadow-md rounded-md overflow-hidden`}
        >
            <div className="p-3">
                <h2 className="text-white text-lg font-bold">{title}</h2>
                <p className="text-white text-sm">{major}</p>
            </div>
            <div className="bg-white p-3">
                <p>
                    {day}: {from} - {to}
                </p>
            </div>
        </div>
    );
};
