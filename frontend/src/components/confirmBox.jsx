export default function ConfirmBox({ onConfirm, onDiscard }) {
    return (
        <div className="fixed inset-0 flex items-center p-4 justify-center bg-transparent bg-opacity-30 z-50">
            <div className="bg-green-400 rounded-2xl shadow-lg p-4 flex flex-col items-center gap-4 min-w-[200px]">
                <p className="text-lg font-semibold text-white mb-4">Do you want to release the results?</p>
                <div className="flex gap-4">
                    <button
                        onClick={onConfirm}
                        className="px-6 py-2 rounded-lg bg-green-500 text-white font-semibold hover:bg-green-600 transition"
                    >
                        Yes
                    </button>
                    <button
                        onClick={onDiscard}
                        className="px-6 py-2 rounded-lg bg-gray-300 text-green-700 font-semibold hover:bg-gray-400 transition"
                    >
                        No
                    </button>
                </div>
            </div>
        </div>
    );
}