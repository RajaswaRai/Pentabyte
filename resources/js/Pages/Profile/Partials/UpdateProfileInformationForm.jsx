import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Link, useForm, usePage } from "@inertiajs/react";
import { Transition } from "@headlessui/react";
import { userRole } from "@/utils/enums";

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = "",
}) {
    const user = usePage().props.auth.user;
    let user_info;
    switch (user.role) {
        case userRole.ADMIN:
            user_info = user.admin;
            break;
        case userRole.TEACHER:
            user_info = user.teacher;
            break;
        case userRole.STUDENT:
            user_info = user.student;
            break;
        case userRole.GUARDIAN:
            user_info = user.guardian;
            break;
    }

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            full_name: user_info.full_name,
            // username: user.username,
            // email: user.email,
        });

    const submit = (e) => {
        e.preventDefault();

        patch(route("profile.update") + "?isDebug=true");
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900">
                    Profile Information
                </h2>

                {/* <p className="mt-1 text-sm text-gray-600">
                    Update your account's profile information and email address.
                </p> */}
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                <div>
                    <InputLabel htmlFor="full_name" value="Full Name" />

                    <TextInput
                        id="full_name"
                        type="text"
                        className="mt-1 block w-full text-gray-500"
                        value={data.full_name}
                        onChange={(e) => setData("full_name", e.target.value)}
                        autoComplete="full_name"
                        isFocused
                        disabled
                    />

                    <InputError className="mt-2" message={errors.full_name} />
                </div>

                <div>
                    <InputLabel htmlFor="name" value="Username" />

                    <TextInput
                        id="name"
                        className="mt-1 block w-full text-gray-500"
                        value={user.username}
                        autoComplete="username"
                        disabled={true}
                    />
                </div>

                <div>
                    <InputLabel htmlFor="email" value="Email" />

                    <TextInput
                        id="email"
                        type="email"
                        className="mt-1 block w-full text-gray-500"
                        value={user.email}
                        // onChange={(e) => setData("email", e.target.value)}
                        autoComplete="username"
                        disabled={true}
                    />

                    {/* <InputError className="mt-2" message={errors.email} /> */}
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div>
                        <p className="text-sm mt-2 text-gray-800">
                            Your email address is unverified.
                            <Link
                                href={route("verification.send")}
                                method="post"
                                as="button"
                                className="underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Click here to re-send the verification email.
                            </Link>
                        </p>

                        {status === "verification-link-sent" && (
                            <div className="mt-2 font-medium text-sm text-green-600">
                                A new verification link has been sent to your
                                email address.
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-4">
                    {/* <PrimaryButton disabled={processing}>Save</PrimaryButton> */}

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-gray-600">Saved.</p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
