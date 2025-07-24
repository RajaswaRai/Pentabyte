import ApplicationLogo from "@/Components/ApplicationLogo";
import { Link } from "@inertiajs/react";

export default function Guest({ children }) {
    return (
        <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-[#EEF2F6]">
            <div className="relative">
                <img
                    className="hidden md:block absolute -top-16 -left-60"
                    src="/assets/svg/hello.svg"
                    alt="hello.svg"
                />
                <div className="w-full mt-6 px-36 py-10 bg-white shadow-md overflow-hidden sm:rounded-lg relative">
                    {children}
                </div>
            </div>
        </div>
    );
}
