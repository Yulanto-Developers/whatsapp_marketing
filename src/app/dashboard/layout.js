"use client";

import SideBar from "../Components/SideBar";
import { useState } from "react";

export default function DashboardLayout({ children }) {
    const [open, setOpen] = useState(true);

    return (
        <div className="flex h-screen overflow-hidden">
            <SideBar open={open} setOpen={setOpen} />

            <main
                className={`flex-1 transition-all duration-300 bg-[#efeae2]
        ${open ? "ml-64" : "ml-16"}`}
            >
                {children}
            </main>
        </div>
    );
}
