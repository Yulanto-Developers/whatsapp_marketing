'use client'

import React, { useState } from "react";

export default function Page() {
    const [group, setGroup] = useState('Group');
    const [tables, setTable] = useState('');
    const [template, setTemplate] = useState("");
    const [phone, setPhone] = useState("");
    const [text, setText] = useState('');

    const handleSend = async () => {
        if (!template || !phone && group!=='Group') {
            alert("Enter all fields");
            return;
        }

        let formattedPhone = phone.trim();

        if (!formattedPhone.startsWith("91")) {
            formattedPhone = "91" + formattedPhone;
        }



        await fetch("/api/sendChat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(
                group === 'Group' ? {
                    group: group,
                    table: tables,
                    message: template,
                    text: text ?? ''
                } : {
                    group: group,
                    to: formattedPhone,
                    message: template,
                    text: text ?? ''
                }
            ),
        });

        alert("Message Sent");
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Marketing Setup</h1>

                <div className="space-y-4">


                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Select Marketing
                        </label>
                        <select
                            value={group}
                            onChange={(e) => setGroup(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 text-black rounded-lg"
                        >

                            <option value="Group">Group</option>
                            <option value="Individual">Individual</option>
                            {/* <option value="republic_offers">Republic Offers</option>
                            <option value="welcome_new_enquiry">Welcome Enquiry</option> */}
                        </select>
                    </div>
                    <div>
                        {
                            group === 'Group' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Select Table
                                    </label>
                                    <select
                                        value={tables}
                                        onChange={(e) => setTable(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 text-black rounded-lg"
                                    >
                                        <option value="">Select</option>
                                        <option value="test_client">Test Client</option>
                                        {/* <option value="republic_clients_wishes">Republic Wishes</option> */}
                                        {/* <option value="republic_offers">Republic Offers</option>
                                        <option value="welcome_new_enquiry">Welcome Enquiry</option> */}
                                    </select>
                                </div>
                            )
                        }
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Select Template
                        </label>
                        <select
                            value={template}
                            onChange={(e) => setTemplate(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 text-black rounded-lg"
                        >
                            <option value="">Select</option>
                            <option value="hello_world">Hello World</option>
                            <option value="republic_clients_wishes">Republic Wishes</option>
                            <option value="republic_offers">Republic Offers</option>
                            <option value="welcome_new_enquiry">Welcome Enquiry</option>
                        </select>
                    </div>
                    <div>
                        {
                            group === 'Individual' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Phone Number
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Enter phone number"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="w-full px-4 py-2 border text-black border-gray-300 rounded-lg"
                                    />
                                </div>
                            )
                        }
                    </div>



                    <div>
                        {template === "welcome_new_enquiry" && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Enter the Content
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter name"
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                />
                            </div>
                        )}
                    </div>

                    <button
                        onClick={handleSend}
                        className="w-full bg-blue-600 text-white py-2 rounded-lg"
                    >
                        Send Message
                    </button>

                </div>
            </div>
        </div>
    );
}