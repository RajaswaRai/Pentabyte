import { Link, usePage } from "@inertiajs/react";

export default function Header() {
  const { auth } = usePage().props; // Mengambil data autentikasi dari Laravel

  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo / Judul */}
        {/* <h1 className="text-xl font-bold">LMS Navigation</h1> */}
        <h1 className="text-xl font-bold">
          <Link href="/" className="hover:underline">
            LMS Navigation
          </Link>
        </h1>

        {/* Navigasi */}
        <div className="space-x-4">
          <Link href="/student-card-report" className="hover:underline">
            Student Card Report
          </Link>
          <Link href="/classroom" className="hover:underline">
            Classroom
          </Link>
          <Link href="/student-assignment" className="hover:underline">
            Student Assignment
          </Link>
          <Link href="/teacher-student-absence" className="hover:underline">
            Teacher-Student Absence
          </Link>
        </div>

        {/* Login / Register atau Dashboard */}
        <div>
          {auth.user ? (
            <Link
              href={route("dashboard")}
              className="font-semibold text-gray-200 hover:text-gray-400"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                href={route("login")}
                className="font-semibold text-gray-200 hover:text-gray-400"
              >
                Log in
              </Link>
              <Link
                href={route("register")}
                className="ml-4 font-semibold text-gray-200 hover:text-gray-400"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
