export function LoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-4 bg-[#233648] rounded w-3/4"></div>
      <div className="h-4 bg-[#233648] rounded w-1/2"></div>
      <div className="h-4 bg-[#233648] rounded w-5/6"></div>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="animate-pulse rounded-lg border border-[#324d67] bg-[#192633] p-6 space-y-4">
      <div className="h-6 bg-[#233648] rounded w-1/2"></div>
      <div className="h-4 bg-[#233648] rounded w-full"></div>
      <div className="h-4 bg-[#233648] rounded w-3/4"></div>
    </div>
  );
}

export function TableSkeleton() {
  return (
    <div className="animate-pulse space-y-3">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex gap-4 py-3 border-b border-[#324d67]">
          <div className="h-10 w-10 bg-[#233648] rounded-full"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-[#233648] rounded w-1/4"></div>
            <div className="h-3 bg-[#233648] rounded w-1/3"></div>
          </div>
        </div>
      ))}
    </div>
  );
}









