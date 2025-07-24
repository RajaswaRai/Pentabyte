import Assignment from "@/Components/pentabyte/Assignment";
import Subject from "@/Components/pentabyte/Subject";
import WeeklyCalendar from "@/Components/pentabyte/WeeklyCalendar";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { date_indo } from "@/utils/date_utils";
import { daysName } from "@/settings";
import { Head, Link } from "@inertiajs/react";
import { useState } from "react";
import moment from "moment";

const ScheduleView = ({ sct, semesters }) => {
    const [selectedDay, setSelectedDay] = useState(moment().day()); // 0–6

    const filteredSCT = sct.filter((x) => x.day === selectedDay.toString());

    return (
        <>
            <div className="mb-5">
                <WeeklyCalendar
                    selectedDay={selectedDay}
                    onSelectDay={setSelectedDay}
                />
            </div>

            <div className="flex flex-col gap-3">
                {filteredSCT.map((x, i) => (
                    <Subject
                        href={route("classroom", x.id)}
                        key={`subject_${i}`}
                        status={1}
                        name={x.subject.name}
                        classroom={x.classroom.name}
                        from={x.start_time}
                        to={x.end_time}
                        location={"D2"}
                    />
                ))}
            </div>
        </>
    );
};

function SubjectSection({ sct, semesters }) {
    const [search, setSearch] = useState("");
    const [selectedSemester, setSelectedSemester] = useState(semesters[0]?.id);

    const filteredSCT = sct.filter((x) => {
        const query = search.toLowerCase();
        const matchSearch =
            x.subject.name.toLowerCase().includes(query) ||
            x.classroom.name.toLowerCase().includes(query) ||
            x.teacher.full_name.toLowerCase().includes(query);

        const matchSemester = x.classroom.semester_id === selectedSemester;

        return matchSearch && matchSemester;
    });

    return (
        <div className="bg-white flex-1 py-5 px-10 rounded-md min-w-[28rem]">
            <div className="mb-5">
                <div className="mb-5">
                    <h1 className="text-lg font-bold">Kelas Akademik</h1>
                    {/* <p className="text-black/50 text-xs">
                        Anda memiliki x mapel sesuai jadwal pelajaran di
                        SiAkad pada periode ini
                    </p> */}
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
                            placeholder="Cari berdasarkan mata pelajaran, kelas, atau nama guru."
                            className="pl-10 pr-4 py-2 bg-[#F4F7FC] text-sm border rounded-md w-full border-none"
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <select
                        className="bg-[#F4F7FC] p-2 pr-10 text-sm text-black/50 rounded-md border-none"
                        value={selectedSemester}
                        onChange={(e) =>
                            setSelectedSemester(parseInt(e.target.value))
                        }
                    >
                        {semesters.map((s, i) => {
                            return (
                                <option value={s.id} key={s.id}>
                                    {s.name}
                                </option>
                            );
                        })}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-2 grid-flow-row gap-4 mt-4">
                {filteredSCT.map((x, i) => (
                    <SubjectCard
                        href={route("classroom", x.id)}
                        key={`class_${i}`}
                        color="blue"
                        title={x.subject.name}
                        teacher={x.teacher.full_name}
                        class_={x.classroom.name}
                        day={x.day}
                        from={x.start_time}
                        to={x.end_time}
                    />
                ))}
            </div>
        </div>
    );
}

export default function DashboardPage({ auth, sct, semesters }) {
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
                                <ScheduleView sct={sct} />
                            </div>
                        </div>
                        <SubjectSection sct={sct} semesters={semesters} />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

const SubjectCard = ({
    href,
    title,
    class_,
    teacher,
    day,
    from,
    to,
    color,
}) => {
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

    return (
        <Link
            href={href}
            className={`${colors[color]} shadow-md rounded-md overflow-hidden`}
        >
            <div className="p-3">
                <h2 className="text-white text-lg font-bold">{title}</h2>
                <p className="text-white text-sm">{class_}</p>
            </div>
            <div className="bg-white p-3">
                <div className="mb-3">
                    <p>
                        <img
                            src="/assets/svg/profile.svg"
                            alt="profile"
                            className="inline-block h-7 w-7 bg-[#C5DCFA] rounded-full p-1"
                        />
                        <span className="text-black/50 font-medium ml-3">
                            {teacher}
                        </span>
                    </p>
                </div>
                <div>
                    <p>
                        <img
                            src="/assets/svg/calendar-today.svg"
                            alt="calendar"
                            className="inline-block h-7 w-7 bg-[#C5DCFA] rounded-full p-1"
                        />
                        <span className="text-black/50 font-medium ml-3 capitalize">{`${daysName[day]} ${from} - ${to}`}</span>
                    </p>
                </div>
            </div>
        </Link>
    );
};
