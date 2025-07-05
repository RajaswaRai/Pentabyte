// msg from LessonComment model
export default function Message({ comment }) {
    return (
        <div className="flex gap-3 mb-5 items-center">
            <img
                className="rounded-full w-10 h-10 bg-slate-300 overflow-hidden"
                src="/assets/img/Avatar(1).png"
                alt="user_profile"
            />
            <div>
                <p className="text-xl font-semibold">
                    Nama <span></span>
                </p>
                <p className="text-black/50">{comment.content}</p>
            </div>
        </div>
    );
}
