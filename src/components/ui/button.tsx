"use client";
import Link from "@/lib/i18n/Link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";
type BaseProps = {
    variant?: "primary" | "secondary" | "ghost" | "outline";
    size?: "sm" | "md" | "lg";
    children: ReactNode;
    className?: string;
};
const variants = {
    primary: "bg-[#6F4A39] text-[#FFF9EF] shadow-sm hover:bg-[#593A2D]",
    secondary: "bg-[#E7D2BA] text-[#3F342D] hover:bg-[#DEC3A5]",
    ghost: "text-[#4B4038] hover:bg-[#F0E5D6]",
    outline: "border border-[#CDB79C] bg-transparent text-[#4B4038] hover:bg-[#F7EFE3]",
};
const sizes = {
  sm: "min-h-9 px-4 py-2 text-sm text-center",
  md: "min-h-11 px-5 py-2 text-sm text-center",
  lg: "min-h-12 px-6 py-3 text-base text-center",
};
export function Button({ variant = "primary", size = "md", className, ...props }: BaseProps & ButtonHTMLAttributes<HTMLButtonElement>) {
    return (<button className={cn("inline-flex items-center justify-center rounded-full font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8F5F45] disabled:pointer-events-none disabled:opacity-50", variants[variant], sizes[size], className)} {...props}/>);
}
export function ButtonLink({ variant = "primary", size = "md", className, href, ...props }: BaseProps & AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
}) {
    return (<Link href={href} className={cn("inline-flex items-center justify-center rounded-full font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8F5F45]", variants[variant], sizes[size], className)} {...props}/>);
}
