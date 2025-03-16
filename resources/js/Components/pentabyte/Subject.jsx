export default function Subject({ status, name, major, from, to, location }) {
    return (
        <div>
            {status ? (
                <div className="mb-2 bg-[#F7716E] py-2 px-4 text-xs text-white rounded-md w-fit">
                    <p className="before:mr-2 before:-mb-[0.120rem] before:inline-block before:w-3 before:h-3 before:bg-white before:rounded-full">
                        Berlangsung
                    </p>
                </div>
            ) : null}
            <div className="mb-3">
                <div className="mb-2">
                    <h2 className="font-bold text-xl">{name}</h2>
                    <p className="text-sm text-black/50">{major}</p>
                </div>
                <div className="flex items-center gap-5">
                    <div>
                        <p className="text-black/50 text-sm flex items-center gap-1">
                            <img
                                src="/assets/svg/Time_fill.svg"
                                alt="icon"
                                className="w-4 h-4"
                            />
                            {from} - {to}
                        </p>
                    </div>
                    <div>
                        <p className="text-black/50 text-sm flex items-center gap-1">
                            <img
                                src="/assets/svg/Pin_fill.svg"
                                alt="icon"
                                className="w-4 h-4"
                            />
                            {location}
                        </p>
                    </div>
                </div>
            </div>
            <hr />
        </div>
    );
}
