import { Search } from "lucide-react";

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-3xl border border-dashed border-[#D6C2AA] bg-[#FFF8ED] p-10 text-center">
      <Search className="mx-auto h-8 w-8 text-[#9A6B50]" aria-hidden="true" />
      <h3 className="mt-4 text-xl font-semibold text-[#342A24]">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#6C5C50]">{description}</p>
    </div>
  );
}
