"use client";

export default function Home() {
    return (
        <div className="h-full w-full p-6">
            {/* Page Header */}
            <div className="mb-4">
                <h1 className="text-2xl font-semibold text-gray-800">
                    Home
                </h1>
                <p className="text-sm text-gray-600">
                    Welcome back! Select a chat to start messaging.
                </p>
            </div>

            {/* WhatsApp-style Chat Area */}
            <div className="bg-white h-[calc(100vh-120px)] rounded-lg shadow flex">
                {/* Chat List */}
                <aside className="w-1/3 border-r overflow-y-auto">
                    {[1, 2, 3, 4, 5].map((item) => (
                        <div
                            key={item}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 cursor-pointer"
                        >
                            <div className="w-10 h-10 rounded-full bg-gray-400" />
                            <div className="flex-1">
                                <p className="font-medium text-gray-800">John Doe</p>
                                <p className="text-sm text-gray-500 truncate">
                                    Last message preview...
                                </p>
                            </div>
                            <span className="text-xs text-gray-400">12:45</span>
                        </div>
                    ))}
                </aside>

                {/* Chat Window */}
                <main className="flex-1 flex flex-col bg-[#efeae2]">
                    {/* Chat Header */}
                    <div className="h-14 px-4 flex items-center border-b bg-[#f0f2f5]">
                        <div className="w-9 h-9 rounded-full bg-gray-400" />
                        <div className="ml-3">
                            <p className="font-medium text-gray-800">John Doe</p>
                            <p className="text-xs text-gray-500">online</p>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 p-4 space-y-3 overflow-y-auto">
                        <div className="max-w-xs bg-white px-4 py-2 rounded-lg shadow">
                            Hello 👋
                        </div>

                        <div className="max-w-xs ml-auto bg-[#d9fdd3] px-4 py-2 rounded-lg shadow">
                            Hi! How are you?
                        </div>

                        <div className="max-w-xs bg-white px-4 py-2 rounded-lg shadow">
                            All good 😊
                        </div>
                    </div>

                    {/* Message Input */}
                    <div className="h-14 px-4 flex items-center bg-[#f0f2f5]">
                        <input
                            type="text"
                            placeholder="Type a message"
                            className="flex-1 px-4 py-2 rounded-full bg-white border focus:outline-none"
                        />
                        <button className="ml-3 bg-green-500 text-white px-5 py-2 rounded-full hover:bg-green-600">
                            Send
                        </button>
                    </div>
                </main>
            </div>
        </div>
    );
}
