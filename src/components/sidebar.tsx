"use client";

import Link from "next/link";
import { FolderKanban, LogOut } from "lucide-react";

export function Sidebar() {
  return (
    <aside className="hidden min-h-screen w-56 shrink-0 border-r border-slate-200 bg-white px-4 py-6 dark:border-slate-800 dark:bg-slate-950 md:flex md:flex-col">
      <div className="flex items-center gap-2 px-3 pb-10">
        <span className="text-2xl font-bold text-slate-950 dark:text-white">
          V<span className="text-blue-500">C.</span>
        </span>
        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Portfolio</span>
      </div>
      <nav className="space-y-2" aria-label="Dashboard navigation">
        <a
          href="#dashboard"
          className="flex items-center gap-3 rounded-lg bg-blue-100 px-3 py-2.5 text-sm font-medium text-blue-700 dark:bg-blue-950/60 dark:text-blue-300"
        >
          <FolderKanban size={17} /> Dashboard
        </a>
        <Link
          href="/"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white"
        >
          <LogOut size={17} /> Sign Out
        </Link>
      </nav>
      <p className="mt-auto px-3 text-[10px] text-slate-400">
        <span className="mr-2 text-blue-500">*</span>Built for a better web
      </p>
    </aside>
  );
}

export default Sidebar;
