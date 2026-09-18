"use client";

import { ChevronDown } from "lucide-react";
import ThemeToggle from "@/components/buttons/toggle_button";

export function Topbar() {
  return (
    <header className="flex h-20 items-center justify-end border-b border-slate-200 bg-white/80 px-5 backdrop-blur md:px-8 dark:border-slate-800 dark:bg-slate-950/80">
      <div className="flex items-center gap-4">
        <ThemeToggle className="static shadow-none" />
        <div className="h-7 w-px bg-slate-200 dark:bg-slate-800" />
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
            VC
          </div>
          <span className="hidden text-xs font-semibold text-slate-700 sm:block dark:text-slate-200">
            Vincent Patrick Castro
          </span>
          <ChevronDown size={14} className="text-slate-400" />
        </div>
      </div>
    </header>
  );
}

export default Topbar;
