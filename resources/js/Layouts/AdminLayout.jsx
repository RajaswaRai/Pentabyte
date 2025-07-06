import { useEffect, useState } from "react";
import ApplicationLogo from "@/Components/ApplicationLogo";
import { Link, usePage } from "@inertiajs/react";
import { roleMap } from "@/utils/enums";

export default function Authenticated({ user, children }) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(null);

    // Deteksi ukuran layar
    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
        };

        handleResize(); // inisialisasi
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Atur sidebar tergantung ukuran layar
    useEffect(() => {
        if (isMobile === null) return;
        setSidebarOpen(!isMobile); // true di desktop, false di mobile
    }, [isMobile]);

    const toggleSidebar = () => {
        if (isMobile) {
            setSidebarOpen((prev) => !prev);
        }
    };

    if (isMobile === null) return null; // jangan render sampai status mobile diketahui

    return (
        <div className="min-h-screen bg-[#EEF2F6] flex">
            {/* Sidebar */}
            <div
                className={`overflow-hidden bg-[#F4F4F4] border-r-2 border-gray-300 text-[#757D8A] transition-all duration-300 ease-in-out
                ${sidebarOpen ? "w-64" : "w-20"}
                ${isMobile ? "fixed inset-y-0 z-50" : "relative"}
                transform ${
                    isMobile && !sidebarOpen
                        ? "-translate-x-full"
                        : "translate-x-0"
                }
            `}
            >
                <div className="h-full flex flex-col pt-4 overflow-y-auto">
                    <nav className="flex-1">
                        <div className="flex gap-3 items-center justify-between px-2 mb-5">
                            <div className="flex gap-3 items-center">
                                <img
                                    src="/assets/img/avatar.png"
                                    alt="Avatar"
                                    className="w-10 h-10"
                                />
                                {!isMobile && sidebarOpen && (
                                    <div className="whitespace-nowrap">
                                        <p className="text-sm capitalize">
                                            {roleMap[user.role]}
                                        </p>
                                        <p className="mb-1 font-semibold">
                                            {
                                                user[roleMap[user.role]]
                                                    ?.full_name
                                            }
                                        </p>
                                    </div>
                                )}
                            </div>
                            {!isMobile && sidebarOpen && (
                                <button className="border-2 border-gray-300 rounded-md px-3 py-1 bg-white">
                                    <img
                                        src="/assets/svg/gear.svg"
                                        alt="gear.svg"
                                    />
                                </button>
                            )}
                        </div>
                        <ul className="space-y-2 px-2">
                            {[
                                { label: "Beranda", route: "admin.dashboard" },
                                { label: "Kelas", route: "admin.classroom" },
                                {
                                    label: "Mata Pelajaran",
                                    route: "admin.subject",
                                },
                                { label: "Guru", route: "admin.teacher" },
                                { label: "Murid", route: "admin.student" },
                                { label: "Jadwal", route: "admin.schedule" },
                                { label: "Semester", route: "admin.semester" },
                            ].map(({ label, route: routeName }) => (
                                <SidebarLink
                                    key={routeName}
                                    href={route(routeName)}
                                    active={route().current(routeName)}
                                    collapsed={!sidebarOpen}
                                    icon={<SidebarIcon />}
                                >
                                    {label}
                                </SidebarLink>
                            ))}
                        </ul>
                        <Link
                            className="p-2 block"
                            href={route("logout")}
                            method="post"
                            as="button"
                        >
                            Log Out
                        </Link>
                    </nav>
                </div>
            </div>

            {/* Backdrop untuk mobile */}
            {isMobile && sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
                    onClick={toggleSidebar}
                />
            )}

            {/* Main content */}
            <div className="flex-1 transition-all duration-300">
                {/* Topbar untuk mobile */}
                <nav className="md:hidden bg-[#153580] text-white">
                    <div className="px-4 h-16 flex items-center justify-between">
                        {isMobile && (
                            <button onClick={toggleSidebar} className="p-2">
                                <svg
                                    className="h-6 w-6"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                </svg>
                            </button>
                        )}
                        <Link href="/">
                            <ApplicationLogo className="h-12 w-auto" />
                        </Link>
                    </div>
                </nav>

                <main>{children}</main>
            </div>
        </div>
    );
}

function SidebarLink({ href, active, children, collapsed, icon }) {
    return (
        <Link
            href={href}
            className={`flex items-center p-3 rounded-md transition-colors ${
                active
                    ? "bg-[#2a4a9c] text-white"
                    : "text-[#757D8A] hover:bg-[#dde6ff]"
            }`}
        >
            {icon}
            <span className={`ml-2 ${collapsed ? "hidden" : "inline"}`}>
                {children}
            </span>
        </Link>
    );
}

function SidebarIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
        </svg>
    );
}
