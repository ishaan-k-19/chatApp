import { cn } from "@/lib/utils";
import { Skeleton } from "./skeleton";
import { ChatListSkeleton } from "./chatListSkeleton";

function LayoutSkeleton({ className, ...props }) {

  return (
    <div className="overflow-hidden w-full">
      <div className="grid grid-cols-12">
        <Skeleton
          className={"col-span-12 md:col-span-4 lg:col-span-6 hidden md:block min-h-[calc(100vh-8rem)] m-3 dark:bg-neutral-800 bg-neutral-200"}
        >
          <div className="absolute top-0 ml-20">
          <ChatListSkeleton/>
          </div>
        </Skeleton>
        <Skeleton
          className={"col-span-12 md:col-span-4 lg:col-span-6 hidden md:block min-h-[calc(100vh-8rem)] m-3 dark:bg-neutral-800 bg-neutral-200"}
        />
      </div>
    </div>
  );
}

export { LayoutSkeleton };
