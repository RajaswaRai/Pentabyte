import { Link } from "@inertiajs/react";

export default function NavLink({
    active = false,
    className = "",
    children,
    ...props
}) {
    return (
        <Link
            {...props}
            className={
                "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium leading-5 transition duration-150 ease-in-out focus:outline-none " +
                (active
                    ? "border-white font-bold text-white focus:border-white/80 "
                    : "border-transparent font-bold text-white/50 hover:text-white/80 hover:border-white/80 focus:text-white/80 focus:border-white/80 ") +
                className
            }
        >
            {children}
        </Link>
    );
}
