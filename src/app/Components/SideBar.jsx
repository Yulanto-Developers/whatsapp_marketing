"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

function SideBar({ open, setOpen }) {
  return (
    <aside
      className={`fixed left-0 top-0 h-screen  border-r
      transition-all duration-300
      ${open ? "w-64" : "w-16"}`}
    >
      
      <div className="h-14 flex items-center justify-between px-4 border-b">
        {open && <span className="font-semibold">Navigation</span>}
        <button onClick={() => setOpen(!open)}>
          {open ? <ChevronLeft /> : <ChevronRight />}
        </button>
      </div>

   
      <ul className="mt-4 space-y-1">
        <NavItem href="/dashboard/home" label="Message" open={open} />
        {/* <NavItem href="/group" label="Group" open={open} />
        <NavItem href="/campaign" label="Campaign" open={open} />
        <NavItem href="/settings" label="Settings" open={open} /> */}
      </ul>
    </aside>
  );
}

function NavItem({ href, label, open }) {
  return (
    <li>
      <Link
        href={href}
        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-200 transition"
      >
        <span className="w-6 h-6 bg-gray-400 rounded-full" />
        {open && <span>{label}</span>}
      </Link>
    </li>
  );
}

export default SideBar;
