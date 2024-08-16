import { cn } from "@/lib/utils"
import { Skeleton } from "./skeleton";

function ChatListSkeleton({
  className,
  ...props
}) {
  return (
    <div className="flex items-center gap-6 flex-col justify-center my-14">
      <div className="flex items-center gap-6">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
      </div>
      <div className="flex items-center gap-6">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
      </div>
      <div className="flex items-center gap-6">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
      </div>
      <div className="flex items-center gap-6">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
      </div>
      <div className="flex items-center gap-6">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
      </div>
    </div>
    
  );
}

export { ChatListSkeleton }
