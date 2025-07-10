import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";

export default function Modal({
    children,
    show = false,
    maxWidth = "2xl",
    closeable = true,
    onClose = () => {},
}) {
    const close = () => {
        if (closeable) {
            onClose();
        }
    };

    const maxWidthClass = {
        sm: "sm:max-w-sm",
        md: "sm:max-w-md",
        lg: "sm:max-w-lg",
        xl: "sm:max-w-xl",
        "2xl": "sm:max-w-2xl",
    }[maxWidth];

    return (
        <Transition show={show} as={Fragment} leave="duration-200">
            <Dialog
                as="div"
                className="fixed inset-0 z-50 overflow-y-auto"
                onClose={close}
            >
                <div className="min-h-screen px-4 text-center flex items-start justify-center pt-10 pb-10">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
                    </Transition.Child>

                    {/* Modal Panel */}
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        enterTo="opacity-100 translate-y-0 sm:scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                        leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    >
                        <Dialog.Panel
                            className={`inline-block w-full transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all ${maxWidthClass}`}
                        >
                            {children}
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    );
}

// export default function Modal({
//     children,
//     show = false,
//     maxWidth = "2xl",
//     closeable = true,
//     onClose = () => {},
// }) {
//     const close = () => {
//         if (closeable) {
//             onClose();
//         }
//     };

//     const maxWidthClass = {
//         sm: "sm:max-w-sm",
//         md: "sm:max-w-md",
//         lg: "sm:max-w-lg",
//         xl: "sm:max-w-xl",
//         "2xl": "sm:max-w-2xl",
//     }[maxWidth];

//     return (
//         <Transition show={show} as={Fragment} leave="duration-200">
//             <Dialog
//                 as="div"
//                 id="modal"
//                 className="fixed inset-0 flex overflow-y-auto px-4 py-6 sm:px-0 items-center z-50 transform transition-all"
//                 onClose={close}
//             >
//                 <Transition.Child
//                     as={Fragment}
//                     enter="ease-out duration-300"
//                     enterFrom="opacity-0"
//                     enterTo="opacity-100"
//                     leave="ease-in duration-200"
//                     leaveFrom="opacity-100"
//                     leaveTo="opacity-0"
//                 >
//                     <div className="absolute inset-0 bg-gray-500/75" />
//                 </Transition.Child>

//                 <Transition.Child
//                     as={Fragment}
//                     enter="ease-out duration-300"
//                     enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
//                     enterTo="opacity-100 translate-y-0 sm:scale-100"
//                     leave="ease-in duration-200"
//                     leaveFrom="opacity-100 translate-y-0 sm:scale-100"
//                     leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
//                 >
//                     <Dialog.Panel
//                         className={`mb-6 bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:w-full sm:mx-auto ${maxWidthClass}`}
//                     >
//                         {children}
//                     </Dialog.Panel>
//                 </Transition.Child>
//             </Dialog>
//         </Transition>
//     );
// }
