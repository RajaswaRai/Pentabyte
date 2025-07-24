import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

export default function assignments({ auth }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Assignments
                </h2>
            }
        >
            <Head title="Assignments" />

            <div className="rounded-b-[1.5rem] bg-gradient-to-r from-[#153580] to-[#0C3159] text-white">
                <div className="py-8 px-20 max-w-screen-2xl mx-auto"></div>
            </div>

            <div className="py-12">
                <div className="px-20 max-w-screen-2xl mx-auto"></div>
            </div>
        </AuthenticatedLayout>
    );
}

const Timeline = ({ lesson }) => {
    console.log(lesson);

    return (
        <div className="bg-white py-8 px-12 rounded-lg">
            <div className="flex gap-3 mb-5">
                <img
                    className="rounded-full w-16 h-16 bg-slate-300 overflow-hidden"
                    src="/assets/img/Avatar(1).png"
                    alt="user_profile"
                />
                <div>
                    <p className="text-xl font-semibold">
                        {lesson.subject_classroom_teacher.teacher.full_name}
                    </p>
                    <p className="text-black/50 font-medium">
                        {/* {"Menambahkan tugas > "}
                        <span className="text-[#6DD672]">sesi ke 1</span> */}
                    </p>
                    <p className="text-black/50 font-medium">
                        {moment(lesson.created_at).fromNow()}
                    </p>
                </div>
            </div>

            <div>
                <h1 className="font-bold text-2xl mb-2">{lesson.topic}</h1>
                <p className="text-black/50 font-medium mb-2">
                    {lesson.description}
                </p>

                {/* <div>
                    <Attachment className="mb-5" />
                </div> */}
            </div>

            {/* <div className="border-[1px] border-[#D4D4D4] p-5 rounded-xl mb-5">
                <div className="flex gap-3 items-center mb-4">
                    <div className="flex-1">
                        <Assignment title={""} date={""} time={""} />
                    </div>
                    <a className="text-white px-5 py-2 rounded-lg bg-[#27B1E0] text-sm font-semibold">
                        Lihat Detail
                    </a>
                </div>
                <p className="text-black/50 text-xs font-medium">
                    Lorem ipsum dolor
                </p>
            </div> */}

            <hr className="border-t-[1px] border-[#D4D4D4] mb-5" />

            <div className="flex justify-between gap-3">
                <CommentModalButton lesson_id={lesson.id} />
                <div>
                    <div>
                        <img
                            src="/assets/svg/Back.svg"
                            alt="share"
                            className="inline -mt-1"
                        />
                        <span className="ml-2 text-sm font-medium text-black/50">
                            Share
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};
