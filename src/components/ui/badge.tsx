"use client";
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
    return (<span className={cn("inline-flex items-center rounded-full border border-[#D6C2AA] bg-[#FFF8ED] px-3 py-1 text-xs font-medium uppercase tracking-[0.08em] text-[#6F4A39]", className)} {...props}/>);
}
