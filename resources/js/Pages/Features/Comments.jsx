import Message from "@/Components/pentabyte/Message";

export default function Comments({ comments, loading }) {
    if (loading) {
        return (
            <div className="flex justify-center items-center py-6">
                <div className="w-6 h-6 border-4 border-blue-300 border-t-transparent rounded-full animate-spin"></div>
                <span className="ml-2 text-sm text-gray-600">
                    Loading comments...
                </span>
            </div>
        );
    }

    if (!comments || comments.length === 0) {
        return <p className="text-center font-semibold">No comments yet.</p>;
    }

    return comments.map((comment) => (
        <Message key={comment.id} comment={comment} />
    ));
}
