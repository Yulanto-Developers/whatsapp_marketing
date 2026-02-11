"use client";

import { useEffect, useRef, useState } from "react";
import { IoPersonCircleOutline } from "react-icons/io5";
import toast, { Toaster } from "react-hot-toast";

export default function Home() {
    const [User, setUser] = useState([]);
    const [chat, setChat] = useState([]);
    const [data, setData] = useState({ msg: "" });
    const [search, setSearch] = useState("");
    const [selectedNumber, setSelectedNumber] = useState(null);

    const bottomRef = useRef(null);


    useEffect(() => {
        getUserName();
        fetch("/api/socket");
    }, []);

    async function getUserName() {
        try {
            const res = await fetch("/api/user");
            const result = await res.json();

            if (result.status === 200 && Array.isArray(result.message)) {
                setUser(result.message);
            } else {
                setUser([]);
            }
        } catch (err) {
            setUser([]);
        }
    }


    async function ChatData(num) {
        try {
            setSelectedNumber(num);

            const chatApi = await fetch("/api/user", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ num }),
            });

            if (!chatApi.ok) {
                console.error("API Error:", chatApi.status);
                return;
            }

            const resChat = await chatApi.json();

            if (resChat.status === 200) {
                setChat(resChat.message);
            }

        } catch (error) {
            console.error("ChatData error:", error);
        }
    }

    // useEffect(() => {
    //     fetch("/api/socket");
    // }, []);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chat]);


    function handleChange(e) {
        const { name, value } = e.target;
        setData((prev) => ({ ...prev, [name]: value }));
    }

    async function handleSubmit(e) {
        e.preventDefault();

        if (!selectedNumber) {
            toast.error("Please select a chat first");
            return;
        }

        if (!data.msg.trim()) {
            toast.error("Please enter a message");
            return;
        }

        const sendApi = await fetch("/api/sendChat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                to: selectedNumber,
                message: data.msg,
            }),
        });

        const responseSend = await sendApi.json();

        if (sendApi.ok) {
            toast.success("Message sent", {
                duration: 3000,
                position: "bottom-right",
            });

            setData({ msg: "" });
            ChatData(selectedNumber);
        } else {

            const errorMsg =
                responseSend?.error?.error?.message ||
                responseSend?.error?.message ||
                "Failed to send message";

            toast.error(errorMsg);
        }

    }



    const filteredUsers = User.filter((item) => {
        const query = search.toLowerCase();
        return (
            item.contact_name?.toLowerCase().includes(query) ||
            item.phone_number?.includes(query)
        );
    });

    return (
        <div className="h-full w-full p-6">
            <Toaster />

            <div className="mb-4">
                <h1 className="text-2xl font-semibold text-gray-800">
                    Welcome Yulanto!
                </h1>
                <p className="text-sm text-gray-600">
                    Welcome back! Select a chat to start messaging.
                </p>
            </div>

            <div className="bg-slate-300 h-[calc(100vh-120px)] rounded-lg shadow flex">


                <aside className="w-1/3 border-r flex flex-col">

                    <div className="sticky top-0 z-10 bg-white p-3 border-b">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by name or number"
                            className="w-full px-3 py-2 rounded-md border text-sm focus:outline-none"
                        />
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        {filteredUsers.length > 0 ? (
                            filteredUsers.map((item) => (
                                <div
                                    key={item.id}
                                    onClick={() => ChatData(item.phone_number)}
                                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 cursor-pointer"
                                >
                                    <IoPersonCircleOutline className="w-10 h-10 text-gray-400" />

                                    <div className="flex-1">
                                        <p className="font-medium text-gray-800">
                                            {item.contact_name || item.phone_number}
                                        </p>
                                        <p className="text-sm text-gray-500 wrap-break-words line-clamp-2">
                                            {item.last_message}
                                        </p>
                                    </div>

                                    <span className="text-xs text-green-500">
                                        {formatDate(item.sent_at)}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <p className="p-4 text-sm text-gray-400 text-center">
                                No chats found
                            </p>
                        )}
                    </div>
                </aside>


                <main className="flex-1 flex flex-col bg-[#efeae2]">

                    {chat.length > 0 && (
                        <div className="h-14 px-4 flex items-center border-b bg-[#f0f2f5]">
                            <IoPersonCircleOutline className="w-10 h-10 text-gray-400" />
                            <div className="ml-3">
                                <p className="font-medium text-gray-800">
                                    {chat[0].person_name}
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="flex-1 p-4 space-y-3 overflow-y-auto">
                        {chat.map((item, index) => {
                            const isInbound =
                                item.direction?.toLowerCase() === "inbound";
                            const isLast = index === chat.length - 1;

                            return (
                                <div key={item.sent_at} ref={isLast ? bottomRef : null}>
                                    {isInbound ? (
                                        <div className="max-w-xs bg-white px-4 py-2 rounded-lg border-none text-black shadow break-all">
                                            <p>{item.message_content}</p>
                                            <span className="text-xs text-gray-500 block text-right">
                                                {formatTime(item.sent_at)}
                                            </span>
                                        </div>
                                    ) : (
                                        <div className="max-w-xs ml-auto bg-[#d9fdd3] px-4 py-2 rounded-lg border-none text-black shadow break-all">
                                            <p>{item.message_content}</p>
                                            <span className="text-xs text-gray-500 block text-right">
                                                {formatTime(item.sent_at)}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>


                    <form onSubmit={handleSubmit}>
                        <div className="h-14 px-4 flex items-center bg-[#f0f2f5]">
                            <input
                                type="text"
                                name="msg"
                                value={data.msg}
                                onChange={handleChange}
                                placeholder="Type a message"
                                className="flex-1 px-4 py-2 rounded-full bg-white border-none text-black focus:outline-none"
                            />
                            <button
                                type="submit"
                                className="ml-3 bg-green-500 text-white px-5 py-2 rounded-full hover:bg-green-600"
                            >
                                Send
                            </button>
                        </div>
                    </form>
                </main>
            </div>
        </div>
    );
}

function formatDate(val) {
    if (!val) return "";
    const date = new Date(val);
    if (isNaN(date)) return "";
    return date.toLocaleString(undefined, {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    });
}

function formatTime(val) {
    if (!val) return "";
    const date = new Date(val);
    if (isNaN(date)) return "";
    return date.toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
    });
}
