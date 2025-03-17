export default function Assignment({ title, datetime }) {
    return (
        <div className="flex items-center gap-5 mb-3">
            <div className="p-2 rounded-full bg-[#C5DCFA]">
                <img
                    src="/assets/svg/Book_duotone.svg"
                    alt="icon"
                    className="w-8 h-8"
                />
            </div>
            <div>
                <h2 className="font-bold text-lg">{title}</h2>
                <p className="text-sm text-black/50">Batas waktu: {datetime}</p>
            </div>
        </div>
    );
}
