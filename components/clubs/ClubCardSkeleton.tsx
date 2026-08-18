/**
 * Placeholder that matches ClubCard's structure and height, so the grid does
 * not jump when real results replace it.
 */
export default function ClubCardSkeleton() {
  return (
    <article className="overflow-hidden border border-stone-200 bg-white" aria-hidden="true">
      <div className="h-1.5 bg-stone-200" />
      <div className="animate-pulse p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="w-full">
            <div className="h-2.5 w-28 bg-stone-200" />
            <div className="mt-3 h-6 w-3/4 bg-stone-200" />
          </div>
          <div className="h-6 w-20 shrink-0 bg-stone-100" />
        </div>

        <div className="mt-4 min-h-[44px] space-y-2">
          <div className="h-3 w-full bg-stone-100" />
          <div className="h-3 w-2/3 bg-stone-100" />
        </div>

        <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 border-y border-stone-100 py-4">
          <div><div className="h-2.5 w-16 bg-stone-200" /><div className="mt-2 h-4 w-24 bg-stone-100" /></div>
          <div><div className="h-2.5 w-20 bg-stone-200" /><div className="mt-2 h-4 w-20 bg-stone-100" /></div>
          <div className="col-span-2"><div className="h-2.5 w-12 bg-stone-200" /><div className="mt-2 h-4 w-full bg-stone-100" /></div>
        </div>

        <div className="mt-5 h-10 w-full bg-stone-100" />
      </div>
    </article>
  );
}
