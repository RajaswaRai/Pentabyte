import moment from "moment";
import { useEffect, useState } from "react";

const WeeklyCalendar = ({ selectedDay, onSelectDay }) => {
    const [week, setWeek] = useState([]);

    useEffect(() => {
        const startOfWeek = moment().startOf("week"); // Sunday
        const newWeek = [];

        for (let i = 0; i < 7; i++) {
            const date = moment(startOfWeek).add(i, "days");
            newWeek.push({
                label: ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"][i],
                dayIndex: date.day(), // 0 (Sun) to 6 (Sat)
                dateNumber: date.date(), // Just day of the month
            });
        }

        setWeek(newWeek);
    }, []);

    return (
        <div className="flex justify-between space-x-4 border-b pb-2">
            {week.map((day, index) => (
                <div
                    key={index}
                    className="flex flex-col items-center cursor-pointer"
                    onClick={() => onSelectDay(day.dayIndex)}
                >
                    <span
                        className={`text-sm ${
                            selectedDay === day.dayIndex
                                ? "text-green-600"
                                : "text-black/50"
                        }`}
                    >
                        {day.label}
                    </span>
                    <div
                        className={`my-1 w-8 h-8 flex text-sm items-center justify-center rounded-full ${
                            selectedDay === day.dayIndex
                                ? "bg-green-500 text-white"
                                : "text-black/50"
                        }`}
                    >
                        {day.dateNumber}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default WeeklyCalendar;
