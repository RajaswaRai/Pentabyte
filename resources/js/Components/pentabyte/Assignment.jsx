import { daysName } from "@/settings";
import { Link } from "@inertiajs/react";
import moment from "moment";
import "moment/locale/id";

export default function Assignment({ href, title, date, time }) {
    return (
        <Link href={href} className="flex items-center gap-5">
            <div className="p-2 rounded-full bg-[#C5DCFA]">
                <img
                    src="/assets/svg/Book_duotone.svg"
                    alt="icon"
                    className="w-8 h-8"
                />
            </div>
            <div>
                <h2 className="font-bold">{title}</h2>
                <p className="text-xs font-semibold text-black/50 capitalize">
                    Batas waktu:
                    {` ${daysName[moment(date).day()]} ${moment(
                        `${date}T${time}`
                    )
                        .locale("id")
                        .format("D MMMM YYYY HH:mm")}`}
                </p>
            </div>
        </Link>
    );
}
