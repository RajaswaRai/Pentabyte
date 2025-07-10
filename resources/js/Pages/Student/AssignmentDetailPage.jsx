import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { EditorState } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { schema } from "prosemirror-schema-basic";
import { keymap } from "prosemirror-keymap";
import { baseKeymap, toggleMark, wrapIn } from "prosemirror-commands";
import { undo, redo, history } from "prosemirror-history";
import "prosemirror-view/style/prosemirror.css";
import "prosemirror-menu/style/menu.css";

import { menuBar, blockTypeItem, icons, MenuItem } from "prosemirror-menu";

export default function AssignmentDetailPage({
    auth,
    sct,
    class_students_count,
    assignment,
}) {
    const [countdown, setCountdown] = useState("");
    const editorRef = useRef(null);
    const editorViewRef = useRef(null);
    const [answerContent, setAnswerContent] = useState("");

    useEffect(() => {
        const updateCountdown = () => {
            const deadline = moment(
                `${assignment.due_date} ${assignment.due_time}`,
                "YYYY-MM-DD HH:mm"
            );
            const now = moment();
            const diff = deadline.diff(now);
            if (diff <= 0) return setCountdown("Waktu telah habis");
            const totalSeconds = Math.floor(moment.duration(diff).asSeconds());
            const days = Math.floor(totalSeconds / (60 * 60 * 24));
            const hours = Math.floor(
                (totalSeconds % (60 * 60 * 24)) / (60 * 60)
            );
            const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
            const seconds = totalSeconds % 60;
            setCountdown(`${days}d ${hours}h ${minutes}m ${seconds}s`);
        };
        updateCountdown();
        const timer = setInterval(updateCountdown, 1000);
        return () => clearInterval(timer);
    }, [assignment.due_date, assignment.due_time]);

    useEffect(() => {
        if (editorRef.current && !editorViewRef.current) {
            const marks = schema.marks;
            const nodes = schema.nodes;

            const items = [
                new MenuItem({
                    command: toggleMark(marks.strong),
                    title: "Bold",
                    icon: icons.strong,
                }),
                new MenuItem({
                    command: toggleMark(marks.em),
                    title: "Italic",
                    icon: icons.em,
                }),
                new MenuItem({
                    command: toggleMark(marks.code),
                    title: "Code",
                    icon: icons.code,
                }),
                blockTypeItem(nodes.paragraph, {
                    title: "Paragraph",
                    label: "P",
                }),
                blockTypeItem(nodes.heading, {
                    title: "Heading 1",
                    label: "H1",
                    attrs: { level: 1 },
                }),
                blockTypeItem(nodes.heading, {
                    title: "Heading 2",
                    label: "H2",
                    attrs: { level: 2 },
                }),
                new MenuItem({
                    command: wrapIn(nodes.blockquote),
                    title: "Blockquote",
                    icon: icons.blockquote,
                }),
                new MenuItem({
                    command: wrapIn(nodes.bullet_list),
                    title: "Bullet List",
                    icon: icons.bulletList,
                }),
                new MenuItem({
                    command: wrapIn(nodes.ordered_list),
                    title: "Ordered List",
                    icon: icons.orderedList,
                }),
                new MenuItem({
                    command: undo,
                    title: "Undo",
                    icon: icons.undo,
                }),
                new MenuItem({
                    command: redo,
                    title: "Redo",
                    icon: icons.redo,
                }),
            ];

            editorViewRef.current = new EditorView(editorRef.current, {
                state: EditorState.create({
                    doc: schema.topNodeType.createAndFill(),
                    plugins: [
                        history(),
                        keymap(baseKeymap),
                        menuBar({ floating: false, content: [items] }), // <- FIX: wrapped in another array
                    ],
                }),
                dispatchTransaction(transaction) {
                    const newState =
                        editorViewRef.current.state.apply(transaction);
                    editorViewRef.current.updateState(newState);
                    setAnswerContent(newState.doc.textContent);
                },
            });
        }
    }, []);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Assignment
                </h2>
            }
        >
            <Head title="Assignment Detail" />
            <div className="rounded-b-[1.5rem] bg-gradient-to-r from-[#153580] to-[#0C3159] text-white">
                <div className="py-8 px-20 max-w-screen-2xl mx-auto">
                    <div className="mb-8">
                        <h1 className="font-semibold text-2xl">
                            {sct.subject.name}
                        </h1>
                        <h2>Kelas: {sct.classroom.name}</h2>
                    </div>
                    <div className="flex items-center gap-5">
                        <div className="flex-1">
                            <h3 className="text-[#D0D0D0]">Guru Pengajar</h3>
                            <p className="text-xl font-medium">
                                {sct.teacher.full_name}
                            </p>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-[#D0D0D0]">Jumlah Peserta</h3>
                            <p className="text-xl font-medium">
                                {class_students_count}
                            </p>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-[#D0D0D0]">Periode Akademik</h3>
                            <p className="text-xl font-medium">
                                2024/2025 Genap
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="py-12">
                <div className="px-20 max-w-screen-2xl mx-auto">
                    <div className="flex gap-5">
                        <div className="min-w-80">
                            <div>
                                <button
                                    className="mb-5 font-semibold text-[#133475]"
                                    onClick={() => window.history.back()}
                                >
                                    <img
                                        src="/assets/svg/Back.svg"
                                        alt="back"
                                        className="inline -mt-2"
                                    />
                                    <span className="ml-3">Kembali</span>
                                </button>
                            </div>
                            <div className="bg-white p-5 rounded-lg"></div>
                        </div>
                        <div className="flex-1">
                            <h1 className="font-semibold text-xl text-black/70 mb-3">
                                {assignment.name} {">"} {sct.subject.name}
                            </h1>
                            <div className="bg-white rounded-md mb-3">
                                <div className="p-3">
                                    <p className="font-medium">Sisa Waktu:</p>
                                </div>
                                <hr className="border-t-2" />
                                <div className="p-3">
                                    <p>
                                        <span className="font-semibold text-lg text-[#6F9CEE]">
                                            {countdown}
                                        </span>
                                    </p>
                                </div>
                            </div>
                            <div className="bg-white">
                                <div className="p-3">
                                    <div className="flex gap-5 items-center justify-between">
                                        <span className="font-medium text-lg">
                                            Jawaban:
                                        </span>
                                        <button>Riwayat Pengumpulan</button>
                                        <button>Kirim Jawaban</button>
                                    </div>
                                </div>
                                <hr className="border-t-2" />
                                <div className="p-3">
                                    <div
                                        ref={editorRef}
                                        className="bg-white border border-gray-300 rounded-md overflow-hidden"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
