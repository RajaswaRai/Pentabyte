const WeeklyCalendar = () => {
    const days = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];
    const dates = [10, 11, 12, 13, 14, 15, 16];
    const selectedDay = 13;

    return (
        <div className="flex justify-between space-x-4 border-b pb-2">
            {days.map((day, index) => (
                <div key={index} className="flex flex-col items-center">
                    <span
                        className={`text-sm ${
                            dates[index] === selectedDay
                                ? "text-green-600"
                                : "text-black/50"
                        }`}
                    >
                        {day}
                    </span>
                    <div
                        className={`my-1 w-8 h-8 flex text-sm items-center justify-center rounded-full ${
                            dates[index] === selectedDay
                                ? "bg-green-500 text-white"
                                : "text-black/50"
                        }`}
                    >
                        {dates[index]}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default WeeklyCalendar;
