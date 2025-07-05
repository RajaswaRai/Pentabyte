import { useEffect } from "react";
import Checkbox from "@/Components/Checkbox";
import GuestLayout from "@/Layouts/GuestLayout";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Head, Link, useForm } from "@inertiajs/react";
import ApplicationLogo from "@/Components/ApplicationLogo";

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        username: "",
        password: "",
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset("password");
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();

        post(route("login") + "?isDebug=true");
    };

    return (
        <GuestLayout>
            <Head title="Login" />

            <div className="flex flex-col items-center mb-4">
                <Link href="/">
                    <ApplicationLogo className="w-20 h-20 fill-current text-gray-500" />
                </Link>
                <h1 className="font-black text-3xl">Login</h1>
            </div>

            {status && (
                <div className="mb-4 font-medium text-sm text-green-600">
                    {status}
                </div>
            )}

            <form onSubmit={submit}>
                <div>
                    <InputLabel htmlFor="username" value="Username" />

                    <TextInput
                        id="username"
                        type="text"
                        name="username"
                        value={data.username}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData("username", e.target.value)}
                    />

                    <InputError message={errors.username} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Password" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        autoComplete="current-password"
                        onChange={(e) => setData("password", e.target.value)}
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="mt-4">
                    <div className="flex justify-between mb-3">
                        <div>
                            <label className="flex items-center">
                                <Checkbox
                                    name="remember"
                                    checked={data.remember}
                                    onChange={(e) =>
                                        setData("remember", e.target.checked)
                                    }
                                />
                                <span className="ms-2 text-sm text-gray-600">
                                    Remember me
                                </span>
                            </label>
                        </div>

                        {canResetPassword && (
                            <Link
                                href={route("password.request")}
                                className="ms-2 text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Forgot password?
                            </Link>
                        )}
                    </div>

                    <button
                        className={`mt-1 w-full rounded-full text-center items-center px-4 py-2 bg-[#1979BB] border border-transparent font-semibold text-xs text-white uppercase tracking-widest hover:bg-[#206593] focus:bg-gray-700 active:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150 ${
                            processing && "opacity-25"
                        } `}
                        disabled={processing}
                    >
                        Login
                    </button>
                </div>
            </form>
        </GuestLayout>
    );
}
